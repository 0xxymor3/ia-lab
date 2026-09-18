---
titre: "1 — Analyse du marché : besoins des TPE/PME et attentes des recruteurs"
ordre: 1
resume: "Adoption de l'IA en France et dans l'UE, besoins concrets des TPE/PME, cadre réglementaire 2026, analyse d'offres d'emploi et certifications de référence."
---

# 1 — Analyse du marché

> Données collectées en septembre 2026. Les chiffres sont sourcés en fin de chapitre ; les interprétations sont signalées comme telles.

## 1.1 Messages clés

1. **L'adoption explose mais reste superficielle.** 26 % des TPE-PME françaises utilisent au moins un outil d'IA en 2025 (13 % en 2024, 5 % en 2023) — mais surtout de façon individuelle et opportuniste dans les très petites structures. [FN25]
2. **Le frein n°1 est la compétence, pas le coût.** Dans l'UE, parmi les entreprises ayant envisagé l'IA sans l'adopter, 70,9 % citent le manque d'expertise, 52,5 % l'incertitude juridique, 48,8 % la protection des données ; le coût n'arrive qu'autour de 20 %. [EUROSTAT25]
3. **L'écart « conscience / action » est le marché du consultant.** 58 % des dirigeants de PME-ETI voient l'IA comme une question de survie à 3-5 ans, mais seulement 32 % l'utilisent ; dans 73 % des cas, c'est le dirigeant qui porte le sujet. [BPI25]
4. **La conformité devient un argument commercial.** Le Digital Omnibus (Règlement (UE) 2026/1744) a décalé les obligations « haut risque » mais maintenu la transparence (art. 50) et transformé la littératie IA (art. 4) en obligation de moyens ; RGPD et doctrine CNIL restent pleinement applicables. [OMNIBUS]
5. **Les recruteurs attendent des profils hybrides et « production-ready ».** Même les postes « no-code » exigent API, JSON, webhooks, SQL et souvent Python/JS ; les différenciateurs sont les agents, le RAG, les sorties structurées, la fiabilisation (HITL, monitoring, coûts) et la capacité à cadrer et former. [Analyse §1.5]

## 1.2 Adoption de l'IA : chiffres de référence

### Union européenne (Eurostat, entreprises ≥ 10 salariés)

| Indicateur | 2024 | 2025 |
|---|---|---|
| Part des entreprises utilisant au moins une technologie d'IA | 13,5 % | **20,0 %** |
| Petites entreprises (10-49) | — | 17 % |
| Moyennes entreprises (50-249) | — | 30,4 % |
| Grandes entreprises (250+) | — | 55,0 % |
| Pays le plus avancé / le moins avancé | — | Danemark 42,0 % / Roumanie 5,2 % |

Technologies les plus utilisées (2025) : analyse de texte (11,8 %), génération d'images/vidéo/audio (9,5 %), génération de langage écrit/oral (8,8 %), transcription voix-texte (7,2 %). Finalités principales : marketing et ventes (34,7 % des entreprises utilisatrices), administration et gestion (31,1 %). [EUROSTAT25]

**Lecture consultant :** l'écart petites (17 %) / moyennes (30 %) entreprises est la zone de croissance : les petites structures manquent d'expertise interne et achètent du conseil, de la formation et des automatisations clés en main.

### France (TPE-PME)

| Source | Résultat |
|---|---|
| Baromètre France Num 2025 (DGE / CRÉDOC, 11 021 entreprises, mars-avril 2025) | **26 %** des TPE-PME utilisent au moins un outil d'IA (13 % en 2024, 5 % en 2023). Écart sectoriel : 41 % dans le numérique, 9 % dans l'agriculture. Les TPE < 10 salariés restent sur des usages individuels ; les 10-19 salariés commencent à structurer ; les PME en font un outil de pilotage. Plus d'un tiers des entreprises ont déjà subi un incident de cybersécurité. [FN25] |
| Bpifrance Le Lab, « L'IA dans les PME et ETI françaises : une révolution tranquille » (juin 2025, 1 200 dirigeants) | 58 % des dirigeants voient l'IA comme un enjeu de survie à 3-5 ans ; 32 % des PME-ETI l'utilisent ; 73 % des transformations sont portées par le dirigeant ; l'usage personnel du dirigeant est un prédicteur fort de l'adoption dans l'entreprise. [BPI25] |

