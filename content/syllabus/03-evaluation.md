---
titre: "3 — Évaluation : méthodes, conditions et grilles"
ordre: 3
resume: "Modalités d'évaluation, conditions de passage, règles de validation, grilles critériées N1-N4 pour les 27 compétences, format des preuves."
---

# 3 — Modalités d'évaluation

## 3.1 Méthodes

| Méthode | Ce qu'elle évalue | Outil | Compétences typiques |
|---|---|---|---|
| **Mise en situation professionnelle (cas pratique)** | Capacité à produire les livrables d'une mission réelle, dans une entreprise fictive, avec ses données et ses contraintes | Hub d'immersion du laboratoire (fiche entreprise, organigramme, données, logiciels, brief) | Toutes |
| **Tests d'acceptation automatisés** | Fonctionnement réel des automatisations : cas nominaux, cas limites, pannes, attaques | Testeur du laboratoire (API simulées, inbox, outbox, campagnes, vérification) | C2.x, C3.x, C4.2, C5.3 |
| **Évaluation RAG instrumentée** | Exactitude, citation des sources, refus hors corpus | Campagne RAG du testeur | C3.2, C3.4 |
| **Dossier de preuves (portfolio)** | Qualité, clarté et justification des livrables | Rapport d'audit, pitch deck, blueprint, exports de workflows, dépôts Git | B1, B5, B6, B7 |
| **Soutenance devant jury simulé** | Compréhension, justification des choix, capacité à expliquer (expert et dirigeant), réaction aux objections | Mode `/jury` du projet Claude | Toutes, dont les savoirs du glossaire |
| **Revue de code / de workflow** | Lisibilité, robustesse, sécurité, maintenabilité | Mode `/evaluer` du projet Claude + relecture humaine si possible | C2.3, C2.4, C4.x, C5.3 |

## 3.2 Conditions d'évaluation

