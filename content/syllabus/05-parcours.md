---
titre: "5 — Parcours de progression"
ordre: 5
resume: "Modules, ordre conseillé, durées indicatives, ressources gratuites, cas pratiques associés et jalons de certification externes."
---

# 5 — Parcours de progression

## 5.1 Logique du parcours

1. **Diagnostiquer** (UC00) : mesurer le niveau réel, bloc par bloc, sans se fier au CV.
2. **Combler les prérequis techniques d'abord** (API, code, données) : ce sont eux qui bloquent tout le reste et que le marché exige même pour les postes « no-code » (chapitre 1).
3. **Monter en valeur** (LLM en production, RAG, agents, sécurité, architecture), puis **consolider les atouts** (cadrage, pitch, conduite du changement, formation).
4. **Chaque module se termine par un cas pratique** généré par le projet Claude (`/nouveau-cas`) ciblant ses compétences ; un niveau n'est **validé** qu'après un second cas dans un contexte différent.

Rythme de référence : ~2 jours par semaine → 14 à 18 semaines pour l'ensemble. Les durées sont indicatives et à ajuster selon le diagnostic.

## 5.2 Modules

| Module | Compétences | Durée | Contenu | Ressources (gratuites sauf mention) | Preuve de sortie |
|---|---|---|---|---|---|
| **M0 — Diagnostic de positionnement** | Toutes | 5-6 j | Cas UC00 en 4 paliers + soutenance | Laboratoire (hub + testeur), projet Claude | Rapport de compétences initial |
| **M1 — Fondations web & API** | C2.2 (N2), C4.1 (N1-N2), C4.4 (N2) | 3 j | HTTP, REST, JSON, codes d'erreur, authentification, webhooks ; Git et GitHub | MDN « Aperçu du protocole HTTP » ; GitHub Skills ; documentation de l'API du laboratoire | Collection de requêtes (Bruno/Postman) + dépôt Git |
| **M2 — Programmer pour automatiser** | C4.1 (N2→N3) | 8-10 j | JavaScript pour les nœuds Code (tableaux, objets, map/filter, dates, regex) ; Python (requests, fichiers, pandas) ; lire et corriger du code généré | freeCodeCamp (JavaScript) ; *Automate the Boring Stuff with Python* (automatetheboringstuff.com) ; Exercism | 5 scripts / nœuds Code testés |
| **M3 — n8n avancé & fiabilisation** | C2.1-C2.4 (N3) | 5 j | Blueprint, sous-workflows, Error Workflow, retry, idempotence, files, auto-hébergement Docker, sauvegardes, runbook | n8n Academy (cours niveaux 1 et 2, badges) ; docs n8n (*error handling*, *self-hosting*) | Cas pratique B2 + badges n8n |
| **M4 — LLM en production** | C3.1 (N3) | 4 j | Prompts système robustes, few-shot, sorties structurées validées, incertitude, versioning des prompts | Tutoriel interactif de prompt engineering d'Anthropic (GitHub `anthropics/prompt-eng-interactive-tutorial`) ; documentation Anthropic / OpenAI / Mistral sur les sorties structurées | Prompt d'extraction + jeu de tests |
| **M5 — Données : SQL & qualité** | C4.2 (N3) | 5 j | SQL, modélisation, profilage, normalisation, dédoublonnage par règles, migration Excel → base | SQLBolt ; documentation PostgreSQL ; pandas | Rapport qualité + base nettoyée |
| **M6 — RAG & évaluation** | C3.2, C3.4 (N3) | 6 j | Ingestion, découpage, embeddings, pgvector/Qdrant, citations, refus hors corpus ; jeux d'évaluation, métriques, comparaison de modèles, coûts | DeepLearning.AI (short courses RAG et évaluation) ; Hugging Face LLM Course ; docs pgvector, Langfuse, promptfoo | Campagne RAG ≥ 80 % + tableau d'évaluation |
| **M7 — Agents, MCP & sécurité** | C3.3, C5.3 (N3) | 6 j | Tool use, MCP, patrons d'agents, HITL, limites ; OWASP Top 10 LLM, injection indirecte, masquage des données, moindre privilège | Article « Building effective agents » (Anthropic) ; modelcontextprotocol.io ; OWASP GenAI Security Project (genai.owasp.org) | Agent sécurisé passant les scénarios d'attaque du testeur |
| **M8 — Architecture & exploitation** | C5.1, C5.2, C5.4 (N3) | 5 j | Architecture cible, ADR, build vs buy, choix de modèles et d'hébergement (UE, local), observabilité, coûts, SLA | c4model.com ; documentation des fournisseurs (régions UE, conditions de données) ; Ollama | Dossier d'architecture + comparatif |
| **M9 — Conformité & gouvernance** | C6.1-C6.3 (N3) | 4 j | RGPD appliqué aux flux IA, registre, AIPD ; AI Act post-Omnibus ; charte d'usage, shadow AI | Fiches pratiques IA de la CNIL ; MOOC « L'atelier RGPD » (CNIL) ; texte consolidé de l'AI Act (EUR-Lex) | Note de conformité + charte |
| **M10 — Prototyper & déployer** | C4.3, C4.4 (N3), C7.1 | 5 j | Prototype utilisable (Next.js / Streamlit / outils de génération), déploiement, README, tests de base | nextjs.org/learn ; documentation Vercel, Supabase | Prototype en ligne |
| **M11 — Valeur, pitch & adoption** | B1, C7.2-C7.4 (N3→N4) | 4 j | Business case, note de cadrage, pitch orienté décision, plan d'accompagnement, module de formation (littératie IA) | Référentiel DigComp 3.0 ; grilles du chapitre 3 | Pitch + plan d'accompagnement + module de formation |

