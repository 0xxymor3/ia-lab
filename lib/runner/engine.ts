// Moteur d'évaluation déclaratif : fonctions pures, testées par vitest.
import type { Assertion, Filtre } from "@/lib/schema/case-pack";
import { stripAccents } from "@/lib/text";

export type Row = Record<string, unknown>;

export type AssertionResult = {
  id: string;
  description: string;
  competence_id: string;
  poids: number;
  bloquant: boolean;
  ok: boolean;
  detail: string;
};

export type RagAnswer = { reponse: string; sources: string[] };

export type EvalContext = {
  vars: Record<string, string>;
  collection: (cible: string) => Promise<Row[]>;
  scenarioInbox: { statut: string }[];
  ragAnswer?: RagAnswer | null;
};

export const norm = (v: unknown) => stripAccents(String(v ?? "")).toLowerCase().replace(/\s+/g, " ").trim();

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Row)[key] : undefined), obj);
}

export function interpolate<T>(value: T, vars: Record<string, string>): T {
  if (typeof value === "string") return value.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => vars[key] ?? "") as T;
  if (Array.isArray(value)) return value.map((v) => interpolate(v, vars)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, interpolate(v, vars)])) as T;
  return value;
}

function eqLoose(value: unknown, expected: unknown): boolean {
  if (Array.isArray(value)) return value.some((v) => eqLoose(v, expected));
  if (expected === null) return value === null || value === undefined;
  if (typeof expected === "number") return value !== null && value !== "" && Number(value) === expected;
  if (typeof expected === "boolean") return value === expected || norm(value) === String(expected);
  return norm(value) === norm(expected);
}

function compare(value: unknown, bound: number | string): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof bound === "number") {
    const n = Number(value);
    return Number.isNaN(n) ? null : n - bound;
  }
  const a = Date.parse(String(value));
  const b = Date.parse(bound);
  if (!Number.isNaN(a) && !Number.isNaN(b)) return a - b;
  return String(value).localeCompare(bound);
}

export function matchFiltre(value: unknown, f: Filtre): boolean {
  if (f === null || typeof f !== "object") return eqLoose(value, f);
  if ("eq" in f) return eqLoose(value, f.eq);
  if ("ieq" in f) return eqLoose(value, f.ieq);
  if ("ne" in f) return !eqLoose(value, f.ne);
  if ("contains" in f) {
    const needle = norm(f.contains);
    return Array.isArray(value) ? value.some((v) => norm(v).includes(needle)) : norm(value).includes(needle);
  }
  if ("regex" in f) {
    const re = new RegExp(f.regex, f.casse ? "" : "i");
    return Array.isArray(value) ? value.some((v) => re.test(String(v))) : value !== null && value !== undefined && re.test(String(value));
  }
  if ("in" in f) return f.in.some((x) => eqLoose(value, x));
  if ("exists" in f) {
    const present = value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
    return present === f.exists;
  }
  if ("gte" in f) {
    const c = compare(value, f.gte);
    return c !== null && c >= 0;
  }
  if ("lte" in f) {
    const c = compare(value, f.lte);
    return c !== null && c <= 0;
  }
  return false;
}

export function filterRows(rows: Row[], where: Record<string, Filtre> | undefined) {
  if (!where) return rows;
  // Le chemin « * » teste toutes les valeurs de premier niveau de l'enregistrement.
  return rows.filter((row) =>
    Object.entries(where).every(([path, f]) =>
      path === "*" ? Object.values(row).some((v) => matchFiltre(v, f)) : matchFiltre(getPath(row, path), f),
    ),
  );
}

const OPS = {
  eq: (a: number, b: number) => a === b,
  gte: (a: number, b: number) => a >= b,
  lte: (a: number, b: number) => a <= b,
  gt: (a: number, b: number) => a > b,
  lt: (a: number, b: number) => a < b,
};
const OP_LABEL = { eq: "=", gte: "≥", lte: "≤", gt: ">", lt: "<" };

