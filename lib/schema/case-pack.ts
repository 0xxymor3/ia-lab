import { z } from "zod";
import { COMPETENCE_IDS, NIVEAUX, POSTES } from "@/lib/referentiel";

// Schéma d'un « pack de cas » : tout ce dont le laboratoire a besoin pour simuler
// l'entreprise, générer ses données, exposer ses API et évaluer le candidat.
// Le projet Claude génère des packs conformes à ce schéma (voir CASE_PACK_SCHEMA.md).

const Slug = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]{1,48}$/, "slug en minuscules, chiffres et tirets");
const Ident = z
  .string()
  .regex(/^[a-z0-9][a-z0-9_-]{0,48}$/, "identifiant en minuscules, chiffres, _ et -");
const Md = z.string().describe("Texte Markdown");

export const CompetenceIdSchema = z.enum(COMPETENCE_IDS);
export const NiveauSchema = z.enum(NIVEAUX);
export const PosteSchema = z.enum(POSTES.map((p) => p.id) as [string, ...string[]]);

// ─── Méta ────────────────────────────────────────────────────────────────────
export const MetaSchema = z.object({
  id: Slug.describe("Identifiant du cas, ex. uc01-cabinet-comptable"),
  titre: z.string(),
  sous_titre: z.string().optional(),
  type: z.enum(["diagnostic", "entrainement", "certification"]),
  secteur: z.string(),
  localisation: z.string(),
  duree_estimee_jours: z.number().positive(),
  niveau_vise: NiveauSchema,
  postes_vises: z.array(PosteSchema).min(1),
  competences_cibles: z
    .array(
      z.object({
        id: CompetenceIdSchema,
        niveau: NiveauSchema,
        justification: z.string().describe("Pourquoi ce cas oblige à mobiliser cette compétence"),
      }),
    )
    .min(1),
  resume: z.string(),
  date_creation: z.string(),
  version: z.string().default("1.0"),
});

// ─── Entreprise ──────────────────────────────────────────────────────────────
export const EntrepriseSchema = z.object({
  nom: z.string(),
  forme_juridique: z.string(),
  effectif: z.number().int().positive(),
  chiffre_affaires: z.string(),
  creation: z.number().int(),
  adresse: z.string(),
  activite_md: Md,
  histoire_md: Md,
  chiffres_cles: z.array(z.object({ label: z.string(), valeur: z.string() })),
  clients_md: Md,
  culture_md: Md.optional(),
  enjeux: z.array(z.string()).min(1),
});

export const ATTITUDES = ["sponsor", "enthousiaste", "neutre", "sceptique", "reticent", "bloquant"] as const;

export const PersonneSchema = z.object({
  id: Ident,
  nom: z.string(),
  poste: z.string(),
  service: z.string(),
  manager_id: Ident.nullable(),
  anciennete: z.string().optional(),
  profil_md: Md,
  attitude_ia: z.enum(ATTITUDES),
  enjeux: z.array(z.string()),
  irritants: z.array(z.string()),
  email: z.string().optional(),
  citation: z.string().optional().describe("Phrase caractéristique entendue en entretien"),
});

export const LogicielSchema = z.object({
  id: Ident,
  nom: z.string(),
  categorie: z.string(),
  usage_md: Md,
  utilisateurs: z.array(z.string()),
  cout_annuel: z.string().optional(),
  donnees: z.array(z.string()),
  irritants: z.array(z.string()),
  acces: z.object({
    type: z.enum(["api_sandbox", "export_fichier", "email", "aucun"]),
    ressources: z.array(z.string()).optional().describe("Ressources de l'API sandbox ou tables exportées"),
    note: z.string().optional(),
  }),
});

export const BriefSchema = z.object({
  email: z.object({
    de: z.string(),
    a: z.string(),
    date: z.string(),
    objet: z.string(),
    corps_md: Md,
  }),
  compte_rendu_md: Md.describe("Compte rendu du premier rendez-vous, volontairement incomplet ou ambigu"),
  contraintes: z.object({
    budget: z.string().optional(),
    delai: z.string().optional(),
    techniques: z.array(z.string()),
    reglementaires: z.array(z.string()),
  }),
});

