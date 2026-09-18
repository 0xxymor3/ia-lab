import { Faker, fr, en, base } from "@faker-js/faker";
import type { CasePack, ChampSpec, TableSpec } from "@/lib/schema/case-pack";
import { stripAccents } from "@/lib/text";

export type Row = Record<string, unknown>;
export type Dataset = Record<string, Row[]>;

// Générateur pseudo-aléatoire déterministe (mulberry32).
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const pad = (n: number, w: number) => String(n).padStart(w, "0");
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function pickWeighted<T>(r: () => number, values: T[], weights?: number[]): T {
  if (!weights || weights.length !== values.length) return values[Math.floor(r() * values.length)];
  const total = weights.reduce((a, b) => a + b, 0);
  let x = r() * total;
  for (let i = 0; i < values.length; i++) {
    x -= weights[i];
    if (x <= 0) return values[i];
  }
  return values[values.length - 1];
}

function callFaker(faker: Faker, path: string): unknown {
  const parts = path.split(".");
  let target: unknown = faker;
  let parent: unknown = faker;
  for (const p of parts) {
    parent = target;
    target = (target as Record<string, unknown>)?.[p];
    if (target === undefined) throw new Error(`Générateur Faker inconnu : ${path}`);
  }
  return typeof target === "function" ? (target as (...a: unknown[]) => unknown).call(parent) : target;
}

function frenchMobile(r: () => number) {
  const first = pickWeighted(r, ["06", "07", "02"], [5, 3, 2]);
  const groups = Array.from({ length: 4 }, () => pad(Math.floor(r() * 100), 2));
  return [first, ...groups].join(" ");
}

function interpolate(tpl: string, row: Row, faker: Faker) {
  return tpl.replace(/\{([a-zA-Z0-9_.]+)\}/g, (_, key: string) => {
    if (key in row) return String(row[key] ?? "");
    try {
      return String(callFaker(faker, key));
    } catch {
      return `{${key}}`;
    }
  });
}

type GenCtx = { r: () => number; faker: Faker; dataset: Dataset; refs: Map<string, string> };

function applyFormat(v: unknown, format?: "upper" | "lower" | "title") {
  if (typeof v !== "string" || !format) return v;
  if (format === "upper") return v.toUpperCase();
  if (format === "lower") return v.toLowerCase();
  return v.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
}

function genValue(champ: ChampSpec, index: number, row: Row, ctx: GenCtx) {
  return applyFormat(genRaw(champ, index, row, ctx), champ.options?.format);
}

