import type { CasePack } from "@/lib/schema/case-pack";
import { sandboxApiKey } from "@/lib/auth";
import { CopyButton } from "@/components/copy-button";
import { Badge, Card, Notice, SectionTitle } from "@/components/ui";

const METHOD: Record<string, string> = { list: "GET", get: "GET", create: "POST", update: "PATCH", delete: "DELETE" };

function Endpoint({ method, path, children }: { method: string; path: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 py-1.5 border-b border-line last:border-0">
      <span className="font-mono text-[11px] font-semibold w-14 text-accent">{method}</span>
      <code className="text-sm">{path}</code>
      {children && <span className="text-xs text-muted">— {children}</span>}
    </div>
  );
}

export function ApiDocSection({ pack, origin }: { pack: CasePack; origin: string }) {
  const base = `${origin}/api/sandbox/${pack.meta.id}`;
  const key = sandboxApiKey(pack.meta.id);
  const firstRes = pack.api.ressources[0]?.nom ?? "contacts";
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle sub="À utiliser dans n8n (nœud HTTP Request, en-tête X-API-Key), Postman ou Bruno.">Accès</SectionTitle>
        <dl className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <dt className="text-muted w-32">URL de base</dt>
            <dd className="flex items-center gap-2 min-w-0">
              <code className="truncate">{base}</code>
              <CopyButton value={base} />
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <dt className="text-muted w-32">Clé d&apos;API</dt>
            <dd className="flex items-center gap-2 min-w-0">
              <code className="truncate">{key}</code>
              <CopyButton value={key} />
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <dt className="text-muted w-32">OpenAPI 3.1</dt>
            <dd className="flex items-center gap-2 min-w-0">
              <a className="text-accent underline truncate" href={`${base}/openapi.json`}>
                {base}/openapi.json
              </a>
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <Notice tone="warn">
            Traitez cette clé comme un secret : stockez-la dans les <em>credentials</em> de n8n (Header Auth), jamais en clair dans un workflow exporté.
          </Notice>
        </div>
      </Card>

      <Card>
        <SectionTitle>Ressources métier</SectionTitle>
        <div className="space-y-6">
          {pack.api.ressources.map((r) => (
            <div key={r.nom}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold font-mono">/{r.nom}</h3>
                {r.table && <Badge>initialisée depuis « {r.table} »</Badge>}
              </div>
              <p className="text-sm text-muted mt-1">{r.description}</p>
              <div className="mt-2">
                {r.operations.map((op) => (
                  <Endpoint key={op} method={METHOD[op]} path={op === "list" || op === "create" ? `/${r.nom}` : `/${r.nom}/{id}`}>
                    {op === "list" && "page, limit (≤ 200), sort (-champ), q, updated_since, filtres champ=valeur"}
                    {op === "create" && (r.champs_requis?.length ? `champs requis : ${r.champs_requis.join(", ")}` : "corps JSON")}
                    {op === "update" && "mise à jour partielle"}
                  </Endpoint>
                ))}
              </div>
              {r.enums && (
                <div className="mt-2 text-xs space-y-1">
                  {Object.entries(r.enums).map(([champ, vals]) => (
                    <div key={champ}>
                      <span className="font-mono">{champ}</span> ∈ {vals.map((v) => <code key={v} className="mx-0.5">{v}</code>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {pack.api.inbox.active && (
          <Card>
            <SectionTitle>Inbox (messages entrants)</SectionTitle>
            <p className="text-sm text-muted mb-2">{pack.api.inbox.description}</p>
            <Endpoint method="GET" path="/inbox?statut=nouveau">messages à traiter</Endpoint>
            <Endpoint method="GET" path="/inbox/{id}" />
            <Endpoint method="POST" path="/inbox/{id}/ack">marquer comme traité (corps optionnel : {"{ resultat }"})</Endpoint>
            <p className="text-xs text-muted mt-3">
              Champs : <code>id</code> (identifiant de file), <code>message_id</code> (identifiant du message, identique si livré deux fois),{" "}
              <code>canal</code>, <code>de</code>, <code>nom</code>, <code>objet</code>, <code>corps</code>, <code>pieces_jointes</code>,{" "}
              <code>recu_le</code>, <code>statut</code>.
            </p>
          </Card>
        )}
        {pack.api.outbox.active && (
          <Card>
            <SectionTitle>Outbox (réponses)</SectionTitle>
            <p className="text-sm text-muted mb-2">{pack.api.outbox.description}</p>
            <Endpoint method="POST" path="/outbox">{"{ to, subject, body, statut, source_message_id }"}</Endpoint>
            <Endpoint method="GET" path="/outbox" />
            <Endpoint method="PATCH" path="/outbox/{id}" />
          </Card>
        )}
        {pack.api.documents_exposes && (
          <Card>
            <SectionTitle>Documents internes</SectionTitle>
            <Endpoint method="GET" path="/documents">liste (sans contenu)</Endpoint>
            <Endpoint method="GET" path="/documents/{id}">contenu Markdown</Endpoint>
          </Card>
        )}
        {pack.evaluation.campagnes.some((c) => c.mode === "rag") && (
          <Card>
            <SectionTitle>Évaluation RAG</SectionTitle>
            <Endpoint method="GET" path="/rag/questions">questions de la dernière campagne RAG lancée</Endpoint>
            <Endpoint method="POST" path="/rag/answers">{"{ run_id, reponses: [{ question_id, reponse, sources: [doc_id] }] }"}</Endpoint>
          </Card>
        )}
      </div>

      <Card>
        <SectionTitle>Conventions et exemples</SectionTitle>
        <ul className="list-disc pl-5 text-sm space-y-1.5">
          <li>
            Erreurs au format <code>{"{ error: { code, message, details } }"}</code> : 400 JSON invalide, 401 clé absente, 404, 405, 409 conflit
            d&apos;identifiant, 422 validation, 429 limite de débit (en-tête <code>Retry-After</code>), 503 indisponibilité simulée.
          </li>
          <li>
            Chaque enregistrement créé depuis un message entrant porte le <code>source_message_id</code> du message : c&apos;est ce que vérifie le
            testeur.
          </li>
          <li>
            Webhooks sortants simulés (Slack, SMS…) : <code>POST {origin}/api/hooks/{pack.meta.id}/{"{nom}"}</code> — visibles dans l&apos;onglet
            Journal.
          </li>
        </ul>
        <pre className="mt-4 text-xs bg-surface-2 rounded-lg p-3 overflow-x-auto">
{`curl -s "${base}/${firstRes}?limit=5" \\
  -H "X-API-Key: ${key}"

curl -s -X POST "${base}/inbox/MSG-XXXX/ack" \\
  -H "X-API-Key: ${key}"`}
        </pre>
      </Card>
    </div>
  );
}
