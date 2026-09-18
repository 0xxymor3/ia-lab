import type { CasePack } from "@/lib/schema/case-pack";

// Spécification OpenAPI 3.1 générée à partir du pack (importable dans n8n, Postman, Bruno).
export function openApiSpec(pack: CasePack, baseUrl: string) {
  const paths: Record<string, unknown> = {};
  const err = { $ref: "#/components/responses/Erreur" };
  const listParams = [
    { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
    { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 200, default: 50 } },
    { name: "sort", in: "query", schema: { type: "string" }, description: "Champ de tri ; préfixe - pour décroissant" },
    { name: "q", in: "query", schema: { type: "string" }, description: "Recherche plein texte (contient)" },
    { name: "updated_since", in: "query", schema: { type: "string", format: "date-time" } },
  ];

  for (const r of pack.api.ressources) {
    const item: Record<string, unknown> = {};
    const coll: Record<string, unknown> = {};
    const props: Record<string, unknown> = {};
    for (const [champ, valeurs] of Object.entries(r.enums ?? {})) props[champ] = { type: "string", enum: valeurs };
    const schema = { type: "object", properties: props, required: r.champs_requis ?? [], additionalProperties: true };
    if (r.operations.includes("list"))
      coll.get = {
        summary: `Lister ${r.nom}`,
        description: `${r.description}\n\nTout autre paramètre de requête filtre par égalité sur le champ du même nom.`,
        parameters: listParams,
        responses: { "200": { description: "Liste paginée" }, "401": err, "429": err },
      };
    if (r.operations.includes("create"))
      coll.post = {
        summary: `Créer dans ${r.nom}`,
        requestBody: { required: true, content: { "application/json": { schema } } },
        responses: { "201": { description: "Créé" }, "409": err, "422": err },
      };
    if (r.operations.includes("get")) item.get = { summary: `Lire un élément de ${r.nom}`, responses: { "200": { description: "OK" }, "404": err } };
    if (r.operations.includes("update"))
      item.patch = {
        summary: `Modifier un élément de ${r.nom}`,
        requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
        responses: { "200": { description: "OK" }, "404": err, "422": err },
      };
    if (r.operations.includes("delete")) item.delete = { summary: `Supprimer un élément de ${r.nom}`, responses: { "204": { description: "Supprimé" } } };
    if (Object.keys(coll).length) paths[`/${r.nom}`] = coll;
    if (Object.keys(item).length)
      paths[`/${r.nom}/{id}`] = { parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], ...item };
  }

  if (pack.api.inbox.active) {
    paths["/inbox"] = {
      get: {
        summary: "Lister les messages entrants",
        description: pack.api.inbox.description,
        parameters: [
          { name: "statut", in: "query", schema: { type: "string", enum: ["nouveau", "traite"] } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
        ],
        responses: { "200": { description: "Messages" } },
      },
    };
    paths["/inbox/{id}"] = { get: { summary: "Lire un message", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } } };
    paths["/inbox/{id}/ack"] = {
      post: {
        summary: "Acquitter un message (marquer comme traité)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { resultat: {} } } } } },
        responses: { "200": { description: "OK" } },
      },
    };
  }
  if (pack.api.outbox.active) {
    paths["/outbox"] = {
      get: { summary: "Lister les emails sortants", responses: { "200": { description: "OK" } } },
      post: {
        summary: "Déposer un email sortant",
        description: pack.api.outbox.description,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["to", "subject", "body"],
                properties: {
                  to: { type: "string" },
                  subject: { type: "string" },
                  body: { type: "string" },
                  statut: { type: "string", enum: ["brouillon", "a_valider", "envoye"], default: "brouillon" },
                  source_message_id: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Déposé" } },
      },
    };
    paths["/outbox/{id}"] = {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { summary: "Lire un email sortant", responses: { "200": { description: "OK" } } },
      patch: { summary: "Modifier un email sortant (ex. validation)", responses: { "200": { description: "OK" } } },
    };
  }
  if (pack.api.documents_exposes) {
    paths["/documents"] = { get: { summary: "Lister les documents internes", responses: { "200": { description: "OK" } } } };
    paths["/documents/{id}"] = {
      get: { summary: "Lire un document (Markdown)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } },
    };
  }
  if (pack.evaluation.campagnes.some((c) => c.mode === "rag")) {
    paths["/rag/questions"] = {
      get: {
        summary: "Questions de la dernière campagne RAG lancée",
        parameters: [{ name: "run", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "OK" } },
      },
    };
    paths["/rag/answers"] = {
      post: {
        summary: "Soumettre les réponses du RAG",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["run_id", "reponses"],
                properties: {
                  run_id: { type: "string" },
                  reponses: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["question_id", "reponse"],
                      properties: { question_id: { type: "string" }, reponse: { type: "string" }, sources: { type: "array", items: { type: "string" } } },
                    },
                  },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Reçu" } },
      },
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: `API sandbox — ${pack.entreprise.nom}`,
      version: pack.meta.version,
      description: `API simulée du cas « ${pack.meta.titre} ». Données fictives. Authentification : en-tête X-API-Key.`,
    },
    servers: [{ url: `${baseUrl}/api/sandbox/${pack.meta.id}` }],
    security: [{ ApiKey: [] }],
    components: {
      securitySchemes: { ApiKey: { type: "apiKey", in: "header", name: "X-API-Key" } },
      responses: {
        Erreur: {
          description: "Erreur",
          content: {
            "application/json": {
              schema: { type: "object", properties: { error: { type: "object", properties: { code: { type: "string" }, message: { type: "string" }, details: {} } } } },
            },
          },
        },
      },
    },
    paths,
  };
}
