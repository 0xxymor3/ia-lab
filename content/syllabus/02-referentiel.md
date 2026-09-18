---
titre: "2 — Référentiel : blocs, compétences et niveaux"
ordre: 2
resume: "7 blocs, 27 compétences décrites en savoirs, savoir-faire et technologies ; échelle N1-N4 ; matrice poste × compétence."
---

# 2 — Référentiel de compétences

## 2.1 Échelle de niveaux

| Niveau | Nom | Définition opérationnelle | Repères |
|---|---|---|---|
| **N1** | Notions | Sait définir et reconnaître ; reproduit un exemple en suivant un tutoriel pas à pas. | e-CF ≈ e-1 |
| **N2** | Application guidée | Réalise une tâche standard dans un contexte simple, avec un modèle ou de l'aide ; le cas nominal fonctionne, les cas limites non. | e-CF ≈ e-2 ; CEC 5 |
| **N3** | Autonomie | Réalise seul dans un contexte réaliste, **gère les cas limites**, justifie ses choix, documente. C'est le niveau « employable » d'un profil confirmé. | e-CF ≈ e-3 ; CEC 6 |
| **N4** | Expertise | Conçoit pour des contextes complexes ou ambigus, arbitre entre options, anticipe les risques, optimise, fait monter les autres en compétence. | e-CF ≈ e-4 ; CEC 7 |

**Règle de validation (détaillée au chapitre 3) :** un niveau est *validé* lorsqu'il est démontré sur **au moins deux cas différents**, avec **preuve observable** et **justification orale**. Un niveau démontré une seule fois est *en cours*. Un niveau seulement déclaré est *auto-déclaré* et ne compte pas.

## 2.2 Vue d'ensemble

| Bloc | Compétences | Correspondances principales |
|---|---|---|
| **B1 Diagnostic, cadrage & valeur** | C1.1 Diagnostiquer les processus · C1.2 Identifier et qualifier les cas d'usage · C1.3 Prioriser et chiffrer · C1.4 Formaliser le cadrage | e-CF D.11, A.4, E.2 · RS7344 · RNCP40247 BC01 |
| **B2 Automatisation & orchestration** | C2.1 Concevoir un workflow · C2.2 Intégrer des API et services · C2.3 Fiabiliser · C2.4 Exploiter et maintenir | e-CF A.6, B.2, B.4, C.4 · RNCP40247 BC02 |
| **B3 Intégration LLM, RAG & agents** | C3.1 Prompts de production et sorties structurées · C3.2 RAG · C3.3 Agents et outils · C3.4 Évaluer et optimiser | e-CF B.2, B.3, A.7 · RNCP37827 BC02 |
| **B4 Développement & données** | C4.1 Programmer · C4.2 Manipuler et fiabiliser les données · C4.3 Développer un service / prototype · C4.4 Industrialiser | e-CF B.1, B.3, B.4 · RNCP37827 BC01, BC03 |
| **B5 Architecture, sécurité & exploitation** | C5.1 Architecture cible · C5.2 Choix de modèles et d'hébergement · C5.3 Sécuriser · C5.4 Observer et piloter | e-CF A.5, E.3, E.8 · RNCP37827 BC02 |
| **B6 Conformité, éthique & gouvernance** | C6.1 RGPD appliqué à l'IA · C6.2 AI Act · C6.3 Gouvernance de l'usage de l'IA | e-CF E.9, E.3 · RNCP36129 BC04 · IAPP AIGP |
| **B7 Produit, adoption & transmission** | C7.1 Concevoir un produit / MVP · C7.2 Convaincre et restituer · C7.3 Accompagner le changement · C7.4 Former et documenter | e-CF A.4, D.3, B.5 · RS7344 · DigComp 3.0 |

---

## B1 — Diagnostic, cadrage & valeur

