import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCase } from "@/lib/case-loader";
import { createMemoryStore } from "@/lib/store";
import { Sandbox } from "@/lib/sandbox/state";
import { startRun, verifyRun } from "@/lib/runner/campaigns";

const pack = loadCase(path.resolve(__dirname, "..", "content", "cases", "uc00-diagnostic"));
const campagne = pack.evaluation.campagnes.find((c) => c.id === "p2-flux-entrants")!;

describe("sandbox + testeur", () => {
  it("initialise les ressources depuis les données générées", async () => {
    const sb = new Sandbox(pack, createMemoryStore());
    const contacts = await sb.records("contacts");
    expect(contacts.length).toBeGreaterThan(460);
    expect(contacts[0].created_at).toBeTruthy();
  });

  it("valide les champs requis et les énumérations", () => {
    const sb = new Sandbox(pack, createMemoryStore());
    const r = sb.ressource("demandes")!;
    expect(sb.validate(r, { contact_id: "CLI-1" }, false).length).toBeGreaterThan(0);
    expect(sb.validate(r, { type_demande: "inconnu" }, true)).toHaveLength(1);
  });

  it("injecte la campagne (doublon compris) et un workflow inactif obtient un score bas", async () => {
    const sb = new Sandbox(pack, createMemoryStore());
    const run = await startRun(sb, campagne);
    const inbox = await sb.inbox();
    expect(inbox).toHaveLength(campagne.scenarios.length + 1); // s04 livré deux fois
    const res = await verifyRun(sb, run);
    expect(res.score).toBeLessThan(50);
  });

  it("un workflow naïf (crée tout, envoie tout) échoue sur les critères bloquants", async () => {
    const sb = new Sandbox(pack, createMemoryStore());
    const run = await startRun(sb, campagne);
    for (const m of await sb.inbox()) {
      const c = await sb.create("contacts", { nom: m.nom ?? m.de, email: m.de });
      await sb.create("demandes", {
        contact_id: c.conflit ? "" : c.rec.id,
        type_demande: "autre",
        canal: "email",
        resume: m.corps,
        source_message_id: m.message_id,
        statut: "gagnee",
      });
      await sb.createOutbox({ to: m.de, subject: "Re", body: "ok", statut: "envoye", source_message_id: m.message_id });
      await sb.ackInbox(m.id);
    }
    const res = await verifyRun(sb, run);
    expect(res.bloquants_echoues.length).toBeGreaterThan(5);
    expect(res.par_competence.find((c) => c.id === "C2.3")!.pct).toBeLessThan(100);
  });
});
