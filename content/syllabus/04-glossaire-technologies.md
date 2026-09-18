---
titre: "4 — Glossaire à savoir expliquer & technologies"
ordre: 4
resume: "Une centaine de notions avec définition, version « dirigeant » et piège fréquent ; langages et technologies attendus par poste."
---

# 4 — Glossaire et technologies

> Pour chaque notion : **définition** (version experte), *Dirigeant :* comment l'expliquer à un chef d'entreprise en une phrase, ⚠️ piège fréquent. Entre crochets : niveau minimal attendu et compétences liées. Le mode `/jury` du projet Claude interroge sur ces notions.

## 4.1 Fondamentaux des LLM

- **Intelligence artificielle générative** [N1 · C3.1] — Modèles qui produisent du contenu (texte, image, audio, code) à partir d'instructions. *Dirigeant :* un outil qui rédige, résume et classe à partir de consignes, comme un assistant très rapide mais faillible. ⚠️ Confondre génération plausible et vérité.
- **LLM (Large Language Model)** [N1 · C3.1] — Réseau de neurones entraîné à prédire le jeton suivant sur de très grands corpus, puis ajusté pour suivre des instructions. *Dirigeant :* un moteur statistique du langage, pas une base de données. ⚠️ Croire qu'il « sait » ou « consulte » quelque chose sans outil.
- **Token (jeton)** [N1 · C1.3, C3.4] — Unité de découpage du texte (≈ ¾ de mot en anglais, un peu moins en français) ; base de la facturation et des limites. *Dirigeant :* le compteur qui détermine le coût et la quantité de texte traitable. ⚠️ Estimer les coûts en mots ou en pages sans marge.
- **Fenêtre de contexte** [N1 · C3.1, C3.2] — Quantité maximale de jetons (entrée + sortie) traitée en une requête. *Dirigeant :* la taille de la « table de travail » du modèle. ⚠️ Penser qu'une grande fenêtre dispense d'un RAG (coût, latence, dilution de l'attention).
- **Prompt / prompt système** [N1 · C3.1] — Instructions données au modèle ; le prompt système fixe le rôle, les règles et le format pour toute la conversation. *Dirigeant :* la fiche de poste et les consignes de l'assistant. ⚠️ Mélanger instructions et données non fiables dans le même bloc.
- **Température** [N1 · C3.1] — Paramètre qui règle le caractère aléatoire de la génération. *Dirigeant :* le curseur entre régularité et créativité. ⚠️ Laisser une température élevée pour de l'extraction de données.
- **Hallucination** [N1 · C3.1, C3.2] — Production d'une information fausse présentée comme vraie. *Dirigeant :* l'assistant peut inventer avec aplomb ; on conçoit le système pour le détecter ou l'empêcher. ⚠️ Croire qu'un meilleur prompt suffit à l'éliminer.
- **Few-shot** [N2 · C3.1] — Exemples entrée/sortie inclus dans le prompt pour guider le modèle. ⚠️ Des exemples trop similaires qui biaisent les sorties.
- **Chain-of-thought / raisonnement étendu** [N2 · C3.1] — Faire expliciter des étapes de raisonnement (ou activer le mode de réflexion du modèle) pour améliorer les tâches complexes. ⚠️ Coût et latence accrus ; inutile pour de l'extraction simple.
- **Sortie structurée** [N2 · C3.1] — Contraindre la réponse à un format (JSON conforme à un schéma), via instructions, mode JSON ou appel d'outil. *Dirigeant :* le modèle remplit un formulaire au lieu d'écrire un texte libre, donc on peut automatiser la suite. ⚠️ Ne pas valider la sortie avant de l'utiliser.
- **JSON Schema** [N2 · C3.1, C2.2] — Langage de description de la forme d'un objet JSON (champs, types, valeurs autorisées). ⚠️ Oublier les valeurs `null` et les énumérations.
- **Modèle de fondation / modèle à poids ouverts** [N2 · C5.2] — Modèle généraliste pré-entraîné ; « à poids ouverts » quand ses paramètres sont téléchargeables et exécutables localement. *Dirigeant :* louer un service (API) ou faire tourner son propre moteur. ⚠️ Confondre « poids ouverts » et « open source » au sens strict.
- **Fine-tuning** [N2 · C3.2] — Ré-entraînement partiel d'un modèle sur des exemples spécifiques pour modifier son comportement. *Dirigeant :* on change la façon de répondre, pas les connaissances à jour. ⚠️ L'utiliser pour « apprendre les documents de l'entreprise » (c'est le rôle du RAG).
- **Multimodal** [N1 · C3.1] — Modèle qui traite plusieurs types d'entrées (texte, image, audio, PDF). ⚠️ Supposer une extraction parfaite de tableaux scannés.
- **Latence** [N2 · C3.4, C5.4] — Temps de réponse d'un appel. ⚠️ Ignorer la latence cumulée d'une chaîne d'agents.
- **Prompt caching** [N3 · C3.4] — Mise en cache d'une partie fixe du prompt pour réduire coût et latence des appels répétés. ⚠️ Placer les parties variables avant les parties fixes.
- **Batch** [N3 · C3.4] — Traitement différé de lots de requêtes à coût réduit. ⚠️ L'utiliser pour des traitements qui exigent une réponse immédiate.