const REFUS = [
  /je ne (sais|trouve|dispose) pas/,
  /(aucune|pas d')information/,
  /ne (figure|se trouve|trouve) pas/,
  /pas (dans|present|mentionne)/,
  /impossible de (repondre|trouver)/,
  /(documentation|documents?|corpus|sources?) (ne|n')/,
  /je n'ai pas/,
  /hors (du )?(perimetre|corpus)/,
  /(contacter|voir avec|adressez-vous|rapprochez-vous|consulter|verifier aupres|se referer)/,
  /(ne peux|ne suis pas en mesure de|pas en mesure de) (pas )?(repondre|communiquer|fournir|donner)/,
  /(orienter|oriente|orientez|renvoyer|renvoie|renvoyez) (le client |la cliente |les clients )?vers/,
];

export async function evaluateAssertion(a: Assertion, ctx: EvalContext): Promise<AssertionResult> {
  const base = {
    id: a.id,
    description: interpolate(a.description, ctx.vars),
    competence_id: a.competence_id,
    poids: a.poids,
    bloquant: Boolean(a.bloquant),
  };
  switch (a.type) {
    case "count": {
      const rows = filterRows(await ctx.collection(a.cible), interpolate(a.where, ctx.vars));
      const ok = OPS[a.op](rows.length, a.valeur);
      return { ...base, ok, detail: `${rows.length} élément(s) trouvé(s) — attendu ${OP_LABEL[a.op]} ${a.valeur}` };
    }
    case "champ": {
      const rows = filterRows(await ctx.collection(a.cible), interpolate(a.where, ctx.vars));
      if (!rows.length) return { ...base, ok: false, detail: "Aucun enregistrement correspondant trouvé" };
      const attendu = interpolate(a.attendu, ctx.vars);
      const values = rows.map((r) => getPath(r, a.champ));
      const ok = values.some((v) => matchFiltre(v, attendu));
      const shown = values.slice(0, 3).map((v) => JSON.stringify(v ?? null)).join(", ");
      return { ...base, ok, detail: `${a.champ} = ${shown}${values.length > 3 ? "…" : ""}` };
    }
    case "unique": {
      const rows = filterRows(await ctx.collection(a.cible), interpolate(a.where, ctx.vars));
      const seen = new Map<string, number>();
      for (const r of rows) {
        const v = norm(getPath(r, a.champ));
        if (v) seen.set(v, (seen.get(v) ?? 0) + 1);
      }
      const dups = [...seen.entries()].filter(([, n]) => n > 1);
      return {
        ...base,
        ok: dups.length === 0,
        detail: dups.length
          ? `${dups.length} valeur(s) en double, ex. ${dups.slice(0, 3).map(([v, n]) => `${v} (×${n})`).join(", ")}`
          : `Aucun doublon sur ${a.champ} (${rows.length} éléments)`,
      };
    }
    case "acquitte": {
      const total = ctx.scenarioInbox.length;
      const done = ctx.scenarioInbox.filter((m) => m.statut === "traite").length;
      return { ...base, ok: total > 0 && done === total, detail: `${done}/${total} message(s) acquitté(s)` };
    }
    case "rag_contenu": {
      if (!ctx.ragAnswer) return { ...base, ok: false, detail: "Aucune réponse reçue" };
      const text = norm(ctx.ragAnswer.reponse);
      const missing = a.groupes.filter((g) => !g.some((term) => text.includes(norm(term))));
      return {
        ...base,
        ok: missing.length === 0,
        detail: missing.length ? `Élément(s) manquant(s) : ${missing.map((g) => g.join(" / ")).join(" ; ")}` : "Éléments attendus présents",
      };
    }
    case "rag_citation": {
      if (!ctx.ragAnswer) return { ...base, ok: false, detail: "Aucune réponse reçue" };
      const cited = ctx.ragAnswer.sources ?? [];
      const ok = cited.some((s) => a.sources.includes(s));
      return { ...base, ok, detail: `Sources citées : ${cited.length ? cited.join(", ") : "aucune"}` };
    }
    case "rag_refus": {
      if (!ctx.ragAnswer) return { ...base, ok: false, detail: "Aucune réponse reçue" };
      const text = norm(ctx.ragAnswer.reponse);
      const ok = REFUS.some((re) => re.test(text));
      return { ...base, ok, detail: ok ? "Refus / renvoi détecté" : "La réponse n'exprime pas de refus alors que l'information est hors corpus" };
    }
  }
}

export type ScenarioResult = {
  id: string;
  titre: string;
  description: string;
  assertions: AssertionResult[];
};

export type RunResult = {
  verifie_le: string;
  score: number;
  points: number;
  total: number;
  par_competence: { id: string; points: number; total: number; pct: number }[];
  bloquants_echoues: string[];
  scenarios: ScenarioResult[];
};

export function summarize(scenarios: ScenarioResult[]): RunResult {
  const all = scenarios.flatMap((s) => s.assertions);
  const total = all.reduce((acc, a) => acc + a.poids, 0);
  const points = all.filter((a) => a.ok).reduce((acc, a) => acc + a.poids, 0);
  const byComp = new Map<string, { points: number; total: number }>();
  for (const a of all) {
    const c = byComp.get(a.competence_id) ?? { points: 0, total: 0 };
    c.total += a.poids;
    if (a.ok) c.points += a.poids;
    byComp.set(a.competence_id, c);
  }
  return {
    verifie_le: new Date().toISOString(),
    score: total ? Math.round((points / total) * 100) : 0,
    points,
    total,
    par_competence: [...byComp.entries()]
      .map(([id, v]) => ({ id, ...v, pct: v.total ? Math.round((v.points / v.total) * 100) : 0 }))
      .sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true })),
    bloquants_echoues: scenarios.flatMap((s) => s.assertions.filter((a) => a.bloquant && !a.ok).map((a) => `${s.id} › ${a.description}`)),
    scenarios,
  };
}