## 5.3 Ordre conseillé selon le diagnostic

| Résultat du diagnostic UC00 | Ordre conseillé |
|---|---|
| B4 < N2 (code et données non démontrés) | M1 → M2 → M5 → M3 → M4 → M6 → M7 → M8 → M9 → M10 → M11 |
| B4 ≥ N2 mais B2 < N3 (automatisations fragiles) | M3 → M4 → M2 (renforcement) → M6 → M7 → M5 → M8 → M9 → M10 → M11 |
| B2 et B3 ≥ N3, B5 < N3 | M7 → M8 → M6 (approfondissement) → M9 → M10 → M11 |
| Tous blocs techniques ≥ N3 | Cas intégrés multi-blocs + certifications externes |

## 5.4 Jalons de certification externes (optionnels, recommandés)

| Après | Certification | Pourquoi |
|---|---|---|
| M3 | Badges n8n Academy | Preuve rapide et gratuite sur l'outil le plus demandé. |
| M7 | Anthropic — Claude Certified Developer ou Architect, Foundations | Examen surveillé sans IA : crédibilise agents, MCP, prompt engineering. |
| M8 | Microsoft AI-103 ou AWS Certified AI Practitioner | Si la cible inclut des ESN et grands comptes (cloud exigé). |
| M9 | IAPP AIGP (payante) | Différenciateur fort sur la gouvernance et l'AI Act. |
| Fin de parcours | Titre RNCP de niveau 6 par VAE (ex. développeur IA, product builder) | Si une reconnaissance diplômante est nécessaire pour les postes qui exigent un Bac+3/+5. |

## 5.5 Cycle de progression continue

```
Rapport de compétences ──► /nouveau-cas (cibler les écarts) ──► Immersion + réalisation
        ▲                                                            │
        │                                                            ▼
   /bilan (mise à jour) ◄── /jury (oral) ◄── /evaluer (livrables + testeur)
```

Chaque itération met à jour le rapport de compétences (statuts *en cours* / *validé*), qui sert de base au cas suivant.
