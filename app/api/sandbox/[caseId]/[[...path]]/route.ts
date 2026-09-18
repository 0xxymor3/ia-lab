import type { NextRequest } from "next/server";
import crypto from "node:crypto";
import { getCase } from "@/lib/content";
import { labConfigured, sandboxApiKey } from "@/lib/auth";
import { Sandbox } from "@/lib/sandbox/state";
import { openApiSpec } from "@/lib/sandbox/openapi";
import { latestRun, getRun, ragQuestions, saveRagAnswers } from "@/lib/runner/campaigns";
import { norm, getPath, type Row } from "@/lib/runner/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Ctx = { params: Promise<{ caseId: string; path?: string[] }> };

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(data, { status, headers: { "cache-control": "no-store", ...headers } });
const error = (status: number, code: string, message: string, details?: unknown, headers?: Record<string, string>) =>
  json({ error: { code, message, ...(details ? { details } : {}) } }, status, headers);

function authorized(req: NextRequest, caseId: string) {
  const header = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!header) return false;
  const expected = sandboxApiKey(caseId);
  return header.length === expected.length && crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}

async function readBody(req: NextRequest): Promise<Row | Row[] | null | "invalid"> {
  const text = await req.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return "invalid";
  }
}

function paginate(rows: Row[], sp: URLSearchParams) {
  const reserved = new Set(["page", "limit", "sort", "q", "updated_since"]);
  let out = rows;
  for (const [key, value] of sp.entries()) {
    if (reserved.has(key)) continue;
    out = out.filter((r) => norm(getPath(r, key)) === norm(value));
  }
  const q = sp.get("q");
  if (q) out = out.filter((r) => Object.values(r).some((v) => typeof v === "string" && norm(v).includes(norm(q))));
  const since = sp.get("updated_since");
  if (since) out = out.filter((r) => String(r.updated_at ?? r.created_at ?? "") > since);
  const sort = sp.get("sort");
  if (sort) {
    const desc = sort.startsWith("-");
    const field = sort.replace(/^-/, "");
    out = [...out].sort((a, b) => String(getPath(a, field) ?? "").localeCompare(String(getPath(b, field) ?? ""), "fr", { numeric: true }) * (desc ? -1 : 1));
  }
  const limit = Math.min(200, Math.max(1, Number(sp.get("limit") ?? 50) || 50));
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
  const data = out.slice((page - 1) * limit, page * limit);
  return { data, page, limit, total: out.length, has_more: page * limit < out.length };
}

