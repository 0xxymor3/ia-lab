import { describe, expect, it } from "vitest";
import { evaluateAssertion, filterRows, interpolate, matchFiltre, summarize, type EvalContext } from "@/lib/runner/engine";
import type { Assertion } from "@/lib/schema/case-pack";

const rows = [
  { id: "1", email: "Anne.LeFloch@Orange.fr", statut: "nouvelle", notes: "RAS", n: 3 },
  { id: "2", email: "b@x.fr", statut: "gagnee", notes: "IBAN FR76 3000 4000 0312", n: 10 },
];
const ctx = (over: Partial<EvalContext> = {}): EvalContext => ({
  vars: { "evenement.message_id": "<m1@lab>" },
  collection: async () => rows,
  scenarioInbox: [],
  ...over,
});
const base = { id: "a", competence_id: "C2.3", poids: 2, description: "test" } as const;

describe("filtres", () => {
  it("compare sans tenir compte de la casse ni des accents", () => {
    expect(matchFiltre("Élodie ", "elodie")).toBe(true);
    expect(matchFiltre("Anne.LeFloch@Orange.fr", { ieq: "anne.lefloch@orange.fr" })).toBe(true);
  });
  it("gère in, exists, regex (avec et sans casse), gte/lte", () => {
    expect(matchFiltre("gagnee", { in: ["gagnee", "devis_envoye"] })).toBe(true);
    expect(matchFiltre(null, { exists: false })).toBe(true);
    expect(matchFiltre("ABC", { regex: "abc" })).toBe(true);
    expect(matchFiltre("ABC", { regex: "abc", casse: true })).toBe(false);
    expect(matchFiltre(5, { gte: 3 })).toBe(true);
    expect(matchFiltre("2026-09-10", { lte: "2026-09-01" })).toBe(false);
  });
  it("le chemin * teste toutes les valeurs", () => {
    expect(filterRows(rows, { "*": { regex: "FR\\d{2}\\s?\\d{4}" } })).toHaveLength(1);
  });
  it("interpole les variables", () => {
    expect(interpolate({ a: "{{evenement.message_id}}" }, { "evenement.message_id": "X" })).toEqual({ a: "X" });
  });
});

describe("assertions", () => {
  it("count", async () => {
    const a: Assertion = { ...base, type: "count", cible: "ressource:x", where: { statut: { in: ["gagnee"] } }, op: "eq", valeur: 1 };
    expect((await evaluateAssertion(a, ctx())).ok).toBe(true);
  });
  it("champ", async () => {
    const a: Assertion = { ...base, type: "champ", cible: "ressource:x", where: { id: "2" }, champ: "n", attendu: { gte: 5 } };
    expect((await evaluateAssertion(a, ctx())).ok).toBe(true);
  });
  it("unique détecte les doublons normalisés", async () => {
    const a: Assertion = { ...base, type: "unique", cible: "ressource:x", champ: "email" };
    const dup = ctx({ collection: async () => [...rows, { id: "3", email: " anne.lefloch@orange.fr" }] });
    expect((await evaluateAssertion(a, ctx())).ok).toBe(true);
    expect((await evaluateAssertion(a, dup)).ok).toBe(false);
  });
  it("acquitte", async () => {
    const a: Assertion = { ...base, type: "acquitte" };
    expect((await evaluateAssertion(a, ctx({ scenarioInbox: [{ statut: "traite" }, { statut: "nouveau" }] }))).ok).toBe(false);
    expect((await evaluateAssertion(a, ctx({ scenarioInbox: [{ statut: "traite" }] }))).ok).toBe(true);
  });
  it("rag_contenu, rag_citation, rag_refus", async () => {
    const answer = { reponse: "Couper le disjoncteur 10 secondes puis appuyer sur PROG.", sources: ["notice-volet-solia-rs"] };
    const c: Assertion = { ...base, type: "rag_contenu", groupes: [["disjonct"], ["10 s"], ["prog"]] };
    const s: Assertion = { ...base, type: "rag_citation", sources: ["notice-volet-solia-rs"] };
    const r: Assertion = { ...base, type: "rag_refus" };
    expect((await evaluateAssertion(c, ctx({ ragAnswer: answer }))).ok).toBe(true);
    expect((await evaluateAssertion(s, ctx({ ragAnswer: answer }))).ok).toBe(true);
    expect((await evaluateAssertion(r, ctx({ ragAnswer: answer }))).ok).toBe(false);
    expect((await evaluateAssertion(r, ctx({ ragAnswer: { reponse: "Je ne sais pas : l'information ne figure pas dans la documentation.", sources: [] } }))).ok).toBe(true);
    expect((await evaluateAssertion(r, ctx({ ragAnswer: null }))).ok).toBe(false);
  });
});

describe("synthèse", () => {
  it("calcule score, ventilation par compétence et bloquants", () => {
    const res = summarize([
      {
        id: "s1",
        titre: "",
        description: "",
        assertions: [
          { id: "a", description: "x", competence_id: "C2.3", poids: 3, bloquant: false, ok: true, detail: "" },
          { id: "b", description: "y", competence_id: "C5.3", poids: 1, bloquant: true, ok: false, detail: "" },
        ],
      },
    ]);
    expect(res.score).toBe(75);
    expect(res.par_competence.find((c) => c.id === "C5.3")?.pct).toBe(0);
    expect(res.bloquants_echoues).toHaveLength(1);
  });
});
