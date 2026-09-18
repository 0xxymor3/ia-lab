# IA Lab — laboratoire de compétences d'un consultant formateur IA

Application Next.js qui sert à la fois :

- de **syllabus public** (référentiel en 7 blocs, grilles d'évaluation, glossaire, parcours) ;
- de **hub d'immersion** dans des entreprises fictives (demande client, fiche entreprise, organigramme, logiciels, données, documents internes) ;
- d'**API sandbox** qui simule le système d'information de chaque entreprise (CRM, inbox, outbox, documents), avec un **mode chaos** (429, 503, latence) ;
- de **testeur d'acceptation** qui injecte des scénarios (doublons, injections de prompt, données sensibles…) et note les automatisations compétence par compétence ;
- de **portfolio public** qui publie les preuves (audit, pitch, blueprint des workflows, résultats des tests).

> Toutes les entreprises, personnes et données sont fictives.

## Démarrer en local

```bash
pnpm install
pnpm dev          # compile content/ puis lance http://localhost:3000
```

En local, sans variables d'environnement : mot de passe de l'espace candidat `lab`, stockage en mémoire (non persistant).

| Variable | Rôle |
|---|---|
| `LAB_PASSWORD` | Mot de passe de l'espace candidat (`/lab`, `/admin`) — obligatoire en production |
| `SANDBOX_SECRET` | Secret de signature (sessions, clés d'API du sandbox, signatures de webhooks) — obligatoire en production |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (ajouté via la Marketplace Vercel) ; sinon stockage en mémoire |

## Scripts

| Commande | Effet |
|---|---|
| `pnpm content` | Valide les packs de cas et compile `content/` dans `generated/content.json` |
| `pnpm case:import pack.json [partie2.json …]` | Importe un pack généré par le projet Claude dans `content/cases/<id>/` |
| `pnpm livrables` | Régénère `../livrables/SYLLABUS_complet.md` et `../livrables/CASE_PACK_SCHEMA.md` |
| `pnpm test` | Tests unitaires (générateur, moteur d'assertions, sandbox) |
| `pnpm lint`, `pnpm build` | Qualité et build de production |

## Contenu

```
content/
  syllabus/*.md                     chapitres du syllabus (frontmatter : titre, ordre, resume)
  cases/<id>/case.yaml|case.json    pack de cas (schéma : lib/schema/case-pack.ts)
  cases/<id>/documents/*.md         documents internes de l'entreprise (base du RAG)
  cases/<id>/_evaluateur/           campagnes du testeur et questions de jury (spoilers)
  portfolio/<id>/index.md           page de portfolio d'un cas (livrables dans public/portfolio/<id>/)
```

## Automatiser un cas avec n8n (local)

```bash
cp tools/n8n/.env.example tools/n8n/.env   # puis définissez N8N_ENCRYPTION_KEY
docker compose -f tools/n8n/docker-compose.yml up -d
```

Dans n8n : créez un credential *Header Auth* (`X-API-Key` = clé affichée dans l'onglet **Doc API** du cas), un déclencheur *Schedule* (1 min) qui appelle `GET /inbox?statut=nouveau`, traitez chaque message, puis `POST /inbox/{id}/ack`. Le testeur fonctionne en mode **pull** : aucun tunnel n'est nécessaire.

## Stack

Next.js 16 (App Router, `proxy.ts`), TypeScript, Tailwind CSS 4, Zod 4, Upstash Redis, Faker (données déterministes), ExcelJS, react-markdown + Mermaid, Vitest.
