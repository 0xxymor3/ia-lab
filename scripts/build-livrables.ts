// Génère les livrables dérivés dans ../livrables (dossier privé, hors dépôt) :
//   SYLLABUS_complet.md   ← concaténation de content/syllabus/*.md
//   CASE_PACK_SCHEMA.md   ← JSON Schema du pack (Zod) + guide + pack UC00 en exemple (sans l'évaluation)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { CasePackSchema } from "../lib/schema/case-pack";
import { loadCase } from "../lib/case-loader";
import { COMPETENCES, BLOCS, POSTES } from "../lib/referentiel";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(ROOT, "..", "livrables");
fs.mkdirSync(OUT, { recursive: true });

// ─── Syllabus complet ────────────────────────────────────────────────────────
const dir = path.join(ROOT, "content", "syllabus");
const chapitres = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")))
  .sort((a, b) => a.data.ordre - b.data.ordre);
const syllabus = [
  "# SYLLABUS COMPLET — Consultant·e formateur·rice IA",
  "",
  `> Document généré le ${new Date().toISOString().slice(0, 10)} à partir des chapitres publiés sur le laboratoire. Base de connaissance du projet Claude.`,
  "",
  "## Sommaire",
  "",
  ...chapitres.map((c) => `- ${c.data.titre}`),
  "",
  ...chapitres.flatMap((c) => ["", "---", "", c.content.trim().replace(/^# /m, "# ")]),
  "",
].join("\n");
fs.writeFileSync(path.join(OUT, "SYLLABUS_complet.md"), syllabus);

// ─── Schéma des packs ────────────────────────────────────────────────────────
const jsonSchema = z.toJSONSchema(CasePackSchema, { unrepresentable: "any", io: "input" });
const uc00 = loadCase(path.join(ROOT, "content", "cases", "uc00-diagnostic"));
const exemple = {
  ...uc00,
  organigramme: { personnes: uc00.organigramme.personnes.slice(0, 2) },
  stack: { logiciels: uc00.stack.logiciels.slice(2, 4) },
  donnees: { ...uc00.donnees, tables: uc00.donnees.tables.slice(0, 1) },
  documents: uc00.documents.slice(0, 1).map((d) => ({ ...d, contenu_md: d.contenu_md.slice(0, 400) + "…" })),
  paliers: uc00.paliers.slice(1, 2),
  // Évaluation d'illustration (inventée) : ne jamais exposer celle d'UC00 dans la base de connaissance.
  evaluation: {
    campagnes: [
      {
        id: "p2-exemple",
        palier: "P2",
        titre: "Exemple de campagne inbox",
        description: "Visible par le candidat avant le lancement.",
        mode: "inbox",
        scenarios: [
          {
            id: "s01-exemple",
            titre: "Demande nominale",
            description: "Prospect inconnu, demande complète.",
            evenement: { canal: "email", de: "jeanne.exemple@gmail.com", nom: "Jeanne Exemple", objet: "Demande de devis", corps: "Bonjour, …" },
            assertions: [
              { id: "a1", type: "count", cible: "ressource:demandes", where: { source_message_id: "{{evenement.message_id}}" }, op: "eq", valeur: 1, competence_id: "C2.2", poids: 3, description: "Une demande créée" },
              { id: "a2", type: "count", cible: "outbox", where: { source_message_id: "{{evenement.message_id}}", statut: "envoye" }, op: "eq", valeur: 0, competence_id: "C2.1", poids: 3, bloquant: true, description: "Aucun envoi sans validation humaine" },
              { id: "a3", type: "acquitte", competence_id: "C2.3", poids: 1, description: "Message acquitté" },
            ],
          },
        ],
      },
    ],
    jury: [
      { id: "j01", competence_id: "C2.3", niveau: "N3", question: "Qu'est-ce que l'idempotence ?", elements_attendus: ["Même effet si rejoué", "Clé de déduplication"] },
    ],
  },
};

const doc = `# CASE_PACK_SCHEMA — format des packs de cas

> Référence technique pour le projet Claude. Un pack est un **unique objet JSON** qui décrit une entreprise fictive,
> ses données, son API simulée, les paliers de la mission et l'évaluation. Il est validé par le laboratoire
> (page \`/admin/valider\`) puis importé avec \`pnpm case:import pack.json\`.

## 1. Identifiants autorisés

**Compétences** (\`competence_id\`) :
${BLOCS.map((b) => `- ${b.id} ${b.titre} : ${COMPETENCES.filter((c) => c.bloc === b.id).map((c) => `\`${c.id}\` ${c.titre}`).join(" · ")}`).join("\n")}

**Niveaux** : \`N1\` Notions · \`N2\` Application guidée · \`N3\` Autonomie · \`N4\` Expertise

**Postes** (\`postes_vises\`) : ${POSTES.map((p) => `\`${p.id}\``).join(", ")}

## 2. Structure (vue d'ensemble)

| Clé | Rôle | Visible par le candidat |
|---|---|---|
| \`schema_version\` | Toujours \`"1.0"\` | — |
| \`meta\` | Identifiant (slug), titre, type, secteur, niveau visé, postes, **compétences ciblées avec justification** | Oui |
| \`entreprise\` | Fiche entreprise (Markdown dans les champs \`*_md\`) | Oui |
| \`organigramme.personnes[]\` | Personnes, hiérarchie (\`manager_id\`), **attitude face à l'IA**, enjeux, irritants, citation | Oui |
| \`stack.logiciels[]\` | Outils en place, coûts, irritants, **type d'accès** (\`api_sandbox\`, \`export_fichier\`, \`email\`, \`aucun\`) | Oui |
| \`brief\` | Email du client + compte rendu ambigu + contraintes | Oui |
| \`documents[]\` | Documents internes en Markdown (base du RAG) | Oui |
| \`donnees\` | **Spécification** de génération (seed, tables, champs, anomalies, fixtures) — pas les lignes elles-mêmes | Oui (données générées) |
| \`api\` | Ressources REST simulées (table source, opérations, champs requis, énumérations), inbox, outbox, documents | Oui |
| \`paliers[]\` | Consignes, livrables, critères (par compétence, éventuellement bloquants) | Oui |
| \`evaluation\` | Campagnes du testeur (scénarios + assertions) et questions de jury | **Non** (spoilers) |

## 3. Génération des données (\`donnees.tables[].champs[]\`)

| \`type\` | Options utiles | Exemple |
|---|---|---|
| \`id\` | \`prefixe\` | \`{ "nom": "id", "type": "id", "options": { "prefixe": "CLI-" } }\` → CLI-0001 |
| \`string\` / \`text\` | \`generateur\` (chemin Faker fr : \`person.lastName\`, \`location.city\`, \`company.name\`…), \`modeles\` (\`"SCI {person.lastName}"\`, \`{champ}\` = autre champ de la ligne), \`valeurs\`+\`poids\` | |
| \`int\` / \`float\` | \`min\`, \`max\`, \`decimales\` | |
| \`bool\` | \`proba\` | |
| \`enum\` | \`valeurs\` (obligatoire), \`poids\` | |
| \`date\` / \`datetime\` | \`depuis\`, \`jusqua\` ; ou \`base\` (autre champ date) + \`decalage_jours: [min, max]\` (vide si la base est vide, plafonné par \`jusqua\`) | |
| \`email\` | \`depuis_champs: ["prenom", "nom"]\`, \`domaines\` | |
| \`phone\` | — (mobile français) | |
| \`ref\` | \`ref_table\` (table déclarée **avant**) | |
| (tous) | \`correspondances: { depuis, table }\` (ex. commune → code postal), \`copie: { ref_champ, champ }\` (copier un champ de la ligne référencée), \`format: upper|lower|title\`, \`nullable\` (0-1), \`masque: true\` (champ technique retiré) | |

**Anomalies** (\`anomalies[]\`, \`taux\` ≤ 0,5) : \`doublon_exact\`, \`doublon_approx\`, \`telephone_format\`, \`email_invalide\`, \`casse\`, \`espaces\`, \`valeur_manquante\`, \`date_format\`.
**Fixtures** : lignes écrites à la main, ajoutées telles quelles (à utiliser pour les enregistrements cités dans les scénarios, avec des \`id\` stables comme \`CLI-9001\`).
Maximum 3 000 lignes par table.

## 4. Évaluation automatisée (\`evaluation.campagnes[]\`)

- \`mode: "inbox"\` : chaque scénario a un \`evenement\` (email ou formulaire) injecté dans l'inbox ; \`duplique: true\` le livre deux fois (test d'idempotence). Le candidat doit renseigner \`source_message_id\` = \`message_id\` du message dans tout ce qu'il crée.
- \`mode: "rag"\` : chaque scénario a une \`question\` ; le candidat répond via \`POST /rag/answers\`.
- \`mode: "etat"\` : contrôles globaux sur l'état final des ressources.

**Assertions** (\`type\`) :
- \`count\` : \`cible\` (\`ressource:<nom>\`, \`outbox\`, \`inbox\`, \`hooks:<nom>\`), \`where\` optionnel, \`op\` (\`eq|gte|lte|gt|lt\`), \`valeur\`.
- \`champ\` : au moins un enregistrement correspondant à \`where\` dont \`champ\` satisfait \`attendu\`.
- \`unique\` : aucune valeur en double (normalisée) pour \`champ\`.
- \`acquitte\` : tous les messages du scénario sont acquittés.
- \`rag_contenu\` (\`groupes\` : liste de groupes de termes, chaque groupe doit avoir au moins un terme présent), \`rag_citation\` (\`sources\` : identifiants de documents), \`rag_refus\`.

**Filtres** (\`where\`, \`attendu\`) : valeur simple (égalité insensible à la casse et aux accents), \`{ "eq" }\`, \`{ "ieq" }\`, \`{ "ne" }\`, \`{ "contains" }\`, \`{ "regex", "casse"? }\`, \`{ "in": [] }\`, \`{ "exists": bool }\`, \`{ "gte" }\`, \`{ "lte" }\`. Le chemin \`"*"\` teste tous les champs.
**Variables** : \`{{evenement.message_id}}\`, \`{{evenement.de}}\`, \`{{evenement.objet}}\`, \`{{run.id}}\`, \`{{scenario.id}}\`.
Chaque assertion porte \`competence_id\`, \`poids\` (1-5), \`bloquant\` optionnel et une \`description\` affichée après vérification.

## 5. Règles de conception à respecter

1. Tout est **fictif** : noms d'entreprise vérifiés comme inexistants autant que possible, domaines d'email génériques (gmail.com, orange.fr…) ou réservés (\`.example\`), jamais d'organisation réelle identifiable.
2. Chaque compétence de \`meta.competences_cibles\` est mobilisée par au moins un palier **et** évaluée (critère, assertion ou question de jury).
3. Les scénarios couvrent le nominal **et** les cas limites (doublon, langue étrangère, information manquante, hors périmètre, données sensibles, injection de prompt, pannes via le mode chaos).
4. Les documents internes contiennent toutes les informations nécessaires aux questions RAG répondables, et **aucune** pour les questions pièges.
5. Le pack doit être **auto-cohérent** : \`manager_id\`, \`ref_table\`, ressources et documents cités existent (le validateur le vérifie).

## 6. JSON Schema (généré depuis le schéma Zod du laboratoire)

\`\`\`json
${JSON.stringify(jsonSchema)}
\`\`\`

## 7. Exemple abrégé (UC00 — extraits)

\`\`\`json
${JSON.stringify(exemple, null, 2)}
\`\`\`
`;
fs.writeFileSync(path.join(OUT, "CASE_PACK_SCHEMA.md"), doc);
console.log(`Livrables générés dans ${OUT} : SYLLABUS_complet.md, CASE_PACK_SCHEMA.md`);