export const DocumentSchema = z.object({
  id: Ident,
  titre: z.string(),
  type: z.enum(["procedure", "notice", "politique", "compte_rendu", "fiche_produit", "email", "contrat", "autre"]),
  auteur: z.string().optional(),
  date: z.string().optional(),
  contenu_md: Md,
});

// ─── Données simulées ────────────────────────────────────────────────────────
export const ChampSchema = z.object({
  nom: z.string().regex(/^[a-z][a-z0-9_]*$/),
  type: z.enum(["id", "string", "text", "int", "float", "bool", "date", "datetime", "email", "phone", "enum", "ref"]),
  generateur: z
    .string()
    .optional()
    .describe("Chemin Faker (locale fr), ex. person.lastName, location.city, company.name"),
  options: z
    .object({
      prefixe: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      decimales: z.number().int().optional(),
      valeurs: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
      poids: z.array(z.number()).optional(),
      ref_table: z.string().optional(),
      depuis: z.string().optional().describe("Date ISO de début"),
      jusqua: z.string().optional().describe("Date ISO de fin"),
      base: z.string().optional().describe("Champ date de référence pour un décalage"),
      decalage_jours: z.tuple([z.number(), z.number()]).optional(),
      modeles: z.array(z.string()).optional().describe("Modèles de texte avec {champ} interpolés"),
      depuis_champs: z.array(z.string()).optional().describe("Pour email : champs prénom/nom sources"),
      domaines: z.array(z.string()).optional(),
      proba: z.number().min(0).max(1).optional(),
      correspondances: z
        .object({ depuis: z.string(), table: z.record(z.string(), z.union([z.string(), z.number()])) })
        .optional()
        .describe("Valeur déduite d'un autre champ de la ligne via une table de correspondance"),
      copie: z
        .object({ ref_champ: z.string(), champ: z.string() })
        .optional()
        .describe("Copie un champ de la ligne référencée par ref_champ (champ de type ref)"),
      format: z.enum(["upper", "lower", "title"]).optional(),
    })
    .optional(),
  nullable: z.number().min(0).max(1).optional().describe("Probabilité que la valeur soit vide"),
  masque: z.boolean().optional().describe("Champ technique retiré des données finales (ex. ref utilisée pour une copie)"),
});

export const ANOMALIES = [
  "doublon_exact",
  "doublon_approx",
  "telephone_format",
  "email_invalide",
  "casse",
  "espaces",
  "valeur_manquante",
  "date_format",
] as const;