### C1.1 Diagnostiquer les processus métier
- **Savoirs** : notions de processus, activité, tâche, irritant ; types de gaspillage (attente, ressaisie, recherche d'information, erreurs) ; différence entre symptôme et cause ; biais d'entretien.
- **Savoir-faire** : conduire des entretiens et une observation (*shadowing*) ; mesurer volumes, temps, délais, taux d'erreur ; cartographier l'existant (AS-IS) avec acteurs, outils, données et points de rupture ; distinguer ce qui relève de l'organisation, de l'outil ou de la donnée.
- **Technologies** : BPMN simplifié ou *swimlanes* (Miro, Excalidraw, Mermaid), tableur de mesure, grilles d'entretien.

### C1.2 Identifier et qualifier des cas d'usage IA / automatisation
- **Savoirs** : ce que l'IA générative sait / ne sait pas faire ; automatisation déterministe vs probabiliste ; prérequis données ; niveaux de risque (erreur visible client, données personnelles, décision sur des personnes).
- **Savoir-faire** : générer une liste de cas d'usage à partir du diagnostic ; qualifier chacun (faisabilité données, faisabilité technique, risque, dépendances) ; écarter explicitement les faux bons cas (ex. « un ChatGPT interne » sans besoin précis).
- **Technologies** : canevas de cas d'usage (*AI use case canvas*), matrice de qualification.

### C1.3 Prioriser et chiffrer
- **Savoirs** : ROI, TCO, coût d'opportunité ; coûts d'un système IA (licences, tokens, hébergement, maintenance, supervision humaine) ; gains mesurables vs gains déclaratifs.
- **Savoir-faire** : construire une matrice valeur/effort ; estimer un coût mensuel d'exploitation (volumétrie × tokens × prix + infra) ; calculer un temps de retour ; formuler des hypothèses explicites et les tester.
- **Technologies** : tableur (modèle de business case), calculateurs de tokens, grilles tarifaires des fournisseurs.

### C1.4 Formaliser le cadrage
- **Savoirs** : note de cadrage, périmètre (in/out), critères de succès, KPI, jalons ; *user stories* et critères d'acceptation ; gestion des parties prenantes.
- **Savoir-faire** : rédiger une note de cadrage validable par un dirigeant ; transformer un besoin flou en exigences testables ; lister risques et hypothèses ; proposer un plan en lots (MVP → extension).
- **Technologies** : Notion / Google Docs / Markdown, outils de gestion de projet (Trello, Linear, Notion).

---

## B2 — Automatisation & orchestration de workflows

### C2.1 Concevoir un workflow (blueprint)
- **Savoirs** : déclencheurs (webhook, planification, événement, *polling*) ; synchrone vs asynchrone ; états d'un traitement ; *human-in-the-loop* (HITL) ; découpage en sous-workflows.
- **Savoir-faire** : produire un blueprint lisible (déclencheur, étapes, données en entrée/sortie, branches, erreurs, points de validation humaine) avant de construire ; choisir l'outil adapté (n8n, Make, code) selon volumétrie, coût, hébergement et compétences du client.
- **Technologies** : n8n, Make, Zapier ; Mermaid / Excalidraw pour les blueprints.

### C2.2 Intégrer des API et services
- **Savoirs** : HTTP (méthodes, codes, en-têtes), REST, JSON, pagination, filtres ; authentification (clé d'API, Basic, OAuth 2.0, jetons) ; webhooks et signature HMAC ; formats CSV/XLSX ; limites de débit.
- **Savoir-faire** : lire une documentation d'API et l'appeler correctement ; mapper et transformer des données entre systèmes ; paginer ; gérer les formats de dates, nombres et encodages ; contourner un logiciel sans API (export, email, RPA en dernier recours).
- **Technologies** : nœuds HTTP Request de n8n / Make, Postman ou Bruno, cURL, JSONPath, IMAP/SMTP, Google Workspace / Microsoft 365.

### C2.3 Fiabiliser les automatisations
- **Savoirs** : types d'erreurs (transitoires, permanentes, métier) ; *retry* avec *backoff* exponentiel ; **idempotence** et clés de déduplication ; cohérence éventuelle ; files d'attente ; limites de débit (429, `Retry-After`).
- **Savoir-faire** : prévoir un chemin d'erreur pour chaque étape critique ; rendre un traitement rejouable sans doublon ; traiter un même événement reçu deux fois ; isoler les messages en échec pour reprise ; tester les cas limites (champ manquant, langue étrangère, spam, contenu malveillant).
- **Technologies** : *Error Workflow* et *Retry on fail* de n8n, gestionnaires d'erreurs Make, stockage d'état (base, Redis, Data Tables).

### C2.4 Exploiter et maintenir
- **Savoirs** : journalisation, alertes, supervision ; gestion des secrets ; environnements (dev / prod) ; versioning ; documentation d'exploitation (*runbook*).
- **Savoir-faire** : exporter et versionner les workflows ; documenter pour qu'un tiers reprenne ; mettre en place une alerte utile (pas de bruit) ; auto-héberger n8n proprement (Docker, sauvegardes, mises à jour) ou choisir le cloud ; transmettre au client.
- **Technologies** : Docker / Docker Compose, Git, variables d'environnement et *credentials* n8n, notifications (email, Slack, Teams).

---

## B3 — Intégration LLM, RAG & agents

### C3.1 Concevoir des prompts de production et des sorties structurées
- **Savoirs** : fonctionnement d'un LLM (tokens, fenêtre de contexte, température, échantillonnage) ; rôles *system / user / assistant* ; *few-shot* ; hallucination ; sorties structurées (JSON Schema, *tool/function calling*) ; limites de la classification par LLM.
- **Savoir-faire** : écrire un prompt système robuste (rôle, contexte, règles, format, exemples, refus) ; imposer et **valider** une sortie JSON ; gérer l'incertitude (score de confiance, catégorie « à vérifier ») ; versionner les prompts.
- **Technologies** : API Anthropic / OpenAI / Mistral, nœuds LLM de n8n, validation de schéma (Zod, JSON Schema), outils de gestion de prompts.

### C3.2 Mettre en œuvre un RAG (Retrieval-Augmented Generation)
- **Savoirs** : embeddings, similarité, découpage (*chunking*), métadonnées, recherche hybride (lexicale + vectorielle), *reranking*, fenêtre de contexte ; causes d'échec d'un RAG ; RAG vs *fine-tuning* vs contexte long.
- **Savoir-faire** : ingérer un corpus hétérogène (PDF, pages, tableaux) ; choisir une stratégie de découpage ; citer les sources ; **répondre « je ne sais pas »** hors corpus ; mettre à jour l'index quand les documents changent ; respecter les droits d'accès.
- **Technologies** : pgvector (Postgres / Supabase), Qdrant, bases vectorielles intégrées à n8n ; modèles d'embedding ; LlamaIndex / LangChain (optionnel).

### C3.3 Concevoir des agents et l'usage d'outils
- **Savoirs** : agent = LLM + outils + boucle + mémoire ; *tool use* ; **Model Context Protocol (MCP)** ; patrons (routeur, orchestrateur-exécutants, évaluateur-optimiseur) ; quand **ne pas** utiliser d'agent ; garde-fous.
- **Savoir-faire** : définir des outils aux contrats clairs ; limiter les permissions et le nombre d'itérations ; insérer une validation humaine avant toute action irréversible ; journaliser les décisions de l'agent ; préférer un workflow déterministe quand il suffit.
- **Technologies** : nœud AI Agent de n8n, SDK d'agents (Claude Agent SDK, OpenAI Agents SDK), LangGraph, serveurs MCP.

### C3.4 Évaluer et optimiser
- **Savoirs** : jeux d'évaluation (*golden set*), métriques (exactitude, rappel/précision, fidélité aux sources, taux de refus correct), *LLM-as-a-judge* et ses biais, tests de régression ; compromis qualité / coût / latence ; *prompt caching*, *batch*.
- **Savoir-faire** : construire un jeu d'évaluation représentatif **avant** d'optimiser ; comparer deux prompts ou deux modèles de façon chiffrée ; suivre coût et latence par requête ; choisir le plus petit modèle suffisant.
- **Technologies** : Langfuse, promptfoo, tableurs d'évaluation, évaluations natives des fournisseurs.

---

## B4 — Développement & données

### C4.1 Programmer des scripts et composants
- **Savoirs** : variables, types, conditions, boucles, fonctions ; structures de données (listes, objets/dictionnaires) ; JSON ; appels HTTP ; exceptions ; asynchronisme (JS).
- **Savoir-faire** : écrire un nœud Code (JavaScript ou Python) qui transforme des données ; écrire un script autonome qui appelle une API et gère ses erreurs ; lire et corriger du code produit par une IA ; écrire des fonctions testables.
- **Technologies** : **Python** (requests/httpx, pandas) et/ou **JavaScript/TypeScript** (Node.js, fetch) ; éditeur avec assistant IA (VS Code, Cursor, Claude Code).

### C4.2 Manipuler et fiabiliser les données
- **Savoirs** : modèle relationnel, clés, jointures ; SQL (SELECT, JOIN, GROUP BY, UPSERT) ; qualité des données (complétude, unicité, validité, cohérence) ; normalisation (téléphone E.164, emails, casse, accents) ; dédoublonnage approximatif.
- **Savoir-faire** : auditer un fichier client (profiling) ; normaliser et dédoublonner avec des règles explicites et traçables ; modéliser une petite base ; migrer d'Excel vers une base ou un CRM sans perte.
- **Technologies** : SQL (PostgreSQL / SQLite), tableurs, Airtable / NocoDB, pandas.

### C4.3 Développer et exposer un service ou un prototype
- **Savoirs** : client / serveur, API, front / back, authentification applicative ; *vibe coding* et ses risques (dette, sécurité) ; accessibilité de base.
- **Savoir-faire** : construire un prototype utilisable (formulaire, tableau de bord, mini-API) en quelques jours ; exposer une fonction via une API ; livrer une démo stable.
- **Technologies** : Next.js / React ou Streamlit / FastAPI ; outils de génération (Lovable, v0, Bolt, Claude Code) ; Supabase.

### C4.4 Industrialiser
- **Savoirs** : Git (commit, branche, *pull request*) ; tests automatisés ; CI/CD ; conteneurs ; variables d'environnement et secrets ; hébergement (PaaS, VPS, serverless).
- **Savoir-faire** : versionner un projet proprement ; écrire quelques tests utiles ; déployer une application (Vercel, VPS Docker) ; documenter l'installation (README).
- **Technologies** : Git / GitHub, GitHub Actions, Docker, Vercel, hébergeurs européens (OVHcloud, Scaleway, Clever Cloud).

---

## B5 — Architecture, sécurité & exploitation

### C5.1 Concevoir une architecture cible
- **Savoirs** : composants d'un système IA (sources, ingestion, stockage, modèles, orchestration, interfaces, supervision) ; *build vs buy* ; couplage, scalabilité, points de défaillance ; intégration au SI existant.
- **Savoir-faire** : produire un schéma d'architecture et un dossier de choix argumenté (options, critères, décision — *ADR*) ; dimensionner pour une TPE/PME (ni sous- ni sur-ingénierie) ; prévoir la réversibilité.
- **Technologies** : C4 model / Mermaid / draw.io ; briques cloud et SaaS.

### C5.2 Choisir modèles et hébergement
- **Savoirs** : modèles propriétaires via API vs modèles à poids ouverts ; tailles et capacités ; résidence des données et souveraineté (UE) ; conditions contractuelles (conservation, entraînement sur les données) ; coûts ; local (Ollama) vs cloud.
- **Savoir-faire** : comparer 2-3 options sur des critères pondérés (qualité mesurée, coût, conformité, latence, réversibilité) ; justifier le choix auprès d'un dirigeant ; prévoir un modèle de repli.
- **Technologies** : Anthropic, OpenAI, Mistral (UE), Azure OpenAI / AWS Bedrock / Vertex AI (régions UE), Ollama, vLLM.

### C5.3 Sécuriser les systèmes IA
- **Savoirs** : **OWASP Top 10 pour les applications LLM** (injection de prompt directe et indirecte, divulgation d'informations sensibles, gestion non sécurisée des sorties, autonomie excessive…) ; moindre privilège ; gestion des secrets ; modélisation de menaces.
- **Savoir-faire** : identifier les entrées non fiables (emails, documents, pages web) ; empêcher qu'un contenu malveillant déclenche une action ; masquer ou exclure les données sensibles (IBAN, santé) ; séparer instructions et données ; tester avec des attaques simples.
- **Technologies** : garde-fous (validation de schéma, listes blanches d'actions), détecteurs de données personnelles, gestionnaires de secrets.

### C5.4 Observer et piloter en production
- **Savoirs** : traces, métriques, journaux ; KPI techniques (taux d'erreur, latence, coût) et métier (temps gagné, taux d'automatisation, satisfaction) ; SLA ; dérive de qualité ; plan de continuité.
- **Savoir-faire** : instrumenter un workflow / une application LLM ; construire un tableau de bord utile au client ; définir des seuils d'alerte ; organiser une revue périodique de la qualité.
- **Technologies** : Langfuse, journaux d'exécution n8n, Grafana / Metabase, alertes.

---

## B6 — Conformité, éthique & gouvernance

### C6.1 Appliquer le RGPD aux projets IA
- **Savoirs** : donnée personnelle, traitement, responsable / sous-traitant (art. 28) ; bases légales ; minimisation ; information et droits des personnes ; durée de conservation ; registre des traitements ; AIPD ; transferts hors UE ; fiches pratiques IA de la CNIL.
- **Savoir-faire** : cartographier les données personnelles d'un flux ; choisir et justifier la base légale ; minimiser (ne pas envoyer au LLM ce qui n'est pas nécessaire) ; vérifier les conditions d'un fournisseur ; rédiger une fiche de registre ; savoir quand une AIPD est requise.
- **Technologies** : modèles de registre CNIL, outil PIA de la CNIL, DPA (accords de sous-traitance) des fournisseurs.

### C6.2 Qualifier et appliquer l'AI Act
- **Savoirs** : rôles (fournisseur, déployeur, importateur, distributeur) ; pratiques interdites ; haut risque (annexes I et III) ; transparence (art. 50) ; littératie (art. 4, obligation de moyens depuis l'Omnibus) ; GPAI ; calendrier 2025-2028 (Règlement (UE) 2026/1744).
- **Savoir-faire** : qualifier un cas d'usage (rôle + niveau de risque) ; identifier les obligations applicables à une PME déployeuse ; rédiger les mentions de transparence ; documenter les mesures de littératie.
- **Technologies** : textes officiels (EUR-Lex), vérificateurs de conformité, lignes directrices de la Commission.

### C6.3 Gouverner l'usage de l'IA
- **Savoirs** : *shadow AI* ; charte d'usage ; gestion des risques ; biais et équité ; impact environnemental ; notions d'**ISO/IEC 42001** ; propriété intellectuelle et confidentialité.
- **Savoir-faire** : rédiger une charte d'usage de l'IA applicable par des non-spécialistes ; proposer des outils autorisés et des règles simples ; mettre en place un registre des usages IA ; animer une revue des risques.
- **Technologies** : offres « entreprise » des assistants (sans entraînement sur les données), SSO, registre partagé.

---

## B7 — Produit, adoption & transmission

### C7.1 Concevoir un produit ou un MVP centré utilisateur
- **Savoirs** : *product discovery*, personas, parcours, *jobs to be done* ; MVP vs PoC vs prototype ; métriques d'usage et d'adoption ; UX des systèmes IA (explicabilité, correction, confiance).
- **Savoir-faire** : définir le plus petit produit utile ; prototyper et tester avec de vrais utilisateurs ; itérer sur des métriques ; concevoir l'interface de validation humaine.
- **Technologies** : Figma / maquettes, outils de prototypage IA, analytics simples.

### C7.2 Convaincre et restituer
- **Savoirs** : structure d'un pitch (problème, impact, solution, preuve, coût, risques, décision attendue) ; restitution exécutive ; démonstration.
- **Savoir-faire** : produire un pitch deck de 8-12 slides pour un dirigeant ; présenter chiffres et hypothèses honnêtement ; répondre aux objections ; faire une démonstration qui ne casse pas.
- **Technologies** : Google Slides / PowerPoint / Gamma / slides HTML, enregistrement vidéo de démo.

### C7.3 Accompagner le changement
- **Savoirs** : cartographie des parties prenantes (influence / attitude) ; courbe du changement ; résistances et leurs causes ; communication.
- **Savoir-faire** : identifier sponsors, relais et opposants ; construire un plan d'accompagnement (communication, pilotes, ambassadeurs) ; traiter une résistance en entretien ; mesurer l'adoption.
- **Technologies** : matrices parties prenantes, enquêtes, tableaux d'adoption.

### C7.4 Former et documenter
- **Savoirs** : ingénierie pédagogique (objectifs, progression, modalités, évaluation) ; littératie IA (DigComp 3.0, art. 4 AI Act) ; adultes en formation ; documentation utilisateur vs technique.
- **Savoir-faire** : concevoir un module de formation avec objectifs évaluables ; animer pour des publics hétérogènes ; produire une documentation utilisateur et un tutoriel vidéo ; évaluer les acquis.
- **Technologies** : outils de création (Canva, NotebookLM, HeyGen), LMS, formulaires d'évaluation.

---

## 2.3 Matrice poste × compétence (niveau attendu pour un profil confirmé)

> Lecture : niveau minimum attendu pour être crédible sur le poste. « — » = non discriminant. La colonne **Consultant formateur IA TPE/PME** correspond au positionnement indépendant visé par ce parcours.

| Compétence | AI Automation Engineer | AI Integrator | AI Product Builder | AI Architect | Consultant formateur IA TPE/PME |
|---|---|---|---|---|---|
| C1.1 Diagnostiquer les processus | N2 | N3 | N3 | N2 | N3 |
| C1.2 Qualifier les cas d'usage | N2 | N3 | N3 | N3 | N3 |
| C1.3 Prioriser et chiffrer | N2 | N3 | N3 | N3 | N3 |
| C1.4 Formaliser le cadrage | N2 | N3 | N3 | N3 | N3 |
| C2.1 Concevoir un workflow | **N4** | N3 | N3 | N3 | N3 |
| C2.2 Intégrer des API | **N4** | **N4** | N3 | N3 | N3 |
| C2.3 Fiabiliser | **N4** | N3 | N2 | N3 | N3 |
| C2.4 Exploiter et maintenir | N3 | N3 | N2 | N3 | N2 |
| C3.1 Prompts et sorties structurées | N3 | N3 | N3 | N3 | N3 |
| C3.2 RAG | N3 | N3 | N3 | **N4** | N3 |
| C3.3 Agents et outils | N3 | N3 | N3 | **N4** | N2 |
| C3.4 Évaluer et optimiser | N3 | N3 | N2 | **N4** | N2 |
| C4.1 Programmer | N3 | N3 | N2 | N3 | N2 |
| C4.2 Données | N3 | N3 | N2 | N3 | N2 |
| C4.3 Service / prototype | N2 | N2 | **N4** | N3 | N2 |
| C4.4 Industrialiser | N2 | N3 | N2 | N3 | N1 |
| C5.1 Architecture cible | N2 | N3 | N2 | **N4** | N2 |
| C5.2 Modèles et hébergement | N2 | N3 | N2 | **N4** | N3 |
| C5.3 Sécuriser | N3 | N3 | N2 | **N4** | N2 |
| C5.4 Observer et piloter | N3 | N3 | N2 | N3 | N2 |
| C6.1 RGPD | N2 | N3 | N2 | N3 | N3 |
| C6.2 AI Act | N1 | N3 | N2 | N3 | N3 |
| C6.3 Gouvernance | N1 | N2 | N2 | N3 | N3 |
| C7.1 Produit / MVP | N2 | N2 | **N4** | N2 | N3 |
| C7.2 Convaincre et restituer | N2 | N3 | N3 | N3 | **N4** |
| C7.3 Changement | N1 | N2 | N3 | N2 | **N4** |
| C7.4 Former et documenter | N2 | N2 | N2 | N2 | **N4** |

### Profils de maîtrise par bloc (synthèse)

> Fourchette des niveaux attendus dans le bloc (min – max). La validation se fait toujours **compétence par compétence** ; ce tableau sert à lire rapidement un profil.

| Bloc | Automation Eng. | Integrator | Product Builder | Architect | Consultant formateur |
|---|---|---|---|---|---|
| B1 | N2 | N3 | N3 | N2 – N3 | N3 |
| B2 | **N3 – N4** | N3 – N4 | N2 – N3 | N3 | N2 – N3 |
| B3 | N3 | N3 | N2 – N3 | **N3 – N4** | N2 – N3 |
| B4 | N2 – N3 | N2 – N3 | N2 – **N4** | N3 | N1 – N2 |
| B5 | N2 – N3 | N3 | N2 | **N3 – N4** | N2 – N3 |
| B6 | N1 – N2 | N2 – N3 | N2 | N3 | N3 |
| B7 | N1 – N2 | N2 – N3 | N2 – **N4** | N2 – N3 | **N3 – N4** |