**Lecture consultant :** l'entrée commerciale naturelle dans une PME est le **dirigeant** (sponsor), l'obstacle est l'**organisation** (compétences, données, peur de l'erreur juridique). Un consultant formateur qui sait à la fois acculturer, cadrer, livrer une automatisation fiable et sécuriser juridiquement couvre toute la chaîne de valeur.

## 1.3 Besoins concrets des TPE/PME (typologie de cas d'usage)

| Famille de besoins | Exemples concrets en TPE/PME | Compétences mobilisées | Poste le plus proche |
|---|---|---|---|
| **Flux entrants** | Tri et qualification des emails / formulaires / demandes de devis ; extraction des infos ; création dans le CRM ; brouillon de réponse validé par un humain | C2.1-C2.3, C3.1, C6.1 | AI Automation Engineer |
| **Documents & connaissance** | Assistant qui répond à partir des procédures, notices, CGV, appels d'offres ; recherche documentaire | C3.2, C3.4, C5.3 | AI Integrator |
| **Administration & finance** | Réception des factures électroniques (obligatoire pour toutes les entreprises depuis le 1ᵉʳ sept. 2026 ; émission obligatoire pour les PME au 1ᵉʳ sept. 2027 via plateforme agréée), rapprochements, relances, notes de frais | C2.2, C4.2, C6.1 | AI Automation Engineer |
| **Commercial & marketing** | Hygiène et enrichissement CRM, contenus, prospection, suivi d'avis clients | C2.2, C3.1, C7.1 | AI Product Builder |
| **Service client & SAV** | Réponses assistées, priorisation des tickets, bases de connaissances, voicebots | C3.2, C3.3, C5.4 | AI Integrator |
| **RH & compétences** | Onboarding, formation, littératie IA des équipes (art. 4 AI Act), charte d'usage | C7.3, C7.4, C6.3 | Consultant formateur |
| **Gouvernance** | Encadrement du « shadow AI » (données clients collées dans des outils grand public), choix d'outils conformes, registre des traitements | C6.1-C6.3, C5.2 | AI Architect / Integrator |
| **Outils métiers sur mesure** | Petites applications internes (suivi chantier, planning, devis) prototypées vite | C4.3, C7.1 | AI Product Builder |

**Contraintes typiques à intégrer dans tout cas pratique :** budget de 5 à 30 k€ ; absence de DSI ; outils hétérogènes (Excel, ERP métier ancien sans API, Google Workspace ou Microsoft 365) ; données incomplètes et dupliquées ; forte dépendance à quelques personnes clés ; sensibilité RGPD (données clients et salariés) ; faible tolérance à l'erreur visible par le client.

## 1.4 Cadre réglementaire et dispositifs en 2026

### RGPD et doctrine CNIL
La CNIL a finalisé entre 2024 et 2025 un corpus de **fiches pratiques IA** : champ d'application du RGPD, finalité, base légale, minimisation, information des personnes (2024) ; intérêt légitime et moissonnage (juin 2025) ; sécurité, annotation et statut des modèles (juillet 2025). [CNIL-IA] Pour un consultant, les réflexes indispensables sont : base légale, minimisation, information, durée de conservation, sous-traitance (art. 28), transferts hors UE, analyse d'impact (AIPD) si risque élevé.

### AI Act après le Digital Omnibus
| Échéance | Obligation |
|---|---|
| 1ᵉʳ août 2024 | Entrée en vigueur du Règlement (UE) 2024/1689. |
| 2 février 2025 | Pratiques interdites ; littératie IA (art. 4). |
| 2 août 2025 | Obligations des modèles d'IA à usage général (GPAI). |
| 27 juillet 2026 | Entrée en vigueur du **Digital Omnibus sur l'IA**, Règlement (UE) 2026/1744 (publié au JOUE le 24 juillet 2026). |
| 2 août 2026 | Transparence (art. 50) : information des personnes qui interagissent avec une IA — **maintenue**. Début de la supervision par les autorités nationales. |
| 2 décembre 2026 | Fin de la période de grâce pour le marquage lisible par machine des contenus générés, pour les systèmes mis sur le marché avant le 2 août 2026. |
| 2 décembre 2027 | Obligations « haut risque » des systèmes autonomes de l'annexe III (au lieu du 2 août 2026). |
| 2 août 2028 | Obligations « haut risque » des systèmes intégrés à des produits réglementés (annexe I). |