1. **Travail individuel**, dans un temps indicatif fixé par le cas (le dépassement est noté, il n'est pas éliminatoire, sauf mention contraire).
2. **IA autorisée avec traçabilité** : chaque cas est accompagné d'un *journal d'usage de l'IA* (modèle ci-dessous). Un livrable dont le candidat ne sait pas expliquer une partie en soutenance est évalué comme non démontré pour la compétence concernée.
3. **Ressources autorisées** : documentation publique, forums, documentation des outils. Interdit : consulter les fichiers d'évaluation du cas (`_evaluateur/`), demander la solution au mode `/indice` au-delà du niveau d'indice déclaré.
4. **Environnement** : le candidat utilise ses propres outils (n8n local, clés d'API personnelles). Les secrets ne figurent jamais dans les livrables.
5. **Données** : exclusivement les données fictives du cas. Aucune donnée réelle de client.
6. **Traçabilité des preuves** : chaque preuve est datée, rattachée à un cas et à des identifiants de compétences, et stockée (portfolio, dépôt Git, export du testeur).

### Modèle de journal d'usage de l'IA

| Date | Tâche | Outil / modèle | Ce que l'IA a produit | Ce que j'ai vérifié / corrigé | Ce que j'ai appris |
|---|---|---|---|---|---|
| … | Rédaction du prompt d'extraction | Claude | Premier jet du prompt | Ajout de la catégorie « à vérifier », test sur 10 messages | Importance des exemples négatifs |

## 3.3 Statuts et règles de validation

| Statut | Condition |
|---|---|
| **Auto-déclaré** | Figure sur le CV ou déclaré par le candidat, sans preuve. Ne compte pas. |
| **En cours (Nx)** | Niveau Nx démontré **une fois** (preuve + justification). |
| **Validé (Nx)** | Niveau Nx démontré sur **deux cas différents** (contexte, secteur ou données différents), avec preuves et justification orale satisfaisante. |
| **À consolider** | Validé il y a plus de 12 mois sans nouvelle preuve, ou technologie ayant fortement évolué. |

Règles complémentaires :
- Un niveau supérieur ne peut être validé que si le niveau inférieur l'est (ou est démontré dans le même cas).
- **Seuil d'un palier de cas** : un palier est réussi si ≥ 70 % des critères pondérés sont atteints **et** aucun critère *bloquant* n'est échoué (critères bloquants : envoi d'email au client sans validation humaine quand elle est exigée, fuite de données sensibles, action irréversible déclenchée par une injection de prompt, secret exposé dans un livrable).
- **Tests automatisés** : score par compétence = somme des poids des assertions réussies / somme des poids des assertions de la compétence. Seuils indicatifs : ≥ 90 % → N3 démontré si le cas est de niveau N3 ; 70-89 % → N2 démontré ; < 70 % → non démontré.
- **Soutenance** : chaque question du jury est notée 0 (absent / faux), 1 (partiel), 2 (complet et justifié). Une compétence est confirmée à l'oral si la moyenne de ses questions est ≥ 1,5.

## 3.4 Grilles critériées

> N1 est évalué principalement par le jury (définitions du glossaire). Les colonnes N2 à N4 décrivent des **indicateurs observables** ; chaque niveau inclut les indicateurs des niveaux inférieurs.

### B1 — Diagnostic, cadrage & valeur

| Compétence | N2 — Application guidée | N3 — Autonomie | N4 — Expertise | Preuves attendues |
|---|---|---|---|---|
| **C1.1** Diagnostiquer | Cartographie AS-IS d'un processus fourni, avec acteurs et outils | Cartographie issue de l'analyse des sources (brief, organigramme, données) ; volumes et temps **quantifiés à partir des données** ; causes distinguées des symptômes | Diagnostic multi-processus, identification des interdépendances et des causes organisationnelles ; hypothèses à vérifier listées avec méthode de vérification | Cartographie + tableau de mesures + liste d'hypothèses |
| **C1.2** Qualifier les cas d'usage | Liste de cas d'usage pertinents | Chaque cas qualifié (données, technique, risque, dépendances) ; au moins un « faux bon cas » explicitement écarté avec justification | Portefeuille équilibré (gains rapides / structurants), articulé avec la stratégie de l'entreprise et ses contraintes réglementaires | Fiches ou matrice de qualification |
| **C1.3** Prioriser et chiffrer | Matrice valeur/effort qualitative | Business case chiffré (gains, coûts d'exploitation dont tokens, temps de retour) avec hypothèses explicites et fourchettes | Analyse de sensibilité ; coûts cachés (supervision humaine, maintenance, changement) ; comparaison d'options | Tableur de business case |
| **C1.4** Formaliser le cadrage | Note de cadrage avec objectifs et périmètre | Critères de succès mesurables, KPI, risques, exigences testables (user stories + critères d'acceptation), plan en lots | Gestion explicite des contradictions entre parties prenantes ; arbitrages proposés au décideur | Note de cadrage |

### B2 — Automatisation & orchestration

| Compétence | N2 | N3 | N4 | Preuves attendues |
|---|---|---|---|---|
| **C2.1** Concevoir un workflow | Workflow linéaire fonctionnel sur le cas nominal | **Blueprint** documenté avant construction (déclencheur, étapes, données, branches, erreurs, validation humaine) ; découpage en sous-workflows | Architecture de workflows réutilisable (modèles, conventions de nommage), choix d'outil argumenté (n8n / Make / code) | Blueprint + export JSON |
| **C2.2** Intégrer des API | Appels GET/POST authentifiés à une API documentée | Pagination, filtres, gestion des formats (dates, encodages), mapping propre, lecture des codes de retour ; contournement d'un logiciel sans API | Intégrations multiples cohérentes, signature des webhooks vérifiée, gestion d'OAuth 2.0, contrat d'interface documenté | Tests du testeur + export |
| **C2.3** Fiabiliser | Branche d'erreur sur l'étape principale | **Idempotence** (un même message reçu deux fois = un seul enregistrement), retry avec backoff sur 429/503, messages en échec isolés et rejouables ; cas limites testés | Stratégie de fiabilité globale (files, états, reprise sur incident), tests de charge simples, garanties documentées | Score du testeur (scénarios doublons, pannes) |
| **C2.4** Exploiter et maintenir | Workflow exporté et sauvegardé | Documentation d'exploitation (runbook), secrets hors du workflow, journalisation exploitable, alerte en cas d'échec | Environnements dev/prod, versioning Git des workflows, procédure de mise à jour et de reprise, transfert de compétences au client | README / runbook + dépôt |

### B3 — Intégration LLM, RAG & agents

| Compétence | N2 | N3 | N4 | Preuves attendues |
|---|---|---|---|---|
| **C3.1** Prompts et sorties structurées | Prompt fonctionnel sur des exemples simples | Sortie JSON **validée par schéma**, catégorie d'incertitude, exemples négatifs, résistance aux entrées hors-sujet (spam, autre langue) ; prompt versionné | Prompts optimisés et mesurés (jeu d'évaluation), stratégie de repli (modèle, règle déterministe) | Prompt + résultats de tests |
| **C3.2** RAG | RAG fonctionnel sur un petit corpus | Découpage justifié, **sources citées**, refus correct hors corpus, mise à jour de l'index ; score ≥ 80 % sur la campagne RAG | Recherche hybride / reranking, gestion des droits d'accès, diagnostic des échecs par type (récupération vs génération) | Campagne RAG + note technique |
| **C3.3** Agents et outils | Agent avec un outil dans un tutoriel | Outils aux contrats clairs, limites d'itérations, **validation humaine avant action irréversible**, journal des décisions ; justification agent vs workflow | Système multi-agents ou MCP maîtrisé, garde-fous testés contre l'injection indirecte, coûts bornés | Démo + traces |
| **C3.4** Évaluer et optimiser | Tests manuels sur quelques exemples | Jeu d'évaluation construit **avant** optimisation, métriques suivies, comparaison chiffrée de 2 options (prompt ou modèle), coût/latence mesurés | Évaluation continue (régression), LLM-as-judge calibré contre annotations humaines, arbitrage qualité/coût documenté | Tableau d'évaluation |

### B4 — Développement & données

| Compétence | N2 | N3 | N4 | Preuves attendues |
|---|---|---|---|---|
| **C4.1** Programmer | Modifie un script existant | Écrit un **nœud Code** ou un script qui transforme des données et appelle une API avec gestion d'erreurs ; code lisible, nommé, commenté si nécessaire | Code modulaire et testé, réutilisable, revue critique du code généré par IA | Code source |
| **C4.2** Données | Nettoyage manuel dans un tableur | Profilage de la qualité ; normalisation et dédoublonnage **par règles explicites** et traçables ; SQL de base | Modélisation de données, stratégie de migration sans perte, contrôles qualité automatisés | Rapport qualité + score du testeur |
| **C4.3** Service / prototype | Prototype généré par un outil, non maîtrisé | Prototype utilisable par un utilisateur cible, déployé, dont le candidat explique l'architecture | Produit maintenable (auth, erreurs, accessibilité de base), itéré sur retours utilisateurs | URL + démo |
| **C4.4** Industrialiser | Projet sur GitHub | Historique Git propre, README d'installation, variables d'environnement, déploiement reproductible | CI avec tests, conteneurisation, stratégie de déploiement et de retour arrière | Dépôt |

### B5 — Architecture, sécurité & exploitation

| Compétence | N2 | N3 | N4 | Preuves attendues |
|---|---|---|---|---|
| **C5.1** Architecture cible | Schéma des composants | Schéma + flux de données + dossier de choix (options, critères, décision) dimensionné pour le client ; intégration au SI existant ; réversibilité | Architecture évolutive multi-cas d'usage, analyse des points de défaillance, feuille de route technique | Dossier d'architecture |
| **C5.2** Modèles et hébergement | Choix d'un modèle justifié par la notoriété | Comparaison pondérée de 2-3 options (qualité mesurée, coût, conformité UE, latence, réversibilité), modèle de repli | Stratégie multi-modèles, hébergement souverain ou local évalué avec chiffres | Tableau comparatif |
| **C5.3** Sécuriser | Connaît l'injection de prompt | Entrées non fiables identifiées ; **résiste aux injections du testeur** ; données sensibles masquées/exclues ; moindre privilège ; secrets protégés | Modèle de menaces documenté (OWASP LLM Top 10), tests d'attaque, plan de réponse à incident | Score du testeur (scénarios d'attaque) + fiche menaces |
| **C5.4** Observer et piloter | Consulte les exécutions | Tableau de bord KPI techniques et métier, seuils d'alerte, suivi des coûts | Revue qualité périodique, détection de dérive, SLA et plan de continuité | Capture / maquette de tableau de bord |

### B6 — Conformité, éthique & gouvernance

| Compétence | N2 | N3 | N4 | Preuves attendues |
|---|---|---|---|---|
| **C6.1** RGPD | Identifie les données personnelles | Cartographie des données du flux, base légale justifiée, minimisation effective, vérification du fournisseur (DPA, localisation, entraînement), fiche de registre ; sait quand une AIPD est requise | AIPD rédigée, arbitrages juridiques/techniques argumentés | Fiche registre + analyse |
| **C6.2** AI Act | Connaît les niveaux de risque | Qualification correcte (rôle + risque) des cas d'usage, obligations applicables identifiées **avec le calendrier post-Omnibus**, mentions de transparence rédigées | Conseil sur des cas limites (annexe III), plan de conformité | Note de qualification |
| **C6.3** Gouvernance | Liste des risques | Charte d'usage applicable par des non-spécialistes, outils autorisés, registre des usages, réponse au shadow AI | Système de gouvernance (rôles, revues, indicateurs), inspiré d'ISO/IEC 42001 | Charte + registre |

### B7 — Produit, adoption & transmission

| Compétence | N2 | N3 | N4 | Preuves attendues |
|---|---|---|---|---|
| **C7.1** Produit / MVP | Liste de fonctionnalités | MVP défini par les besoins utilisateurs (personas, parcours), interface de validation humaine pensée, métriques d'usage | Stratégie produit itérative mesurée, arbitrages de périmètre | Maquettes / MVP |
| **C7.2** Convaincre et restituer | Présentation descriptive | Pitch deck de 8-12 slides orienté décision (problème, impact chiffré, solution, preuve/démo, coûts, risques, demande) ; réponses solides aux objections | Restitution adaptée à plusieurs publics (dirigeant, équipes, financeur), gestion d'un auditoire hostile | Deck + soutenance |
| **C7.3** Changement | Identifie les personnes concernées | Cartographie des parties prenantes (influence/attitude), plan d'accompagnement concret, traitement des résistances identifiées dans le cas | Stratégie d'adoption mesurée, réseau d'ambassadeurs, ajustements selon indicateurs | Plan d'accompagnement |
| **C7.4** Former et documenter | Support de formation descriptif | Module avec objectifs évaluables, progression, activités, évaluation des acquis ; documentation utilisateur claire ; lien avec la littératie IA (art. 4) | Dispositif de formation multi-publics, évaluation d'impact à froid | Programme + supports |

## 3.5 Format des preuves du portfolio

Chaque cas terminé donne lieu à un dossier public (sans données sensibles ni secrets) :

1. **Rapport d'audit / de cadrage** (PDF ou page) — B1, B6.
2. **Pitch deck** (8-12 slides) — C7.2.
3. **Blueprint des workflows** (schéma + exports JSON n8n) — B2.
4. **Dossier technique** (architecture, choix de modèles, sécurité, évaluation) — B3, B5.
5. **Résultats du testeur** (export JSON, score par compétence) — B2, B3, B5.
6. **Journal d'usage de l'IA** et **retour réflexif** (ce qui a marché, ce que je referais autrement).
7. **Compétences démontrées** : liste d'identifiants avec niveau et statut (*en cours* / *validé*).