function genRaw(champ: ChampSpec, index: number, row: Row, ctx: GenCtx) {
  const { r, faker, dataset } = ctx;
  const o = champ.options ?? {};
  if (champ.nullable && champ.type !== "id" && r() < champ.nullable) return null;
  if (o.correspondances) return o.correspondances.table[String(row[o.correspondances.depuis])] ?? null;
  if (o.copie) {
    const refChamp = ctx.refs.get(o.copie.ref_champ);
    const refId = row[o.copie.ref_champ];
    const refRow = refChamp ? (dataset[refChamp] ?? []).find((x) => x.id === refId) : undefined;
    return refRow ? (refRow[o.copie.champ] ?? null) : null;
  }
  switch (champ.type) {
    case "id":
      return `${o.prefixe ?? ""}${pad(index + 1, 4)}`;
    case "int": {
      const min = o.min ?? 0;
      const max = o.max ?? 100;
      return Math.floor(min + r() * (max - min + 1));
    }
    case "float": {
      const min = o.min ?? 0;
      const max = o.max ?? 1000;
      const d = o.decimales ?? 2;
      return Number((min + r() * (max - min)).toFixed(d));
    }
    case "bool":
      return r() < (o.proba ?? 0.5);
    case "enum":
      return pickWeighted(r, o.valeurs ?? [], o.poids);
    case "date":
    case "datetime": {
      let start: number;
      let end: number;
      if (o.base) {
        // Date dérivée : vide si la date de référence est vide, plafonnée par « jusqua ».
        if (!row[o.base]) return null;
        const b = new Date(String(row[o.base])).getTime();
        const [dmin, dmax] = o.decalage_jours ?? [0, 30];
        start = b + dmin * 86400000;
        end = b + dmax * 86400000;
        if (o.jusqua) {
          const cap = new Date(o.jusqua).getTime();
          if (start > cap) return null;
          end = Math.min(end, cap);
        }
      } else {
        start = new Date(o.depuis ?? "2025-01-01").getTime();
        end = new Date(o.jusqua ?? "2026-09-01").getTime();
      }
      const t = new Date(start + r() * Math.max(0, end - start));
      if (champ.type === "date") return isoDate(t);
      t.setUTCHours(7 + Math.floor(r() * 11), Math.floor(r() * 60), 0, 0);
      return t.toISOString();
    }
    case "phone":
      return frenchMobile(r);
    case "email": {
      const src = o.depuis_champs ?? [];
      const domaines = o.domaines ?? ["gmail.com", "orange.fr", "wanadoo.fr", "free.fr", "outlook.fr", "laposte.net", "sfr.fr"];
      if (src.length && src.every((f) => row[f])) {
        const local = src
          .map((f) => stripAccents(String(row[f])).toLowerCase().replace(/[^a-z0-9]+/g, ""))
          .join(pickWeighted(r, [".", "", "-", "_"], [6, 2, 1, 1]));
        return `${local}@${pickWeighted(r, domaines)}`;
      }
      return faker.internet.email().toLowerCase();
    }
    case "ref": {
      const rows = dataset[o.ref_table ?? ""] ?? [];
      if (!rows.length) return null;
      return rows[Math.floor(r() * rows.length)].id ?? null;
    }
    case "string":
    case "text": {
      if (o.modeles?.length) return interpolate(pickWeighted(r, o.modeles), row, faker);
      if (o.valeurs?.length) return pickWeighted(r, o.valeurs, o.poids);
      if (champ.generateur) return String(callFaker(faker, champ.generateur));
      return champ.type === "text" ? faker.lorem.sentence() : faker.lorem.word();
    }
  }
}

// ─── Anomalies ───────────────────────────────────────────────────────────────
function reformatPhone(v: string, r: () => number) {
  const digits = v.replace(/\D/g, "").replace(/^33/, "0");
  const d = digits.length === 9 ? `0${digits}` : digits;
  const styles = [
    () => d,
    () => `+33 ${d.slice(1, 2)} ${d.slice(2).match(/.{1,2}/g)?.join(" ")}`,
    () => d.match(/.{1,2}/g)?.join("."),
    () => `+33${d.slice(1)}`,
    () => d.match(/.{1,2}/g)?.join("-"),
  ];
  return styles[Math.floor(r() * styles.length)]() ?? v;
}

function breakEmail(v: string, r: () => number) {
  const variants = [
    () => v.replace("@", ""),
    () => v.replace(/\.(fr|com|net)$/, ".con"),
    () => v.replace("@", " @"),
    () => v.replace("@", "@@"),
  ];
  return variants[Math.floor(r() * variants.length)]();
}

function perturb(row: Row, r: () => number, stringFields: string[]) {
  const copy: Row = { ...row };
  for (const f of stringFields) {
    const v = copy[f];
    if (typeof v !== "string" || !v) continue;
    const x = r();
    if (x < 0.25) copy[f] = v.toUpperCase();
    else if (x < 0.45) copy[f] = stripAccents(v);
    else if (x < 0.6) copy[f] = ` ${v} `;
    else if (x < 0.7 && v.length > 4) {
      const i = 1 + Math.floor(r() * (v.length - 2));
      copy[f] = v.slice(0, i) + v.slice(i + 1);
    }
  }
  return copy;
}