Changements notables de l'Omnibus : l'**article 4** devient une obligation de moyens (« prendre des mesures pour soutenir le développement de la littératie en IA », sans exigence de niveau individuel garanti ni certificat imposé) ; la possibilité de traiter des données sensibles pour détecter les biais est étendue à tous les systèmes, sous condition de stricte nécessité ; les systèmes non haut risque auto-évalués restent à enregistrer, avec une charge allégée. [OMNIBUS]

**Lecture consultant :** pour une TPE/PME *déployeuse* d'outils d'IA, les sujets opérationnels en 2026 sont (1) la transparence envers les clients (chatbots, contenus générés), (2) la littératie des équipes — un marché direct pour la formation, (3) la vérification qu'aucun usage ne bascule en haut risque (ex. : tri de candidatures, notation de salariés — annexe III).

### Facturation électronique
Réception obligatoire pour toutes les entreprises assujetties à la TVA depuis le **1ᵉʳ septembre 2026** ; émission obligatoire au 1ᵉʳ septembre 2026 pour les grandes entreprises et ETI, au **1ᵉʳ septembre 2027** pour les PME et micro-entreprises, via une plateforme agréée. [EFACT] → Source de nombreux cas d'automatisation (réception, contrôle, imputation, relances).

### Financements mobilisables (arguments commerciaux)
- **Bpifrance — IA Booster (France 2030)** : sensibilisation collective, *Diag Data IA* (entreprises de 10 à 2 000 salariés, CA > 1 M€, audit de 3 à 10 jours par un expert référencé, coût annoncé 10 000 € HT avec prise en charge partielle — modalités à vérifier sur le site officiel), puis accompagnement à la mise en œuvre ; dispositif annoncé ouvert jusqu'au 31 décembre 2026. [BPI-DIAG]
- **OPCO et CPF** : financement de formations certifiantes (RNCP / Répertoire spécifique) pour les salariés et dirigeants.
- **Régions** : dispositifs d'appui au numérique à vérifier au cas par cas (ex. Région Bretagne pour un consultant basé à Vannes).

## 1.5 Analyse d'offres d'emploi