## 4.2 RAG et connaissance

- **RAG (Retrieval-Augmented Generation)** [N1→N3 · C3.2] — Récupérer les passages pertinents d'une base documentaire et les fournir au modèle pour qu'il réponde en s'y appuyant. *Dirigeant :* l'assistant va chercher dans vos documents avant de répondre, et cite ses sources. ⚠️ Négliger la qualité des documents et du découpage.
- **Embedding (plongement vectoriel)** [N2 · C3.2] — Représentation d'un texte par un vecteur numérique dont la proximité reflète la proximité de sens. *Dirigeant :* une empreinte du sens qui permet de retrouver des textes proches même avec d'autres mots. ⚠️ Changer de modèle d'embedding sans réindexer.
- **Base vectorielle** [N2 · C3.2] — Stockage optimisé pour rechercher les vecteurs les plus proches. ⚠️ Croire qu'il en faut une dédiée pour 500 documents (pgvector suffit souvent).
- **Chunking (découpage)** [N2 · C3.2] — Découpe des documents en passages indexables (taille, chevauchement, respect de la structure). ⚠️ Couper au milieu d'un tableau ou d'une procédure.
- **Recherche hybride** [N3 · C3.2] — Combinaison de recherche lexicale (mots-clés, BM25) et vectorielle. ⚠️ S'en passer pour les références produits, codes et numéros.
- **Reranking** [N3 · C3.2] — Réordonner les passages récupérés avec un modèle plus précis. ⚠️ Ajouter de la latence sans mesurer le gain.
- **Métadonnées / filtrage** [N2 · C3.2] — Informations associées aux passages (source, date, produit, droits) utilisées pour filtrer. ⚠️ Oublier les droits d'accès : tout le monde voit tout.
- **Citation des sources / ancrage (grounding)** [N2 · C3.2] — Réponse reliée aux passages qui la justifient. *Dirigeant :* on peut vérifier d'où vient chaque réponse. ⚠️ Citer une source qui ne contient pas l'information.
- **Refus hors corpus** [N3 · C3.2, C5.3] — Capacité à répondre « je ne sais pas » quand l'information n'est pas dans les documents. ⚠️ Ne jamais le tester.

## 4.3 Agents et outils

