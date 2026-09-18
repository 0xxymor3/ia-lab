import { signPayload } from "@/lib/auth";
import type { Campagne } from "@/lib/schema/case-pack";
import { k, newId, type InboxMessage, type Sandbox } from "@/lib/sandbox/state";
import { evaluateAssertion, summarize, type RagAnswer, type Row, type RunResult, type ScenarioResult } from "@/lib/runner/engine";

export type Run = {
  id: string;
  campagne_id: string;
  palier: string;
  mode: Campagne["mode"];
  cree_le: string;
  statut: "en_cours" | "verifie";
  messages: { scenario_id: string; inbox_ids: string[]; message_id: string }[];
  push?: { url: string; resultats: { inbox_id: string; status: number | string }[] };
  resultat?: RunResult;
};

const DOMAIN = "lab.local";

export async function listRuns(sb: Sandbox): Promise<Run[]> {
  const all = await sb.store.hgetall<Run>(k(sb.caseId, "runs"));
  return Object.values(all).sort((a, b) => b.cree_le.localeCompare(a.cree_le));
}

export async function getRun(sb: Sandbox, id: string) {
  return sb.store.hget<Run>(k(sb.caseId, "runs"), id);
}

async function saveRun(sb: Sandbox, run: Run) {
  await sb.store.hset(k(sb.caseId, "runs"), { [run.id]: run });
}

export async function latestRun(sb: Sandbox, mode: Campagne["mode"]) {
  return (await listRuns(sb)).find((r) => r.mode === mode) ?? null;
}

export async function startRun(sb: Sandbox, campagne: Campagne): Promise<Run> {
  const run: Run = {
    id: newId("RUN-"),
    campagne_id: campagne.id,
    palier: campagne.palier,
    mode: campagne.mode,
    cree_le: new Date().toISOString(),
    statut: "en_cours",
    messages: [],
  };

  if (campagne.mode === "inbox") {
    const base = Date.now();
    const inbox: InboxMessage[] = [];
    campagne.scenarios.forEach((s, i) => {
      if (!s.evenement) return;
      const message_id = `<${s.id}.${run.id.toLowerCase()}@${DOMAIN}>`;
      const copies = s.evenement.duplique ? 2 : 1;
      const ids: string[] = [];
      for (let c = 0; c < copies; c++) {
        const id = newId("MSG-");
        ids.push(id);
        inbox.push({
          id,
          message_id,
          run_id: run.id,
          scenario_id: s.id,
          canal: s.evenement.canal,
          de: s.evenement.de,
          nom: s.evenement.nom,
          objet: s.evenement.objet,
          corps: s.evenement.corps,
          pieces_jointes: s.evenement.pieces_jointes,
          recu_le: new Date(base + i * 60000 + c * 120000).toISOString(),
          statut: "nouveau",
        });
      }
      run.messages.push({ scenario_id: s.id, inbox_ids: ids, message_id });
    });
    await sb.pushInbox(inbox);

    const { webhook_url } = await sb.settings();
    if (webhook_url) {
      run.push = { url: webhook_url, resultats: [] };
      for (const m of inbox) {
        const body = JSON.stringify(m);
        try {
          const res = await fetch(webhook_url, {
            method: "POST",
            headers: { "content-type": "application/json", "x-lab-signature": signPayload(body), "x-lab-case": sb.caseId },
            body,
            signal: AbortSignal.timeout(8000),
          });
          run.push.resultats.push({ inbox_id: m.id, status: res.status });
        } catch (e) {
          run.push.resultats.push({ inbox_id: m.id, status: (e as Error).name });
        }
      }
    }
  }

  await saveRun(sb, run);
  return run;
}

export async function ragQuestions(sb: Sandbox, run: Run) {
  const campagne = sb.pack.evaluation.campagnes.find((c) => c.id === run.campagne_id);
  return (campagne?.scenarios ?? []).map((s) => ({ id: s.id, question: s.question ?? "" }));
}

export async function saveRagAnswers(sb: Sandbox, runId: string, answers: Record<string, RagAnswer & { recu_le: string }>) {
  await sb.store.hset(k(sb.caseId, "rag", runId), answers);
}

export async function ragAnswers(sb: Sandbox, runId: string) {
  return sb.store.hgetall<RagAnswer & { recu_le: string }>(k(sb.caseId, "rag", runId));
}

export async function verifyRun(sb: Sandbox, run: Run): Promise<RunResult> {
  const campagne = sb.pack.evaluation.campagnes.find((c) => c.id === run.campagne_id);
  if (!campagne) throw new Error(`Campagne introuvable : ${run.campagne_id}`);

  const cache = new Map<string, Promise<Row[]>>();
  const collection = (cible: string) => {
    if (!cache.has(cible)) {
      const load = async (): Promise<Row[]> => {
        if (cible === "outbox") return (await sb.outbox()) as Row[];
        if (cible === "inbox") return (await sb.inbox()) as Row[];
        if (cible.startsWith("hooks:")) return sb.hooks(cible.slice(6));
        if (cible.startsWith("ressource:")) return sb.records(cible.slice(10));
        return [];
      };
      cache.set(cible, load());
    }
    return cache.get(cible)!;
  };

  const inbox = await sb.inbox();
  const answers = run.mode === "rag" ? await ragAnswers(sb, run.id) : {};

  const scenarios: ScenarioResult[] = [];
  for (const s of campagne.scenarios) {
    const msg = run.messages.find((m) => m.scenario_id === s.id);
    const scenarioInbox = inbox.filter((m) => msg?.inbox_ids.includes(m.id));
    const vars: Record<string, string> = {
      "run.id": run.id,
      "scenario.id": s.id,
      "evenement.message_id": msg?.message_id ?? "",
      "evenement.de": s.evenement?.de ?? "",
      "evenement.objet": s.evenement?.objet ?? "",
    };
    const ragAnswer = answers[s.id] ?? null;
    const assertions = [];
    for (const a of s.assertions) assertions.push(await evaluateAssertion(a, { vars, collection, scenarioInbox, ragAnswer }));
    scenarios.push({ id: s.id, titre: s.titre, description: s.description, assertions });
  }

  const resultat = summarize(scenarios);
  await saveRun(sb, { ...run, statut: "verifie", resultat });
  return resultat;
}