### Méthode et limites
Échantillon qualitatif de **20 annonces** publiées entre fin 2025 et septembre 2026 (Welcome to the Jungle, agrégateurs, sites d'entreprises), dont **9 lues intégralement** et 11 analysées à partir de résumés publics. Biais connus : surreprésentation de Paris, des ESN/cabinets et des scale-ups ; **les TPE/PME recrutent rarement ces profils en CDI** — elles achètent des prestations. L'échantillon renseigne donc sur les *standards de compétence* du marché, pas sur le volume de demande des TPE/PME.

### Synthèse par intitulé

| Intitulé (exemples d'annonces) | Missions récurrentes | Compétences et technologies citées | Expérience / rémunération observées |
|---|---|---|---|
| **AI Automation Engineer** (Stockly, Leadtech, Edflex, Future, BNP Paribas) | Automatiser les process Sales/Ops/Finance/Support ; tri d'emails, remboursements, escalades ; agents multi-étapes ; tests d'API ; documentation et runbooks | n8n (souvent « core stack »), Make, Zapier ; API REST, auth, webhooks ; **Python et JavaScript pour les nœuds Code** ; sorties structurées (JSON Schema), classification ; Postman ; SQL ; LangChain/LangGraph/CrewAI ; HITL, guardrails, audit logs ; suivi précision/latence/coût API ; RGPD | 1 à 5 ans ; 45-75 k€ (Stockly), 50-70 k€ (Edflex) |
| **AI Product Builder** (Wivoo/Wavestone, WeFiiT, Thiga, Lemon Learning) | 50 % discovery (shadowing, interviews, design, ROI) / 50 % delivery (workflows, PoC, MVP, agents en production) ; mesure d'impact | Cursor, Lovable, v0, Bolt ; API OpenAI / Claude / Gemini ; Make, n8n, Zapier ; Airtable, Notion, Webflow ; **savoir relire Python/JSON** ; product discovery, backlog, mesure (heures gagnées, adoption) | Alternance à > 5 ans ; 52-65 k€ (Wivoo) |
| **AI Architect** (Akkodis/Adecco, NTT Data, ILLUIN, La Banque Postale, Crédit Agricole, Accenture) | Architectures GenAI robustes et scalables ; choix de frameworks et services ; industrialisation ; gouvernance ; plateformes agentiques mutualisées ; avant-vente | LLM, RAG, bases vectorielles, agents ; MLOps et observabilité ; Azure / AWS / GCP ; conteneurs, Kubernetes ; FastAPI, GraphQL ; souveraineté ; dialogue technique et non technique | **Bac+5 et ≥ 5 ans** fréquemment exigés |
| **AI Integrator / Consultant IA** (Square Management, data-major, Margo, Pennylane, lemlist) | Cadrer les cas d'usage, arbitrer RAG / agents / ML classique, business cases (coûts compute/tokens), intégrer au SI data, restituer au COMEX | LLM, RAG, agents ; **Python** ; plateformes data (Fabric, Snowflake, Databricks) ; cloud ; évaluation et observabilité ; RGPD ; vulgarisation ; anglais | 3 à 8 ans ; profils hybrides business/tech valorisés |

### Fréquence des exigences (sur 20 annonces, indicative)

| Exigence | Nb d'annonces | Commentaire |
|---|---|---|
| Agents / orchestration multi-étapes | ~11 | Devenu le standard 2026, y compris hors postes « engineer ». |
| Python | ~9 | Obligatoire pour Architect / Integrator ; « lecture » ou « notions » pour Builder ; niveau intermédiaire pour les nœuds Code n8n. |
| RAG et recherche sémantique | ~8 | Cœur des postes Integrator / Architect / consultant. |
| API REST, webhooks, authentification | ~6 explicitement (implicite ailleurs) | « API literacy » : lire une doc, gérer l'auth, structurer des flux fiables. |
| n8n / Make / Zapier | ~6 | n8n domine ; Make apprécié ; Zapier en entrée de gamme. |
| Cloud (Azure, AWS, GCP) | ~6 | Surtout Architect / Integrator en ESN et grands comptes. |
| Sorties structurées, prompting avancé | ~5 | JSON Schema, classification multi-catégories, extraction. |
| Discovery, cadrage, ateliers | ~5 | Builder et consultant. |
| Évaluation, monitoring, observabilité | ~4 | Précision, latence, coûts API ; Langfuse / LangSmith / MLflow. |
| RGPD, sécurité, conformité | ~4 | Souvent associé aux données clients et aux agents. |
| Business case, ROI, coût des tokens | ~3 | Consultant / Builder. |
| Conduite du changement, formation, documentation | ~3 | **Atout rare** : peu de candidats techniques le maîtrisent. |
| Docker / Kubernetes / CI-CD | ~3 | Architect / Integrator. |

### Enseignements pour le parcours
1. **Le « no-code seul » ne suffit plus.** Même les postes centrés sur n8n demandent du Python/JavaScript (nœuds Code), du SQL et une réelle culture API. → B4 est un prérequis, pas une option.
2. **Le socle technique commun** : sorties structurées + RAG + agents avec outils + intégrations API. → B3 au niveau N3 est la cible centrale.
3. **Le différenciateur est la mise en production** : gestion d'erreurs, idempotence, validation humaine, monitoring, coûts, sécurité (injection de prompt). → C2.3, C3.4, C5.3, C5.4.
4. **La double compétence business/tech est explicitement recherchée** (discovery, ROI, restitution, formation, conduite du changement). → B1 et B7 sont des accélérateurs pour un profil venant de la formation et du commerce.
5. **AI Architect est une cible à moyen terme** : diplôme Bac+5 et 5 ans d'expérience très souvent demandés ; il faut compenser par des preuves d'architecture (dossiers, systèmes déployés) et, idéalement, des certifications cloud / éditeur.
6. **Pour les TPE/PME, le débouché naturel est le conseil indépendant** : les baromètres 2026 des plateformes de freelancing situent les spécialistes IA et automatisation entre 700 et 1 500 €/jour, avec une forte dispersion (de moins de 400 € à plus de 1 000 €) selon la preuve de résultats. [TJM] → Le portfolio vérifiable est l'actif commercial principal.

## 1.6 Référentiels et certifications de référence

### Certifications françaises (France Compétences — consultables sur Mon Compte Formation via FranceConnect)

| Code | Intitulé | Niveau | Validité | Ce qu'on en retient pour ce parcours |
|---|---|---|---|---|
| RNCP37827 | Développeur en intelligence artificielle (Simplon) | 6 | 2023-2028 | BC01 données (extraction, SQL, BDD conforme RGPD, API REST) ; BC02 intégration de services/modèles IA (veille, services préentraînés, API de modèle, monitoring, CI/CD MLOps) ; BC03 applications IA (besoin, architecture, agilité, accessibilité, tests automatisés, livraison continue, incidents). Évaluation : mises en situation, rapports, démonstrations, jury ≥ 2 professionnels. |
| RNCP40247 | Product Builder No-Code (PSTB) | 6 | 2025-2028 | Cadrage (veille, besoins, idéation, benchmark, périmètre) ; conception (personas, prototypes, **automatisations API**, scalabilité, adoption) ; performance et conformité (sécurité RGPD, tests, analytics, maintenance) ; pilotage de projet. |
| RNCP36129 | Chef de projet en intelligence artificielle (Ascencia) | 7 | 2022-2025 (inactive) | Structure utile : design thinking, pilotage (budget, équipe, prestataires), développement, déploiement (RGPD, cybersécurité, impact sociétal et environnemental, présentation à des non-spécialistes). |
| RNCP38587 | Expert en ingénierie de l'intelligence artificielle | 7 | depuis 2024 | Niveau d'exigence d'un AI Architect. |
| RNCP40677 | Chef de projet Digital, IA & no-code (Oreegami) | — | depuis 2025 | Pilotage de projets digitaux avec automatisation no-code et IA générative. |
| RS7344 | Développer son activité avec l'IA | — | 2025-2030 | Proche du métier de consultant TPE/PME : identifier les opportunités, planifier, mettre en œuvre en conformité, déployer auprès des équipes (formation, charte éthique), évaluer l'impact. Évaluation : mise en situation professionnelle + jury. |
| RS6776 / RS6891 | Contenus avec l'IA générative | — | — | Niveau **utilisateur** : insuffisant pour les postes visés, utile comme référence pour concevoir des formations d'acculturation. |

### Certifications internationales et éditeurs (signal de crédibilité)

| Certification | Intérêt | Poste |
|---|---|---|
| Anthropic — Claude Certified Associate / Developer / Architect (Foundations), Architect Professional (Pearson VUE, 2026) | Agents, MCP, prompt et context engineering ; examen surveillé, sans IA | Integrator, Architect |
| Microsoft AI-103 — Azure AI App & Agent Developer Associate (remplace AI-102, retiré le 30 juin 2026) | GenAI et agents sur Azure AI Foundry — fréquent en ESN/grands comptes | Integrator, Architect |
| AWS Certified AI Practitioner / ML Engineer – Associate | Culture cloud IA (Bedrock) | Architect |
| Google Cloud Generative AI Leader | Stratégie et cas d'usage GenAI | Product Builder, consultant |
| IAPP AIGP (AI Governance Professional) | Gouvernance IA, AI Act, gestion des risques | Integrator, Architect, consultant |
| ISO/IEC 42001 Lead Implementer | Système de management de l'IA | Consultant gouvernance |
| n8n Academy (niveaux, badges vérifiables, gratuits) / Make Academy | Preuve d'outil, rapide à obtenir | Automation Engineer |

### Cadres européens
- **e-CF (EN 16234-1)** : 5 domaines (Plan, Build, Run, Enable, Manage), niveaux de maîtrise e-1 à e-5. Correspondances utilisées : A.4 Planification produit/service, A.5 Conception d'architecture, A.6 Conception d'application, A.7 Veille technologique, B.1 Développement, B.2 Intégration de composants, B.3 Tests, B.4 Déploiement de solution, B.5 Production de documentation, D.3 Formation, D.11 Identification des besoins, E.2 Gestion de projet, E.3 Gestion des risques, E.8 Sécurité de l'information, E.9 Gouvernance des SI.
- **ESCO** : taxonomie européenne des métiers et compétences, utilisée pour décrire les compétences en termes transférables entre pays.
- **DigComp 3.0** (JRC, 27 novembre 2025) : intègre systématiquement la compétence IA (y compris générative) dans toutes les aires ; référence pour concevoir des formations de littératie IA (C7.4). [DIGCOMP]

## Sources

- [EUROSTAT25] Eurostat, *20 % of EU enterprises use AI technologies* (11/12/2025) et *Use of artificial intelligence in enterprises* — https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2 ; https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Use_of_artificial_intelligence_in_enterprises
- [FN25] France Num / DGE, *Baromètre France Num 2025* (29/09/2025) — https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2025-le
- [BPI25] Bpifrance Le Lab, *L'IA dans les PME et ETI françaises : une révolution tranquille* (juin 2025) — https://presse.bpifrance.fr/lia-dans-les-pme-et-eti-francaises-une-revolution-tranquille
- [OMNIBUS] White & Case, *EU AI Omnibus enters into force* ; Freshfields, *EU AI Act unpacked #34* ; lawandtechnology.eu, *AI literacy: the Digital Omnibus rewrites Article 4* — https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act ; https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-34-the-final-digital-omnibus-on-ai-key-amendments-to-the-a-102nber ; https://lawandtechnology.eu/en/ai-literacy-digital-omnibus-article-4-ai-act/
- [CNIL-IA] CNIL, *Les fiches pratiques IA* — https://www.cnil.fr/fr/les-fiches-pratiques-ia
- [EFACT] economie.gouv.fr, *Tout savoir sur la facturation électronique* ; impots.gouv.fr, *Facturation électronique et plateformes agréées* — https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises
- [BPI-DIAG] Bpifrance, *Diag Data IA* — https://diag.bpifrance.fr/diag-data-ia
- [TJM] Baromètres TJM freelance 2026 (freelance-solution.fr, studeria.fr, blogdumoderateur.com) — sources privées, à utiliser comme ordre de grandeur.
- France Compétences : RNCP37827, RNCP40247, RNCP36129, RS7344 — https://www.francecompetences.fr/recherche/rncp/37827/ ; https://www.francecompetences.fr/recherche/rncp/40247/ ; https://www.francecompetences.fr/recherche/rncp/36129/ ; https://www.francecompetences.fr/recherche/rs/7344/
- Microsoft Learn Q&A, *AI-102 retires on 30th June 2026* — https://learn.microsoft.com/en-au/answers/questions/5893448/ai-102-retires-on-30th-june-2026
- Pearson VUE, *Claude Certification Program by Anthropic* — https://www.pearsonvue.com/us/en/anthropic.html
- n8n, *Learn to build with n8n — courses, certificates and badges* — https://n8n.io/education/
- [DIGCOMP] JRC, *The European Commission updates its digital competence framework DigComp* (27/11/2025) — https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/european-commission-updates-its-digital-competence-framework-digcomp-2025-11-27_en
- Offres d'emploi consultées (WTTJ) : Stockly — No Code / AI Automation Engineer ; Edflex — AI Agent Orchestration Specialist ; Leadtech — AI Automation Engineer ; Wivoo (Wavestone) — Product Builder ; Akkodis (The Adecco Group) — Architecte IA Générative ; ILLUIN Technology — Solution Architect IA ; Square Management — Consultant·e management de projets IA ; data-major — Consultant IA/GenAI ; Lemon Learning — AI Automation & GEO ; ainsi que résumés publics d'annonces Pennylane, Margo, AI Sisters, lemlist, Emeria, BNP Paribas, Future, NTT Data, WeFiiT, Thiga, La Banque Postale, Crédit Agricole.
