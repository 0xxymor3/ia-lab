import raw from "@/generated/content.json";
import type { CasePack } from "@/lib/schema/case-pack";
import type { CompetenceId, Niveau } from "@/lib/referentiel";

export type Chapitre = { slug: string; titre: string; ordre: number; resume: string; body: string };

export type PortfolioEntree = {
  id: string;
  titre: string;
  cas: string;
  statut: "a_venir" | "en_cours" | "termine";
  date?: string;
  resume?: string;
  competences?: { id: CompetenceId; niveau: Niveau; statut: "en_cours" | "valide" }[];
  livrables?: { titre: string; type: "pdf" | "md" | "n8n" | "lien" | "json"; url: string; description?: string }[];
  workflows?: { titre: string; url: string }[];
  body: string;
};

type Content = {
  generated_at: string;
  syllabus: Chapitre[];
  cases: CasePack[];
  portfolio: PortfolioEntree[];
};

const content = raw as unknown as Content;

export const syllabus = content.syllabus;
export const cases = content.cases;
export const portfolio = content.portfolio;
export const contentGeneratedAt = content.generated_at;

export function getCase(id: string): CasePack | undefined {
  return cases.find((c) => c.meta.id === id);
}

export function getChapitre(slug: string) {
  return syllabus.find((c) => c.slug === slug);
}

export function getPortfolio(id: string) {
  return portfolio.find((p) => p.id === id);
}