export const TableSchema = z.object({
  nom: Ident,
  description: z.string(),
  source: z.string().describe("Logiciel ou fichier d'origine, ex. « Export ERP Batipro »"),
  lignes: z.number().int().min(0).max(3000),
  champs: z.array(ChampSchema).min(1),
  anomalies: z
    .array(
      z.object({
        type: z.enum(ANOMALIES),
        taux: z.number().min(0).max(0.5),
        champs: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  fixtures: z.array(z.record(z.string(), z.unknown())).optional().describe("Lignes écrites à la main, ajoutées telles quelles"),
});

export const DonneesSchema = z.object({
  seed: z.number().int(),
  tables: z.array(TableSchema),
});

// ─── API sandbox ─────────────────────────────────────────────────────────────
export const RessourceSchema = z.object({
  nom: Ident.describe("Segment d'URL : /api/sandbox/{cas}/{nom}"),
  table: z.string().nullable().describe("Table de données qui initialise la ressource (null = vide)"),
  description: z.string(),
  operations: z.array(z.enum(["list", "get", "create", "update", "delete"])).min(1),
  champs_requis: z.array(z.string()).optional(),
  enums: z.record(z.string(), z.array(z.string())).optional(),
});

export const ApiSchema = z.object({
  ressources: z.array(RessourceSchema),
  inbox: z.object({ active: z.boolean(), description: z.string() }),
  outbox: z.object({ active: z.boolean(), description: z.string() }),
  documents_exposes: z.boolean(),
});

// ─── Paliers ─────────────────────────────────────────────────────────────────
export const PalierSchema = z.object({
  id: z.string().regex(/^P\d$/),
  titre: z.string(),
  objectif: z.string(),
  duree_estimee_h: z.number().positive(),
  competences: z.array(CompetenceIdSchema).min(1),
  consignes_md: Md,
  livrables: z.array(z.object({ id: Ident, nom: z.string(), format: z.string(), description: z.string() })),
  criteres: z.array(
    z.object({
      id: z.string(),
      competence_id: CompetenceIdSchema,
      indicateur: z.string(),
      bloquant: z.boolean().optional(),
    }),
  ),
});

// ─── Évaluation (spoilers : jamais affichée avant vérification) ─────────────
const Primitive = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const FiltreSchema = z.union([
  Primitive,
  z.object({ eq: Primitive }),
  z.object({ ieq: z.string() }),
  z.object({ ne: Primitive }),
  z.object({ contains: z.string() }),
  z.object({ regex: z.string(), casse: z.boolean().optional().describe("true = sensible à la casse") }),
  z.object({ in: z.array(Primitive) }),
  z.object({ exists: z.boolean() }),
  z.object({ gte: z.union([z.number(), z.string()]) }),
  z.object({ lte: z.union([z.number(), z.string()]) }),
]);
export type Filtre = z.infer<typeof FiltreSchema>;

const Cible = z
  .string()
  .regex(/^(ressource:[a-z0-9_-]+|outbox|inbox|hooks:[a-z0-9_-]+)$/)
  .describe("ressource:<nom> | outbox | inbox | hooks:<nom>");

const AssertionBase = {
  id: z.string(),
  competence_id: CompetenceIdSchema,
  poids: z.number().int().min(1).max(5),
  bloquant: z.boolean().optional(),
  description: z.string().describe("Ce qui est vérifié, affiché après vérification"),
};

export const AssertionSchema = z.discriminatedUnion("type", [
  z.object({
    ...AssertionBase,
    type: z.literal("count"),
    cible: Cible,
    where: z.record(z.string(), FiltreSchema).optional(),
    op: z.enum(["eq", "gte", "lte", "gt", "lt"]),
    valeur: z.number().int(),
  }),
  z.object({
    ...AssertionBase,
    type: z.literal("champ"),
    cible: Cible,
    where: z.record(z.string(), FiltreSchema),
    champ: z.string(),
    attendu: FiltreSchema,
  }),
  z.object({
    ...AssertionBase,
    type: z.literal("unique"),
    cible: Cible,
    champ: z.string(),
    where: z.record(z.string(), FiltreSchema).optional(),
  }),
  z.object({ ...AssertionBase, type: z.literal("acquitte") }),
  z.object({ ...AssertionBase, type: z.literal("rag_contenu"), groupes: z.array(z.array(z.string()).min(1)).min(1) }),
  z.object({ ...AssertionBase, type: z.literal("rag_citation"), sources: z.array(z.string()).min(1) }),
  z.object({ ...AssertionBase, type: z.literal("rag_refus") }),
]);
export type Assertion = z.infer<typeof AssertionSchema>;

export const EvenementSchema = z.object({
  canal: z.enum(["email", "formulaire"]),
  de: z.string(),
  nom: z.string().optional(),
  objet: z.string(),
  corps: z.string(),
  pieces_jointes: z.array(z.string()).optional(),
  duplique: z.boolean().optional().describe("Livré deux fois (même message_id) pour tester l'idempotence"),
});

export const ScenarioSchema = z.object({
  id: Ident,
  titre: z.string(),
  description: z.string(),
  evenement: EvenementSchema.optional(),
  question: z.string().optional(),
  assertions: z.array(AssertionSchema).min(1),
});

export const CampagneSchema = z.object({
  id: Ident,
  palier: z.string(),
  titre: z.string(),
  description: z.string().describe("Visible par le candidat avant le lancement"),
  mode: z.enum(["inbox", "rag", "etat"]),
  scenarios: z.array(ScenarioSchema).min(1),
});

export const QuestionJurySchema = z.object({
  id: z.string(),
  competence_id: CompetenceIdSchema,
  niveau: NiveauSchema,
  question: z.string(),
  elements_attendus: z.array(z.string()).min(1),
  relances: z.array(z.string()).optional(),
});

export const EvaluationSchema = z.object({
  campagnes: z.array(CampagneSchema),
  jury: z.array(QuestionJurySchema),
});

// ─── Pack complet ────────────────────────────────────────────────────────────
export const CasePackSchema = z
  .object({
    schema_version: z.literal("1.0"),
    meta: MetaSchema,
    entreprise: EntrepriseSchema,
    organigramme: z.object({ personnes: z.array(PersonneSchema).min(1) }),
    stack: z.object({ logiciels: z.array(LogicielSchema).min(1) }),
    brief: BriefSchema,
    documents: z.array(DocumentSchema),
    donnees: DonneesSchema,
    api: ApiSchema,
    paliers: z.array(PalierSchema).min(1),
    evaluation: EvaluationSchema,
  })
  .superRefine((pack, ctx) => {
    const tables = new Set(pack.donnees.tables.map((t) => t.nom));
    const personnes = new Set(pack.organigramme.personnes.map((p) => p.id));
    const docs = new Set(pack.documents.map((d) => d.id));
    const ressources = new Set(pack.api.ressources.map((r) => r.nom));
    const paliers = new Set(pack.paliers.map((p) => p.id));

    for (const p of pack.organigramme.personnes) {
      if (p.manager_id && !personnes.has(p.manager_id))
        ctx.addIssue({ code: "custom", message: `manager_id inconnu : ${p.manager_id}`, path: ["organigramme", p.id] });
    }
    for (const t of pack.donnees.tables) {
      for (const c of t.champs) {
        if (c.type === "ref" && (!c.options?.ref_table || !tables.has(c.options.ref_table)))
          ctx.addIssue({ code: "custom", message: `ref_table invalide pour ${t.nom}.${c.nom}`, path: ["donnees", t.nom] });
        if (c.type === "enum" && !c.options?.valeurs?.length)
          ctx.addIssue({ code: "custom", message: `valeurs manquantes pour l'enum ${t.nom}.${c.nom}`, path: ["donnees", t.nom] });
      }
    }
    for (const r of pack.api.ressources) {
      if (r.table && !tables.has(r.table))
        ctx.addIssue({ code: "custom", message: `table inconnue pour la ressource ${r.nom} : ${r.table}`, path: ["api", r.nom] });
    }
    for (const c of pack.evaluation.campagnes) {
      if (!paliers.has(c.palier))
        ctx.addIssue({ code: "custom", message: `palier inconnu : ${c.palier}`, path: ["evaluation", c.id] });
      for (const s of c.scenarios) {
        if (c.mode === "inbox" && !s.evenement)
          ctx.addIssue({ code: "custom", message: `scénario ${s.id} sans evenement en mode inbox`, path: ["evaluation", c.id, s.id] });
        if (c.mode === "rag" && !s.question)
          ctx.addIssue({ code: "custom", message: `scénario ${s.id} sans question en mode rag`, path: ["evaluation", c.id, s.id] });
        for (const a of s.assertions) {
          if ((a.type === "count" || a.type === "champ" || a.type === "unique") && a.cible.startsWith("ressource:")) {
            const nom = a.cible.slice("ressource:".length);
            if (!ressources.has(nom))
              ctx.addIssue({ code: "custom", message: `ressource inconnue dans ${s.id}/${a.id} : ${nom}`, path: ["evaluation", c.id, s.id] });
          }
          if (a.type === "rag_citation")
            for (const src of a.sources)
              if (!docs.has(src))
                ctx.addIssue({ code: "custom", message: `document inconnu cité dans ${s.id}/${a.id} : ${src}`, path: ["evaluation", c.id, s.id] });
        }
      }
    }
  });

export type CasePack = z.infer<typeof CasePackSchema>;
export type Personne = z.infer<typeof PersonneSchema>;
export type Logiciel = z.infer<typeof LogicielSchema>;
export type TableSpec = z.infer<typeof TableSchema>;
export type ChampSpec = z.infer<typeof ChampSchema>;
export type Ressource = z.infer<typeof RessourceSchema>;
export type Campagne = z.infer<typeof CampagneSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Palier = z.infer<typeof PalierSchema>;
export type DocumentCas = z.infer<typeof DocumentSchema>;

export function formatZodIssues(error: z.ZodError): string[] {
  return error.issues.map((i) => `${i.path.join(" › ") || "(racine)"} : ${i.message}`);
}
