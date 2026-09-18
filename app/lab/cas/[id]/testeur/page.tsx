import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getCase } from "@/lib/content";
import { requireSession } from "@/lib/session";
import { Sandbox } from "@/lib/sandbox/state";
import { listRuns, getRun, startRun, verifyRun, ragAnswers } from "@/lib/runner/campaigns";
import { competence } from "@/lib/referentiel";
import { Badge, Card, Notice, SectionTitle } from "@/components/ui";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function lancer(formData: FormData) {
  "use server";
  await requireSession();
  const pack = getCase(String(formData.get("case")));
  const campagne = pack?.evaluation.campagnes.find((c) => c.id === formData.get("campagne"));
  if (!pack || !campagne) return;
  await startRun(new Sandbox(pack), campagne);
  revalidatePath(`/lab/cas/${pack.meta.id}/testeur`);
}

async function verifier(formData: FormData) {
  "use server";
  await requireSession();
  const pack = getCase(String(formData.get("case")));
  if (!pack) return;
  const sb = new Sandbox(pack);
  const run = await getRun(sb, String(formData.get("run")));
  if (run) await verifyRun(sb, run);
  revalidatePath(`/lab/cas/${pack.meta.id}/testeur`);
}

async function reglages(formData: FormData) {
  "use server";
  await requireSession();
  const pack = getCase(String(formData.get("case")));
  if (!pack) return;
  const sb = new Sandbox(pack);
  const s = await sb.settings();
  const url = String(formData.get("webhook_url") ?? "").trim();
  await sb.saveSettings({
    webhook_url: /^https?:\/\//.test(url) ? url : undefined,
    chaos: {
      actif: formData.get("chaos_actif") === "on",
      limite_par_minute: Math.max(1, Number(formData.get("limite_par_minute")) || s.chaos.limite_par_minute),
      taux_erreur_503: Math.min(0.9, Math.max(0, Number(formData.get("taux_erreur_503")) || 0)),
      latence_ms: Math.max(0, Number(formData.get("latence_ms")) || 0),
    },
  });
  revalidatePath(`/lab/cas/${pack.meta.id}/testeur`);
}

async function reinitialiser(formData: FormData) {
  "use server";
  await requireSession();
  const pack = getCase(String(formData.get("case")));
  if (!pack) return;
  await new Sandbox(pack).reset(formData.get("scope") === "donnees" ? "donnees" : "tout");
  revalidatePath(`/lab/cas/${pack.meta.id}`, "layout");
}

const time = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

