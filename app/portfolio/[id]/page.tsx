import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCase, getPortfolio, portfolio } from "@/lib/content";
import { competence } from "@/lib/referentiel";
import { Markdown } from "@/components/markdown";
import { N8nWorkflow } from "@/components/n8n-workflow";
import { Badge, Card } from "@/components/ui";

export function generateStaticParams() {
  return portfolio.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getPortfolio(id)?.titre ?? "Portfolio" };
}

const TYPE_LABEL = { pdf: "PDF", md: "Page", n8n: "Workflow n8n", lien: "Lien", json: "JSON" } as const;

export default async function PortfolioEntry({ params }: PageProps<"/portfolio/[id]">) {
  const { id } = await params;
  const p = getPortfolio(id);
  if (!p) notFound();
  const pack = getCase(p.cas);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-accent font-medium">{pack?.entreprise.nom ?? "Mission"}</p>
        <h1 className="font-serif text-3xl font-semibold mt-1">{p.titre}</h1>
        {p.resume && <p className="text-muted mt-2">{p.resume}</p>}
        {pack && (
          <p className="text-sm text-muted mt-2">
            {pack.meta.secteur} · {pack.entreprise.effectif} salariés · {pack.meta.localisation} — entreprise fictive
          </p>
        )}
      </header>

      {p.competences && p.competences.length > 0 && (
        <Card>
          <h2 className="font-semibold mb-3">Compétences démontrées</h2>
          <div className="flex flex-wrap gap-2">
            {p.competences.map((c) => (
              <Badge key={c.id} tone={c.statut === "valide" ? "ok" : "warn"}>
                {c.id} {competence(c.id)?.titre} · {c.niveau}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {p.livrables && p.livrables.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-semibold mb-3">Livrables</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {p.livrables.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-line bg-surface p-4 hover:border-accent">
                <div className="flex items-center gap-2">
                  <Badge tone="accent">{TYPE_LABEL[l.type]}</Badge>
                  <span className="font-medium">{l.titre}</span>
                </div>
                {l.description && <p className="text-sm text-muted mt-2">{l.description}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {p.workflows && p.workflows.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold">Blueprint des workflows</h2>
          {p.workflows.map((w) => (
            <N8nWorkflow key={w.url} url={w.url} titre={w.titre} />
          ))}
        </section>
      )}

      <article>
        <Markdown>{p.body}</Markdown>
      </article>
    </div>
  );
}