async function handle(req: NextRequest, ctx: Ctx) {
  const { caseId, path = [] } = await ctx.params;
  const pack = getCase(caseId);
  if (!pack) return error(404, "cas_inconnu", `Cas inconnu : ${caseId}`);
  const method = req.method.toUpperCase();
  const sp = req.nextUrl.searchParams;

  if (path.length === 1 && path[0] === "openapi.json" && method === "GET")
    return json(openApiSpec(pack, req.nextUrl.origin));

  if (!labConfigured()) return error(503, "non_configure", "Sandbox non configuré (SANDBOX_SECRET / LAB_PASSWORD manquants).");
  if (!authorized(req, caseId)) return error(401, "non_authentifie", "Clé d'API absente ou invalide (en-tête X-API-Key).");

  const sb = new Sandbox(pack);
  const settings = await sb.settings();
  if (settings.chaos.actif) {
    const { n, retryAfter } = await sb.rateLimitHit();
    if (n > settings.chaos.limite_par_minute)
      return error(429, "trop_de_requetes", `Limite de ${settings.chaos.limite_par_minute} requêtes/minute dépassée.`, undefined, {
        "retry-after": String(retryAfter),
      });
    if (Math.random() < settings.chaos.taux_erreur_503) return error(503, "indisponible", "Service momentanément indisponible, réessayez.");
    if (settings.chaos.latence_ms > 0) await new Promise((r) => setTimeout(r, Math.random() * settings.chaos.latence_ms));
  }

  const [seg, id, action] = path;

  // Index
  if (!seg) {
    return json({
      cas: pack.meta.id,
      entreprise: pack.entreprise.nom,
      ressources: pack.api.ressources.map((r) => ({ nom: r.nom, operations: r.operations, description: r.description })),
      inbox: pack.api.inbox.active,
      outbox: pack.api.outbox.active,
      documents: pack.api.documents_exposes,
      openapi: `${req.nextUrl.origin}/api/sandbox/${pack.meta.id}/openapi.json`,
    });
  }

  // Inbox
  if (seg === "inbox" && pack.api.inbox.active) {
    if (!id && method === "GET") {
      let msgs = await sb.inbox();
      const statut = sp.get("statut");
      if (statut) msgs = msgs.filter((m) => m.statut === statut);
      const limit = Math.min(200, Number(sp.get("limit") ?? 50) || 50);
      return json({ data: msgs.slice(0, limit), total: msgs.length });
    }
    if (id && !action && method === "GET") {
      const m = await sb.inboxMessage(id);
      return m ? json(m) : error(404, "introuvable", `Message introuvable : ${id}`);
    }
    if (id && (action === "ack" && method === "POST" || !action && method === "PATCH")) {
      const body = await readBody(req);
      if (body === "invalid") return error(400, "json_invalide", "Corps JSON invalide.");
      const resultat = body && !Array.isArray(body) ? body.resultat : undefined;
      const m = await sb.ackInbox(id, resultat);
      return m ? json(m) : error(404, "introuvable", `Message introuvable : ${id}`);
    }
    return error(405, "methode_non_autorisee", `${method} non autorisé sur /inbox`);
  }

  // Outbox
  if (seg === "outbox" && pack.api.outbox.active) {
    if (!id && method === "GET") return json(paginate((await sb.outbox()) as Row[], sp));
    if (!id && method === "POST") {
      const body = await readBody(req);
      if (body === "invalid" || !body || Array.isArray(body)) return error(400, "json_invalide", "Corps JSON objet attendu.");
      const missing = ["to", "subject", "body"].filter((f) => !body[f]);
      if (missing.length) return error(422, "validation", "Champs requis manquants.", missing);
      if (body.statut && !["brouillon", "a_valider", "envoye"].includes(String(body.statut)))
        return error(422, "validation", "statut invalide (brouillon, a_valider, envoye).");
      return json(await sb.createOutbox(body), 201);
    }
    if (id && method === "GET") {
      const m = (await sb.outbox()).find((o) => o.id === id);
      return m ? json(m) : error(404, "introuvable", `Email introuvable : ${id}`);
    }
    if (id && (method === "PATCH" || method === "PUT")) {
      const body = await readBody(req);
      if (body === "invalid" || !body || Array.isArray(body)) return error(400, "json_invalide", "Corps JSON objet attendu.");
      const m = await sb.updateOutbox(id, body);
      return m ? json(m) : error(404, "introuvable", `Email introuvable : ${id}`);
    }
    return error(405, "methode_non_autorisee", `${method} non autorisé sur /outbox`);
  }

  // Documents
  if (seg === "documents" && pack.api.documents_exposes && method === "GET") {
    if (!id) return json({ data: pack.documents.map((d) => ({ id: d.id, titre: d.titre, type: d.type, auteur: d.auteur, date: d.date })), total: pack.documents.length });
    const d = pack.documents.find((x) => x.id === id);
    return d ? json(d) : error(404, "introuvable", `Document introuvable : ${id}`);
  }

  // RAG
  if (seg === "rag") {
    if (id === "questions" && method === "GET") {
      const runId = sp.get("run");
      const run = runId ? await getRun(sb, runId) : await latestRun(sb, "rag");
      if (!run || run.mode !== "rag") return error(404, "aucune_campagne", "Aucune campagne RAG lancée. Lancez-la depuis le testeur.");
      return json({ run_id: run.id, questions: await ragQuestions(sb, run) });
    }
    if (id === "answers" && method === "POST") {
      const body = await readBody(req);
      if (body === "invalid" || !body || Array.isArray(body)) return error(400, "json_invalide", "Corps JSON objet attendu.");
      const run = await getRun(sb, String(body.run_id ?? ""));
      if (!run || run.mode !== "rag") return error(404, "run_inconnu", "run_id inconnu ou non RAG.");
      const reponses = Array.isArray(body.reponses) ? (body.reponses as Row[]) : [];
      const valid = reponses.filter((r) => typeof r.question_id === "string" && typeof r.reponse === "string");
      if (!valid.length) return error(422, "validation", "reponses[] attendu : { question_id, reponse, sources[] }.");
      const now = new Date().toISOString();
      await saveRagAnswers(
        sb,
        run.id,
        Object.fromEntries(
          valid.map((r) => [
            String(r.question_id),
            { reponse: String(r.reponse), sources: Array.isArray(r.sources) ? r.sources.map(String) : [], recu_le: now },
          ]),
        ),
      );
      return json({ recu: valid.length, run_id: run.id });
    }
    return error(404, "introuvable", "Route RAG inconnue.");
  }

  // Ressources génériques
  const r = sb.ressource(seg);
  if (!r) return error(404, "ressource_inconnue", `Ressource inconnue : ${seg}`);
  const allow = (op: (typeof r.operations)[number]) => r.operations.includes(op);

  if (!id) {
    if (method === "GET" && allow("list")) return json(paginate(await sb.records(seg), sp));
    if (method === "POST" && allow("create")) {
      const body = await readBody(req);
      if (body === "invalid" || !body || Array.isArray(body)) return error(400, "json_invalide", "Corps JSON objet attendu.");
      const erreurs = sb.validate(r, body, false);
      if (erreurs.length) return error(422, "validation", "Données invalides.", erreurs);
      const res = await sb.create(seg, body);
      if (res.conflit) return error(409, "conflit", `Un élément avec l'id ${res.id} existe déjà.`);
      return json(res.rec, 201);
    }
  } else {
    if (method === "GET" && allow("get")) {
      const rec = await sb.record(seg, id);
      return rec ? json(rec) : error(404, "introuvable", `Élément introuvable : ${id}`);
    }
    if ((method === "PATCH" || method === "PUT") && allow("update")) {
      const body = await readBody(req);
      if (body === "invalid" || !body || Array.isArray(body)) return error(400, "json_invalide", "Corps JSON objet attendu.");
      const erreurs = sb.validate(r, body, true);
      if (erreurs.length) return error(422, "validation", "Données invalides.", erreurs);
      const rec = await sb.update(seg, id, body);
      return rec ? json(rec) : error(404, "introuvable", `Élément introuvable : ${id}`);
    }
    if (method === "DELETE" && allow("delete")) {
      return (await sb.remove(seg, id)) ? new Response(null, { status: 204 }) : error(404, "introuvable", `Élément introuvable : ${id}`);
    }
  }
  return error(405, "methode_non_autorisee", `${method} non autorisé sur /${seg}${id ? "/{id}" : ""}`);
}

async function withLog(req: NextRequest, ctx: Ctx) {
  const t0 = Date.now();
  const clone = req.clone();
  let res: Response;
  try {
    res = await handle(req, ctx);
  } catch (e) {
    res = error(500, "erreur_interne", (e as Error).message);
  }
  try {
    const { caseId, path = [] } = await ctx.params;
    const pack = getCase(caseId);
    if (pack && !(path[0] === "openapi.json")) {
      const body = ["POST", "PATCH", "PUT"].includes(req.method) ? (await clone.text()).slice(0, 400) : undefined;
      await new Sandbox(pack).log({
        ts: new Date().toISOString(),
        method: req.method,
        path: `/${path.join("/")}${req.nextUrl.search}`,
        status: res.status,
        ms: Date.now() - t0,
        apercu: body,
      });
    }
  } catch {
    // la journalisation ne doit jamais casser l'API
  }
  return res;
}

export const GET = withLog;
export const POST = withLog;
export const PATCH = withLog;
export const PUT = withLog;
export const DELETE = withLog;
