import type { CasePack } from "@/lib/schema/case-pack";
import { Sandbox } from "@/lib/sandbox/state";
import { Badge, Card, Notice, SectionTitle } from "@/components/ui";

const statusTone = (s: number) => (s < 300 ? "ok" : s < 500 ? "warn" : "danger") as "ok" | "warn" | "danger";
const time = (iso: string) => new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" });

export async function JournalSection({ pack }: { pack: CasePack }) {
  const sb = new Sandbox(pack);
  const [logs, outbox, inbox, hookNames] = await Promise.all([sb.logs(150), sb.outbox(), sb.inbox(), sb.hookNames()]);
  const hooks = await Promise.all(hookNames.map(async (n) => ({ name: n, entries: await sb.hooks(n) })));
  const nouveaux = inbox.filter((m) => m.statut === "nouveau").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-xs text-muted">Inbox</div>
          <div className="text-2xl font-semibold mt-1">
            {nouveaux} <span className="text-sm text-muted font-normal">à traiter / {inbox.length}</span>
          </div>
        </Card>
        <Card>
          <div className="text-xs text-muted">Outbox</div>
          <div className="text-2xl font-semibold mt-1">
            {outbox.length} <span className="text-sm text-muted font-normal">brouillons / messages</span>
          </div>
        </Card>
        <Card>
          <div className="text-xs text-muted">Appels API récents</div>
          <div className="text-2xl font-semibold mt-1">{logs.length}</div>
        </Card>
      </div>

      <Card>
        <SectionTitle sub="150 derniers appels à l'API sandbox (rechargez la page pour actualiser).">Journal des appels</SectionTitle>
        {logs.length === 0 ? (
          <Notice>Aucun appel pour l&apos;instant.</Notice>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted text-left">
                <tr>
                  <th className="py-1 pr-3 font-medium">Horodatage</th>
                  <th className="py-1 pr-3 font-medium">Méthode</th>
                  <th className="py-1 pr-3 font-medium">Chemin</th>
                  <th className="py-1 pr-3 font-medium">Statut</th>
                  <th className="py-1 pr-3 font-medium">ms</th>
                  <th className="py-1 font-medium">Corps (extrait)</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    <td className="py-1 pr-3 whitespace-nowrap">{time(l.ts)}</td>
                    <td className="py-1 pr-3 font-mono">{l.method}</td>
                    <td className="py-1 pr-3 font-mono break-all">{l.path}</td>
                    <td className="py-1 pr-3">
                      <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                    </td>
                    <td className="py-1 pr-3">{l.ms}</td>
                    <td className="py-1 font-mono text-muted break-all max-w-md">{l.apercu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle sub="Ce que l'ADV verrait dans sa file de validation.">Outbox</SectionTitle>
        {outbox.length === 0 ? (
          <Notice>Aucun brouillon.</Notice>
        ) : (
          <ul className="space-y-3">
            {outbox
              .slice()
              .reverse()
              .map((m) => (
                <li key={m.id} className="rounded-lg border border-line p-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge tone={m.statut === "envoye" ? "danger" : "accent"}>{m.statut}</Badge>
                    <span className="font-mono">{m.id}</span>
                    <span className="text-muted">à {m.to}</span>
                    <span className="text-muted">{time(m.created_at)}</span>
                  </div>
                  <div className="font-medium text-sm mt-1">{m.subject}</div>
                  <pre className="mt-1 text-xs whitespace-pre-wrap text-muted max-h-40 overflow-y-auto">{m.body}</pre>
                </li>
              ))}
          </ul>
        )}
      </Card>

      {hooks.length > 0 && (
        <Card>
          <SectionTitle>Webhooks capturés</SectionTitle>
          {hooks.map((h) => (
            <details key={h.name} className="mb-3">
              <summary className="cursor-pointer text-sm font-mono">
                {h.name} ({h.entries.length})
              </summary>
              <pre className="mt-2 text-xs bg-surface-2 rounded p-3 overflow-x-auto max-h-80">{JSON.stringify(h.entries.slice(0, 20), null, 2)}</pre>
            </details>
          ))}
        </Card>
      )}
    </div>
  );
}
