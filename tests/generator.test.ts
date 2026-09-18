import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCase } from "@/lib/case-loader";
import { generateDataset } from "@/lib/data/generator";

const pack = loadCase(path.resolve(__dirname, "..", "content", "cases", "uc00-diagnostic"));

describe("générateur de données", () => {
  it("est déterministe (même seed → mêmes données)", () => {
    expect(generateDataset(pack)).toEqual(generateDataset(pack));
  });

  it("change avec la seed", () => {
    const other = generateDataset({ donnees: { ...pack.donnees, seed: pack.donnees.seed + 1 } });
    expect(other.clients[0]).not.toEqual(generateDataset(pack).clients[0]);
  });

  it("injecte les anomalies et ajoute les fixtures", () => {
    const { clients } = generateDataset(pack);
    expect(clients.length).toBeGreaterThan(460);
    expect(clients.find((c) => c.id === "CLI-9001")?.email).toBe("anne.lefloch@orange.fr");
    expect(clients.some((c) => typeof c.telephone === "string" && c.telephone.startsWith("+33"))).toBe(true);
  });

  it("respecte les correspondances, copies et champs masqués", () => {
    const ds = generateDataset(pack);
    const vannes = ds.clients.find((c) => c.commune === "Vannes");
    expect(vannes?.code_postal).toBe("56000");
    expect(ds.devis_erp[0]).not.toHaveProperty("client_ref");
    expect(String(ds.devis_erp[0].client_nom)).toBe(String(ds.devis_erp[0].client_nom).toUpperCase());
  });

  it("enchaîne les dates du pipeline (métré après premier contact, devis après métré)", () => {
    const { demandes } = generateDataset(pack);
    for (const d of demandes) {
      if (d.rdv_metre_le && d.premiere_reponse_le) expect(String(d.rdv_metre_le) >= String(d.premiere_reponse_le)).toBe(true);
      if (d.devis_envoye_le && d.rdv_metre_le) expect(String(d.devis_envoye_le) >= String(d.rdv_metre_le)).toBe(true);
      if (d.devis_envoye_le) expect(d.rdv_metre_le).toBeTruthy();
    }
  });
});
