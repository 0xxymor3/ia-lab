"use server";

import { CasePackSchema, formatZodIssues } from "@/lib/schema/case-pack";
import { generateDataset } from "@/lib/data/generator";
import { requireSession } from "@/lib/session";

export type ValidationResult =
  | { ok: true; resume: { id: string; titre: string; tables: Record<string, number>; campagnes: number; scenarios: number; questions_jury: number } }
  | { ok: false; erreurs: string[] };

export async function validerPack(texte: string): Promise<ValidationResult> {
  await requireSession();
  let data: unknown;
  try {
    data = JSON.parse(texte);
  } catch (e) {
    return { ok: false, erreurs: [`JSON invalide : ${(e as Error).message}`] };
  }
  // Un pack livré en plusieurs parties peut être collé sous forme de tableau : [partie1, partie2, partie3].
  if (Array.isArray(data)) data = Object.assign({}, ...data);
  const parsed = CasePackSchema.safeParse(data);
  if (!parsed.success) return { ok: false, erreurs: formatZodIssues(parsed.error) };
  const pack = parsed.data;
  try {
    const ds = generateDataset(pack);
    return {
      ok: true,
      resume: {
        id: pack.meta.id,
        titre: pack.meta.titre,
        tables: Object.fromEntries(Object.entries(ds).map(([k, v]) => [k, v.length])),
        campagnes: pack.evaluation.campagnes.length,
        scenarios: pack.evaluation.campagnes.reduce((n, c) => n + c.scenarios.length, 0),
        questions_jury: pack.evaluation.jury.length,
      },
    };
  } catch (e) {
    return { ok: false, erreurs: [`Génération des données impossible : ${(e as Error).message}`] };
  }
}
