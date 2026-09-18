// Source unique des identifiants du référentiel (chapitre 2 du syllabus).
// Toute modification ici doit être répercutée dans le syllabus, le rapport de compétences et le system prompt.

export const NIVEAUX = ["N1", "N2", "N3", "N4"] as const;
export type Niveau = (typeof NIVEAUX)[number];

export const NIVEAU_LABELS: Record<Niveau, string> = {
  N1: "Notions",
  N2: "Application guidée",
  N3: "Autonomie",
  N4: "Expertise",
};

export const BLOCS = [
  { id: "B1", titre: "Diagnostic, cadrage & valeur" },
  { id: "B2", titre: "Automatisation & orchestration" },
  { id: "B3", titre: "Intégration LLM, RAG & agents" },
  { id: "B4", titre: "Développement & données" },
  { id: "B5", titre: "Architecture, sécurité & exploitation" },
  { id: "B6", titre: "Conformité, éthique & gouvernance" },
  { id: "B7", titre: "Produit, adoption & transmission" },
] as const;

export const COMPETENCES = [
  { id: "C1.1", bloc: "B1", titre: "Diagnostiquer les processus métier" },
  { id: "C1.2", bloc: "B1", titre: "Identifier et qualifier des cas d'usage" },
  { id: "C1.3", bloc: "B1", titre: "Prioriser et chiffrer" },
  { id: "C1.4", bloc: "B1", titre: "Formaliser le cadrage" },
  { id: "C2.1", bloc: "B2", titre: "Concevoir un workflow" },
  { id: "C2.2", bloc: "B2", titre: "Intégrer des API et services" },
  { id: "C2.3", bloc: "B2", titre: "Fiabiliser les automatisations" },
  { id: "C2.4", bloc: "B2", titre: "Exploiter et maintenir" },
  { id: "C3.1", bloc: "B3", titre: "Prompts de production et sorties structurées" },
  { id: "C3.2", bloc: "B3", titre: "Mettre en œuvre un RAG" },
  { id: "C3.3", bloc: "B3", titre: "Agents et usage d'outils" },
  { id: "C3.4", bloc: "B3", titre: "Évaluer et optimiser" },
  { id: "C4.1", bloc: "B4", titre: "Programmer des scripts et composants" },
  { id: "C4.2", bloc: "B4", titre: "Manipuler et fiabiliser les données" },
  { id: "C4.3", bloc: "B4", titre: "Développer un service ou un prototype" },
  { id: "C4.4", bloc: "B4", titre: "Industrialiser" },
  { id: "C5.1", bloc: "B5", titre: "Concevoir une architecture cible" },
  { id: "C5.2", bloc: "B5", titre: "Choisir modèles et hébergement" },
  { id: "C5.3", bloc: "B5", titre: "Sécuriser les systèmes IA" },
  { id: "C5.4", bloc: "B5", titre: "Observer et piloter en production" },
  { id: "C6.1", bloc: "B6", titre: "Appliquer le RGPD aux projets IA" },
  { id: "C6.2", bloc: "B6", titre: "Qualifier et appliquer l'AI Act" },
  { id: "C6.3", bloc: "B6", titre: "Gouverner l'usage de l'IA" },
  { id: "C7.1", bloc: "B7", titre: "Concevoir un produit ou un MVP" },
  { id: "C7.2", bloc: "B7", titre: "Convaincre et restituer" },
  { id: "C7.3", bloc: "B7", titre: "Accompagner le changement" },
  { id: "C7.4", bloc: "B7", titre: "Former et documenter" },
] as const;

export const COMPETENCE_IDS = COMPETENCES.map((c) => c.id) as unknown as [
  (typeof COMPETENCES)[number]["id"],
  ...(typeof COMPETENCES)[number]["id"][],
];
export type CompetenceId = (typeof COMPETENCES)[number]["id"];

export const POSTES = [
  { id: "ai-automation-engineer", titre: "AI Automation Engineer" },
  { id: "ai-integrator", titre: "AI Integrator" },
  { id: "ai-product-builder", titre: "AI Product Builder" },
  { id: "ai-architect", titre: "AI Architect" },
  { id: "consultant-formateur-ia", titre: "Consultant formateur IA TPE/PME" },
] as const;
export type PosteId = (typeof POSTES)[number]["id"];

export function competence(id: string) {
  return COMPETENCES.find((c) => c.id === id);
}

export function bloc(id: string) {
  return BLOCS.find((b) => b.id === id);
}