- **Agent** [N2 · C3.3] — Système où un LLM choisit des actions (appels d'outils) en boucle pour atteindre un objectif. *Dirigeant :* un assistant qui ne se contente pas de répondre mais agit dans vos outils, sous contrôle. ⚠️ Utiliser un agent là où un workflow fixe suffit (moins fiable, plus cher).
- **Tool use / function calling** [N2 · C3.3] — Le modèle produit un appel structuré à une fonction définie (nom + paramètres), exécutée par le système. ⚠️ Des outils aux descriptions floues ou trop puissants.
- **MCP (Model Context Protocol)** [N2 · C3.3] — Protocole ouvert standardisant la connexion des applications d'IA à des outils et sources de données via des serveurs MCP. *Dirigeant :* une prise universelle pour brancher l'IA sur vos logiciels. ⚠️ Installer un serveur MCP tiers sans vérifier ses permissions.
- **Workflow vs agent** [N3 · C2.1, C3.3] — Workflow : chemin défini à l'avance ; agent : chemin décidé dynamiquement par le modèle. ⚠️ Présenter un workflow comme « agent » par effet de mode.
- **Routeur / orchestrateur-exécutants / évaluateur-optimiseur** [N3 · C3.3] — Patrons d'agents : aiguiller selon la demande ; découper et déléguer ; générer puis critiquer. ⚠️ Empiler les patrons sans besoin.
- **Mémoire (courte / longue)** [N2 · C3.3] — Historique de la conversation ; informations persistées entre sessions. ⚠️ Stocker des données personnelles en mémoire sans durée de conservation.
- **Human-in-the-loop (HITL)** [N2 · C2.1, C3.3] — Étape de validation humaine avant une action. *Dirigeant :* l'IA prépare, un collaborateur valide. ⚠️ Une validation « tampon » que personne ne lit (prévoir une interface efficace).
- **Garde-fous (guardrails)** [N3 · C3.3, C5.3] — Contrôles en entrée et en sortie (validation, filtres, listes blanches, limites). ⚠️ Compter sur le prompt seul comme garde-fou.

## 4.4 Évaluation et exploitation

- **Jeu d'évaluation (golden set)** [N2 · C3.4] — Ensemble d'entrées avec résultats attendus, représentatif des cas réels et des cas limites. ⚠️ Le construire après avoir optimisé (biais de confirmation).
- **Précision / rappel** [N2 · C3.4] — Précision : part des éléments détectés qui sont corrects ; rappel : part des éléments corrects qui ont été détectés. ⚠️ Rapporter une « exactitude » globale sur des classes déséquilibrées.
- **LLM-as-a-judge** [N3 · C3.4] — Utiliser un modèle pour noter des sorties. ⚠️ Ne pas le calibrer contre des jugements humains.
- **Test de régression** [N3 · C3.4, C4.4] — Rejouer les tests après chaque modification pour vérifier qu'on n'a rien cassé. ⚠️ Modifier un prompt en production sans rejouer.
- **Observabilité / traces** [N2 · C5.4] — Capacité à reconstituer ce qui s'est passé (entrées, sorties, étapes, durées, coûts). ⚠️ Journaliser des données personnelles en clair.
- **Dérive (drift)** [N3 · C5.4] — Dégradation progressive de la qualité (données qui changent, modèle mis à jour). ⚠️ Pas de revue périodique.
- **KPI** [N1 · C1.4, C5.4] — Indicateur clé de performance. ⚠️ Des KPI techniques sans KPI métier (temps gagné, délai de réponse).
- **SLA** [N2 · C5.4] — Engagement de niveau de service (disponibilité, délais). ⚠️ Promettre un SLA supérieur à celui des fournisseurs sous-jacents.

## 4.5 Automatisation et intégration

- **Workflow / scénario** [N1 · C2.1] — Suite d'étapes automatisées déclenchée par un événement. ⚠️ Un workflow géant impossible à maintenir.
- **n8n** [N2 · C2.x] — Plateforme d'automatisation *fair-code*, auto-hébergeable, avec nœuds d'IA et de code. *Dirigeant :* un chef d'orchestre qui connecte vos logiciels, hébergeable chez vous. ⚠️ L'auto-héberger sans sauvegardes ni mises à jour.
- **Make / Zapier** [N2 · C2.x] — Plateformes d'automatisation en SaaS, facturées à l'opération. ⚠️ Ignorer le coût à la volumétrie.
- **Déclencheur (trigger)** [N1 · C2.1] — Événement qui lance un workflow (webhook, planification, nouvel email…). ⚠️ Un *polling* trop fréquent qui épuise les quotas.
- **Webhook** [N2 · C2.2] — Appel HTTP envoyé automatiquement par un système quand un événement se produit. *Dirigeant :* une sonnette qui prévient instantanément l'autre logiciel. ⚠️ Ne pas vérifier l'authenticité (signature).
- **Polling** [N2 · C2.1] — Interroger régulièrement une source pour détecter du nouveau. ⚠️ Traiter deux fois le même élément faute de marquage.
- **API REST** [N2 · C2.2] — Interface d'échange entre logiciels via HTTP, organisée en ressources (GET, POST, PATCH, DELETE). *Dirigeant :* le guichet officiel par lequel deux logiciels se parlent. ⚠️ Automatiser via l'interface graphique quand une API existe.
- **Codes HTTP** [N2 · C2.2, C2.3] — 2xx succès, 4xx erreur du client (401 non authentifié, 404 introuvable, 422 invalide, 429 trop de requêtes), 5xx erreur serveur (503 indisponible). ⚠️ Réessayer une erreur 4xx à l'identique.
- **Authentification : clé d'API, OAuth 2.0** [N2 · C2.2] — Clé : secret statique ; OAuth 2.0 : délégation d'accès par jetons à durée limitée, avec consentement. ⚠️ Mettre une clé d'API dans un workflow partagé ou une capture d'écran.
- **Pagination** [N2 · C2.2] — Découpage des résultats en pages (numéro, curseur). ⚠️ Ne traiter que la première page.
- **Idempotence** [N3 · C2.3] — Propriété d'une opération qui produit le même résultat qu'on l'exécute une ou plusieurs fois. *Dirigeant :* si le message arrive deux fois, le client n'est pas créé deux fois. ⚠️ Dédoublonner sur un champ non unique (le nom).
- **Retry / backoff exponentiel** [N3 · C2.3] — Réessayer après un délai croissant en cas d'erreur transitoire. ⚠️ Réessayer immédiatement en boucle (aggrave une limite de débit).
- **Rate limiting (limite de débit)** [N2 · C2.3] — Nombre maximal de requêtes autorisées par période ; au-delà, erreur 429 avec en-tête `Retry-After`. ⚠️ Ignorer l'en-tête.
- **File d'attente (queue)** [N3 · C2.3] — Stockage temporaire des tâches pour les traiter de manière asynchrone et fiable. ⚠️ Perdre des messages en cas d'erreur (pas d'accusé de réception).
- **Dead letter queue** [N3 · C2.3] — File des messages en échec, isolés pour analyse et reprise. ⚠️ Des erreurs silencieuses.
- **ETL / ELT** [N2 · C4.2] — Extraire, transformer, charger des données entre systèmes. ⚠️ Transformer sans garder la donnée source.
- **RPA** [N1 · C2.2] — Automatisation par simulation des actions d'un humain sur une interface. ⚠️ Solution fragile, à réserver aux logiciels sans API ni export.
- **iPaaS** [N1 · C2.1] — Plateforme d'intégration en tant que service (Make, Zapier, n8n Cloud…). ⚠️ Dépendance fournisseur non évaluée.

## 4.6 Développement et données

- **Python / JavaScript / TypeScript** [N2→N3 · C4.1] — Langages les plus demandés : Python pour la data et l'IA, JavaScript/TypeScript pour le web et les nœuds Code de n8n. ⚠️ Copier du code généré sans le lire.
- **JSON** [N2 · C4.1] — Format texte de données structurées (objets, tableaux). ⚠️ Confondre chaîne `"12"` et nombre `12`.
- **Expression régulière (regex)** [N2 · C4.1, C4.2] — Motif de recherche dans du texte (ex. détecter un IBAN). ⚠️ Des regex illisibles non testées.
- **SQL** [N2 · C4.2] — Langage d'interrogation des bases relationnelles (SELECT, JOIN, GROUP BY, INSERT, UPSERT). ⚠️ Des requêtes construites par concaténation (injection SQL).
- **Clé primaire / clé naturelle** [N2 · C4.2] — Identifiant technique unique / identifiant métier (email, SIRET). ⚠️ Dédoublonner sur un identifiant non fiable.
- **Normalisation** [N2 · C4.2] — Mise au format standard (téléphone E.164 `+33…`, email en minuscules, suppression des espaces). ⚠️ Normaliser en perdant l'information d'origine.
- **Dédoublonnage approximatif (fuzzy matching)** [N3 · C4.2] — Rapprocher des enregistrements proches mais non identiques (distance d'édition, règles). ⚠️ Fusionner automatiquement sans seuil ni validation.
- **Git / GitHub** [N2 · C4.4] — Gestion de versions et plateforme de collaboration. ⚠️ Committer un fichier `.env`.
- **Variables d'environnement / secrets** [N2 · C2.4, C4.4] — Paramètres sensibles fournis à l'exécution, jamais dans le code. ⚠️ Secrets dans les exports de workflows.
- **Docker** [N2 · C2.4, C4.4] — Conteneurs qui empaquettent une application et ses dépendances. *Dirigeant :* une boîte standard qui tourne partout de la même façon. ⚠️ Des volumes non sauvegardés (perte des données n8n).
- **CI/CD** [N3 · C4.4] — Intégration et déploiement continus : tests et mise en production automatisés à chaque modification. ⚠️ Un pipeline sans tests.
- **Serverless / PaaS / VPS** [N2 · C4.4, C5.1] — Exécution à la demande / plateforme gérée / serveur virtuel à administrer. ⚠️ Choisir un VPS sans compétence d'administration.
- **Vibe coding** [N1 · C4.3] — Développer en décrivant ce qu'on veut à une IA qui écrit le code. ⚠️ Déployer en production du code non compris (sécurité, maintenance).

## 4.7 Architecture et sécurité

- **Architecture cible** [N2 · C5.1] — Représentation des composants, flux et choix techniques visés. ⚠️ Sur-ingénierie pour une TPE.
- **Build vs buy** [N2 · C5.1] — Arbitrage entre développer et acheter une solution. ⚠️ Oublier le coût de maintenance du « build ».
- **ADR (Architecture Decision Record)** [N3 · C5.1] — Fiche courte : contexte, options, décision, conséquences. ⚠️ Des décisions non tracées.
- **Réversibilité / verrouillage fournisseur** [N3 · C5.1, C5.2] — Capacité à changer de fournisseur sans tout refaire. ⚠️ Logique métier enfouie dans un outil propriétaire.
- **Souveraineté / résidence des données** [N2 · C5.2, C6.1] — Localisation et juridiction applicable aux données et aux traitements. ⚠️ Confondre hébergement en UE et absence de loi extraterritoriale.
- **Injection de prompt** [N2→N3 · C5.3] — Instructions malveillantes insérées dans une entrée (directe) ou dans un contenu traité, comme un email ou un document (indirecte), pour détourner le modèle. *Dirigeant :* un client peut glisser dans un email une consigne cachée à votre assistant ; on conçoit le système pour qu'il n'obéisse qu'à vous. ⚠️ Donner à l'agent le pouvoir d'agir sur la base du contenu lu.
- **OWASP Top 10 LLM** [N2 · C5.3] — Référentiel des principaux risques des applications LLM (injection de prompt, divulgation d'informations sensibles, chaîne d'approvisionnement, empoisonnement, gestion non sécurisée des sorties, autonomie excessive, fuite du prompt système, faiblesses des vecteurs, désinformation, consommation non bornée). ⚠️ Le citer sans l'appliquer au cas.
- **Moindre privilège** [N2 · C5.3] — N'accorder que les droits strictement nécessaires. ⚠️ Un compte administrateur pour l'automatisation.
- **Données sensibles / masquage** [N2 · C5.3, C6.1] — Données à protéger particulièrement (IBAN, santé, données bancaires, identifiants) ; masquage ou exclusion avant traitement. ⚠️ Recopier un IBAN reçu par email dans le CRM ou l'envoyer au LLM sans nécessité.
- **Modèle de menaces** [N3 · C5.3] — Analyse structurée : actifs, attaquants, points d'entrée, scénarios, mesures. ⚠️ S'arrêter à une liste générique.
- **Shadow AI** [N1 · C6.3] — Usage d'outils d'IA non autorisés par les salariés, souvent avec des données de l'entreprise. *Dirigeant :* vos équipes utilisent déjà l'IA ; la question est de savoir avec quelles données. ⚠️ Répondre par une interdiction sans alternative.

## 4.8 Conformité et gouvernance

- **Donnée personnelle** [N1 · C6.1] — Toute information se rapportant à une personne physique identifiée ou identifiable. ⚠️ Croire qu'un email professionnel n'en est pas une.
- **Responsable de traitement / sous-traitant** [N2 · C6.1] — Celui qui détermine les finalités et moyens / celui qui traite pour son compte (contrat art. 28 RGPD). *Dirigeant :* vous restez responsable même si un prestataire fait le travail. ⚠️ Pas de contrat de sous-traitance avec le fournisseur d'IA.
- **Base légale** [N2 · C6.1] — Fondement juridique d'un traitement (contrat, obligation légale, intérêt légitime, consentement…). ⚠️ Demander le consentement par réflexe quand une autre base est adaptée.
- **Minimisation** [N2 · C6.1] — Ne traiter que les données nécessaires à la finalité. ⚠️ Envoyer tout l'historique client au LLM.
- **Registre des traitements** [N2 · C6.1] — Document recensant les traitements de données personnelles. ⚠️ Oublier d'y ajouter les nouveaux usages IA.
- **AIPD (analyse d'impact)** [N3 · C6.1] — Analyse obligatoire des traitements susceptibles d'engendrer un risque élevé pour les personnes. ⚠️ La confondre avec l'évaluation de conformité de l'AI Act.
- **Transfert hors UE** [N2 · C6.1, C5.2] — Communication de données vers un pays tiers, encadrée (décision d'adéquation, clauses types). ⚠️ Ignorer où sont traitées les requêtes d'une API.
- **AI Act (Règlement (UE) 2024/1689)** [N2 · C6.2] — Règlement européen sur l'IA fondé sur les risques ; modifié par le **Digital Omnibus (Règlement (UE) 2026/1744)**. ⚠️ Annoncer des obligations « haut risque » au 2 août 2026 (reportées au 2 décembre 2027 pour l'annexe III).
- **Fournisseur / déployeur** [N2 · C6.2] — Celui qui développe et met sur le marché un système d'IA / celui qui l'utilise sous son autorité. *Dirigeant :* en utilisant un outil d'IA, votre entreprise est « déployeur », avec des obligations plus légères. ⚠️ Un déployeur qui modifie substantiellement un système peut devenir fournisseur.
- **Système à haut risque** [N2 · C6.2] — Système des annexes I (produits réglementés) ou III (ex. recrutement, éducation, crédit, services essentiels). ⚠️ Automatiser un tri de CV sans voir qu'on entre en annexe III.
- **Obligation de transparence (art. 50)** [N2 · C6.2] — Informer les personnes qu'elles interagissent avec une IA ; marquer les contenus générés. ⚠️ Un chatbot client sans mention.
- **Littératie IA (art. 4)** [N1 · C6.2, C7.4] — Obligation de moyens pour fournisseurs et déployeurs de prendre des mesures pour soutenir les compétences IA de leur personnel. *Dirigeant :* former vos équipes à un usage éclairé est attendu, sans certificat imposé. ⚠️ La présenter comme une obligation de certifier chaque salarié.
- **GPAI (modèle d'IA à usage général)** [N2 · C6.2] — Modèle généraliste (type LLM) soumis à des obligations propres pour ses fournisseurs. ⚠️ Croire qu'une PME qui utilise l'API en devient fournisseur.
- **ISO/IEC 42001** [N2 · C6.3] — Norme de système de management de l'IA (politique, risques, rôles, amélioration continue). ⚠️ La viser pour une TPE sans besoin client.
- **Charte d'usage de l'IA** [N2 · C6.3] — Règles internes simples : outils autorisés, données interdites, validation humaine, transparence. ⚠️ Un texte juridique illisible pour les équipes.
- **Biais** [N2 · C6.3] — Écarts systématiques de traitement entre groupes, hérités des données ou de la conception. ⚠️ Ne pas tester sur des populations variées.

## 4.9 Produit, business et accompagnement

- **ROI / temps de retour** [N2 · C1.3] — Rapport entre gains et coûts ; durée pour récupérer l'investissement. ⚠️ Compter des « heures gagnées » qui ne sont pas réaffectées.
- **TCO (coût total de possession)** [N2 · C1.3] — Coût complet : licences, tokens, hébergement, maintenance, supervision, formation. ⚠️ Oublier la supervision humaine.
- **PoC / prototype / MVP** [N2 · C7.1] — Preuve de faisabilité technique / maquette démontrable / plus petit produit réellement utilisé qui apporte de la valeur. ⚠️ Appeler MVP un PoC que personne n'utilise.
- **Product discovery** [N2 · C7.1] — Démarche pour valider qu'un problème mérite d'être résolu et comment, avant de construire. ⚠️ Construire d'abord, chercher des utilisateurs ensuite.
- **Persona / parcours utilisateur** [N2 · C7.1] — Représentation d'un type d'utilisateur ; enchaînement de ses étapes et émotions. ⚠️ Des personas inventés sans entretien.
- **User story / critère d'acceptation** [N2 · C1.4] — « En tant que…, je veux…, afin de… » + conditions vérifiables de réussite. ⚠️ Des critères non testables (« rapide », « intuitif »).
- **Conduite du changement** [N2 · C7.3] — Démarche pour faire adopter une transformation (communication, implication, formation, accompagnement). ⚠️ La réduire à une formation outil.
- **Matrice parties prenantes (influence / attitude)** [N2 · C7.3] — Positionnement des acteurs pour adapter la stratégie (sponsor, allié, neutre, opposant). ⚠️ Ignorer les opposants silencieux.
- **Ingénierie pédagogique** [N2 · C7.4] — Conception d'une formation : analyse du besoin, objectifs, progression, modalités, évaluation. ⚠️ Des objectifs non évaluables (« comprendre l'IA »).
- **Taxonomie de Bloom** [N2 · C7.4] — Hiérarchie des objectifs d'apprentissage (se souvenir, comprendre, appliquer, analyser, évaluer, créer). ⚠️ Former au niveau « se souvenir » quand l'objectif est « appliquer ».
- **DigComp 3.0** [N1 · C7.4] — Cadre européen des compétences numériques (JRC, nov. 2025) intégrant l'IA dans toutes ses aires. ⚠️ L'utiliser pour des profils techniques (c'est un cadre citoyen).

## 4.10 Technologies et langages par poste

| Catégorie | Indispensable (tous postes) | AI Automation Engineer | AI Integrator | AI Product Builder | AI Architect |
|---|---|---|---|---|---|
| Automatisation | n8n **ou** Make | n8n avancé (sous-workflows, Error Workflow, nœuds Code, auto-hébergement) | n8n / Make + connecteurs du SI client | Make / n8n / Zapier | Connaître les limites des iPaaS |
| Langages | JSON, lecture de code | **JavaScript** (nœuds Code) + **Python** intermédiaire | **Python** | Lecture Python/JS ; TypeScript apprécié | **Python** ; TypeScript apprécié |
| API | REST, auth, webhooks | + pagination, signatures, OAuth 2.0, Postman/Bruno | + OAuth 2.0, contrats d'interface | Consommer des API | Concevoir des API (FastAPI, OpenAPI) |
| LLM | Une API de LLM (Anthropic / OpenAI / Mistral) | Sorties structurées, classification, extraction | + RAG, MCP, agents | Prototypage rapide multi-fournisseurs | Multi-modèles, open-weights, Bedrock / Azure / Vertex |
| Données | Tableur, SQL de base | SQL, Airtable / Postgres | SQL, plateformes data | Airtable / Supabase | Postgres + pgvector, Qdrant, entrepôts |
| Agents | Notions | Nœud AI Agent n8n | Claude Agent SDK / LangGraph, serveurs MCP | Agents no-code | Architectures multi-agents |
| Évaluation / observabilité | Tests manuels structurés | Tests de workflows, journaux | Langfuse, promptfoo | Métriques d'usage | Langfuse, OpenTelemetry, tableaux de bord |
| Dev & déploiement | Git / GitHub | Docker (n8n auto-hébergé) | Docker, CI | Vercel, Supabase, outils de génération (Lovable, v0, Claude Code) | Docker, Kubernetes (notions), Terraform (notions), cloud |
| Sécurité / conformité | RGPD de base | Secrets, HITL | OWASP LLM, DPA fournisseurs | Transparence art. 50 | Modèle de menaces, souveraineté, ISO 42001 (notions) |