export default async function Testeur({ params }: PageProps<"/lab/cas/[id]/testeur">) {
  const { id } = await params;
  const pack = getCase(id);
  if (!pack) notFound();
  const sb = new Sandbox(pack);
  const [runs, settings, inbox] = await Promise.all([listRuns(sb), sb.settings(), sb.inbox()]);
  const ragCounts = Object.fromEntries(
    await Promise.all(runs.filter((r) => r.mode === "rag").map(async (r) => [r.id, Object.keys(await ragAnswers(sb, r.id)).length] as const)),
  );

  return (
    <div className="space-y-6">
      <Notice>
        Mode <strong>pull</strong> (n8n local) : lancez une campagne, laissez votre workflow interroger <code>GET /inbox?statut=nouveau</code>, traiter
        puis acquitter chaque message, et cliquez sur <strong>Vérifier</strong>. Mode <strong>push</strong> (optionnel) : renseignez l&apos;URL publique
        de votre webhook (tunnel) ; chaque message y est aussi envoyé, signé (en-tête <code>X-Lab-Signature</code>, HMAC-SHA256).
      </Notice>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6 min-w-0">
          <Card>
            <SectionTitle>Campagnes</SectionTitle>
            <div className="space-y-4">
              {pack.evaluation.campagnes.map((c) => (
                <div key={c.id} className="rounded-lg border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-accent">{c.palier}</span>
                        <h3 className="font-semibold">{c.titre}</h3>
                        <Badge>{c.mode}</Badge>
                        <Badge>{c.scenarios.length} scénario(s)</Badge>
                      </div>
                      <p className="text-sm text-muted mt-1">{c.description}</p>
                    </div>
                    <form action={lancer}>
                      <input type="hidden" name="case" value={pack.meta.id} />
                      <input type="hidden" name="campagne" value={c.id} />
                      <button className="rounded-lg bg-accent text-accent-fg px-4 py-2 text-sm font-medium hover:opacity-90">Lancer</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle sub="Chaque vérification évalue l'état actuel du sandbox.">Exécutions</SectionTitle>
            {runs.length === 0 && <Notice>Aucune campagne lancée.</Notice>}
            <div className="space-y-5">
              {runs.map((run) => {
                const campagne = pack.evaluation.campagnes.find((c) => c.id === run.campagne_id);
                const ids = new Set(run.messages.flatMap((m) => m.inbox_ids));
                const msgs = inbox.filter((m) => ids.has(m.id));
                const traites = msgs.filter((m) => m.statut === "traite").length;
                const res = run.resultat;
                return (
                  <div key={run.id} className="rounded-lg border border-line p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-mono text-xs">{run.id}</span>
                        <span className="font-medium">{campagne?.titre}</span>
                        <span className="text-muted text-xs">{time(run.cree_le)}</span>
                        {run.mode === "inbox" && (
                          <Badge tone={traites === msgs.length && msgs.length ? "ok" : "neutral"}>
                            {traites}/{msgs.length} messages acquittés
                          </Badge>
                        )}
                        {run.mode === "rag" && (
                          <Badge tone={ragCounts[run.id] ? "ok" : "neutral"}>
                            {ragCounts[run.id] ?? 0}/{campagne?.scenarios.length} réponses reçues
                          </Badge>
                        )}
                        {run.push && (
                          <Badge tone={run.push.resultats.every((r) => typeof r.status === "number" && r.status < 300) ? "ok" : "warn"}>
                            push : {run.push.resultats.filter((r) => typeof r.status === "number" && r.status < 300).length}/{run.push.resultats.length}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {res && (
                          <a
                            className="rounded-md border border-line px-2 py-1 text-xs hover:bg-surface-2"
                            href={`data:application/json;charset=utf-8,${encodeURIComponent(
                              JSON.stringify({ cas: pack.meta.id, run: run.id, campagne: run.campagne_id, palier: run.palier, ...res }, null, 2),
                            )}`}
                            download={`resultats-${pack.meta.id}-${run.campagne_id}-${run.id}.json`}
                          >
                            Export JSON
                          </a>
                        )}
                        <form action={verifier}>
                          <input type="hidden" name="case" value={pack.meta.id} />
                          <input type="hidden" name="run" value={run.id} />
                          <button className="rounded-lg border border-accent text-accent px-3 py-1.5 text-sm font-medium hover:bg-accent-soft">
                            {res ? "Revérifier" : "Vérifier"}
                          </button>
                        </form>
                      </div>
                    </div>

                    {res && (
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-3xl font-semibold">{res.score}%</div>
                          <div className="text-sm text-muted">
                            {res.points}/{res.total} points · vérifié le {time(res.verifie_le)}
                          </div>
                          {res.bloquants_echoues.length > 0 ? (
                            <Badge tone="danger">{res.bloquants_echoues.length} critère(s) bloquant(s) échoué(s)</Badge>
                          ) : (
                            <Badge tone="ok">Aucun critère bloquant échoué</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {res.par_competence.map((c) => (
                            <span
                              key={c.id}
                              title={competence(c.id)?.titre}
                              className={`rounded-md px-2 py-1 text-xs ${c.pct >= 90 ? "bg-ok-soft text-ok" : c.pct >= 70 ? "bg-warn-soft text-warn" : "bg-danger-soft text-danger"}`}
                            >
                              {c.id} · {c.pct}%
                            </span>
                          ))}
                        </div>
                        <details>
                          <summary className="cursor-pointer text-sm text-accent">Détail par scénario</summary>
                          <div className="mt-3 space-y-3">
                            {res.scenarios.map((s) => {
                              const ok = s.assertions.every((a) => a.ok);
                              return (
                                <div key={s.id} className="rounded-md border border-line p-3">
                                  <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <Badge tone={ok ? "ok" : "danger"}>{ok ? "OK" : "KO"}</Badge>
                                    <span className="font-medium">{s.titre}</span>
                                    <span className="text-xs text-muted">{s.description}</span>
                                  </div>
                                  <ul className="mt-2 space-y-1 text-xs">
                                    {s.assertions.map((a) => (
                                      <li key={a.id} className="flex gap-2">
                                        <span className={a.ok ? "text-ok" : "text-danger"}>{a.ok ? "✓" : "✗"}</span>
                                        <span className="font-mono text-muted w-9 shrink-0">{a.competence_id}</span>
                                        <span>
                                          {a.description}
                                          {a.bloquant && <span className="text-danger"> (bloquant)</span>} <span className="text-muted">— {a.detail}</span>
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <SectionTitle>Réglages</SectionTitle>
            <form action={reglages} className="space-y-3 text-sm">
              <input type="hidden" name="case" value={pack.meta.id} />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="chaos_actif" defaultChecked={settings.chaos.actif} />
                <span className="font-medium">Mode chaos</span>
              </label>
              <label className="block">
                <span className="text-muted text-xs">Limite de requêtes / minute</span>
                <input name="limite_par_minute" type="number" min={1} defaultValue={settings.chaos.limite_par_minute} className="mt-1 w-full rounded-md border border-line bg-surface px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-muted text-xs">Taux d&apos;erreurs 503 (0 à 0,9)</span>
                <input name="taux_erreur_503" type="number" step="0.05" min={0} max={0.9} defaultValue={settings.chaos.taux_erreur_503} className="mt-1 w-full rounded-md border border-line bg-surface px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-muted text-xs">Latence maximale (ms)</span>
                <input name="latence_ms" type="number" min={0} step={100} defaultValue={settings.chaos.latence_ms} className="mt-1 w-full rounded-md border border-line bg-surface px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-muted text-xs">URL de webhook (mode push, optionnel)</span>
                <input name="webhook_url" type="url" placeholder="https://…/webhook/…" defaultValue={settings.webhook_url ?? ""} className="mt-1 w-full rounded-md border border-line bg-surface px-2 py-1" />
              </label>
              <button className="w-full rounded-lg border border-line py-1.5 font-medium hover:bg-surface-2">Enregistrer</button>
            </form>
          </Card>
          <Card>
            <SectionTitle>Réinitialiser</SectionTitle>
            <p className="text-xs text-muted mb-3">
              « Données » remet contacts, demandes, tickets, inbox, outbox et journal dans leur état initial (conserve l&apos;historique des exécutions).
              « Tout » efface aussi exécutions et réglages.
            </p>
            <div className="flex gap-2">
              <form action={reinitialiser}>
                <input type="hidden" name="case" value={pack.meta.id} />
                <input type="hidden" name="scope" value="donnees" />
                <button className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2">Données</button>
              </form>
              <form action={reinitialiser}>
                <input type="hidden" name="case" value={pack.meta.id} />
                <input type="hidden" name="scope" value="tout" />
                <button className="rounded-lg border border-danger text-danger px-3 py-1.5 text-sm hover:bg-danger-soft">Tout</button>
              </form>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