function applyAnomalies(table: TableSpec, rows: Row[], r: () => number): Row[] {
  const out = [...rows];
  const idField = table.champs.find((c) => c.type === "id");
  const stringFields = table.champs.filter((c) => c.type === "string" || c.type === "text").map((c) => c.nom);
  const phoneFields = table.champs.filter((c) => c.type === "phone").map((c) => c.nom);
  const emailFields = table.champs.filter((c) => c.type === "email").map((c) => c.nom);
  const dateFields = table.champs.filter((c) => c.type === "date").map((c) => c.nom);
  let nextIndex = rows.length;
  const newId = () => (idField ? `${idField.options?.prefixe ?? ""}${pad(++nextIndex, 4)}` : undefined);

  for (const a of table.anomalies ?? []) {
    const n = Math.round(rows.length * a.taux);
    const targets = (fallback: string[]) => (a.champs?.length ? a.champs : fallback);
    for (let k = 0; k < n; k++) {
      const i = Math.floor(r() * out.length);
      const row = out[i];
      switch (a.type) {
        case "doublon_exact": {
          const dup: Row = { ...row };
          if (idField) dup[idField.nom] = newId();
          out.push(dup);
          break;
        }
        case "doublon_approx": {
          const dup = perturb(row, r, targets(stringFields));
          for (const p of phoneFields) if (typeof dup[p] === "string") dup[p] = reformatPhone(String(dup[p]), r);
          for (const e of emailFields) if (typeof dup[e] === "string" && r() < 0.3) dup[e] = String(dup[e]).toUpperCase();
          if (idField) dup[idField.nom] = newId();
          out.push(dup);
          break;
        }
        case "telephone_format":
          for (const f of targets(phoneFields)) if (typeof row[f] === "string") row[f] = reformatPhone(String(row[f]), r);
          break;
        case "email_invalide":
          for (const f of targets(emailFields)) if (typeof row[f] === "string") row[f] = breakEmail(String(row[f]), r);
          break;
        case "casse":
          for (const f of targets(stringFields)) if (typeof row[f] === "string") row[f] = r() < 0.5 ? String(row[f]).toUpperCase() : String(row[f]).toLowerCase();
          break;
        case "espaces":
          for (const f of targets(stringFields)) if (typeof row[f] === "string") row[f] = `  ${row[f]} `;
          break;
        case "valeur_manquante":
          for (const f of targets([...emailFields, ...phoneFields])) row[f] = null;
          break;
        case "date_format":
          for (const f of targets(dateFields))
            if (typeof row[f] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(String(row[f]))) {
              const [y, m, d] = String(row[f]).split("-");
              row[f] = `${d}/${m}/${y}`;
            }
          break;
      }
    }
  }
  return out;
}

// ─── Génération ──────────────────────────────────────────────────────────────
export function generateTable(table: TableSpec, seed: number, dataset: Dataset): Row[] {
  const tableSeed = (seed ^ hashString(table.nom)) >>> 0;
  const r = rng(tableSeed);
  const faker = new Faker({ locale: [fr, en, base], seed: tableSeed });
  const refs = new Map(table.champs.filter((c) => c.type === "ref" && c.options?.ref_table).map((c) => [c.nom, c.options!.ref_table!]));
  const rows: Row[] = [];
  for (let i = 0; i < table.lignes; i++) {
    const row: Row = {};
    for (const champ of table.champs) row[champ.nom] = genValue(champ, i, row, { r, faker, dataset, refs });
    rows.push(row);
  }
  const masked = table.champs.filter((c) => c.masque).map((c) => c.nom);
  const withAnomalies = applyAnomalies(table, rows, r).map((row) => {
    for (const m of masked) delete row[m];
    return row;
  });
  return [...withAnomalies, ...(table.fixtures ?? []).map((f) => ({ ...f }))];
}

export function generateDataset(pack: Pick<CasePack, "donnees">): Dataset {
  const dataset: Dataset = {};
  // Les tables sont générées dans l'ordre déclaré : une table référencée doit précéder la table qui la référence.
  for (const table of pack.donnees.tables) dataset[table.nom] = generateTable(table, pack.donnees.seed, dataset);
  return dataset;
}

const cache = new Map<string, Dataset>();
export function datasetFor(pack: Pick<CasePack, "donnees" | "meta">): Dataset {
  const key = `${pack.meta.id}:${pack.meta.version}:${pack.donnees.seed}`;
  let ds = cache.get(key);
  if (!ds) {
    ds = generateDataset(pack);
    cache.set(key, ds);
  }
  return ds;
}
