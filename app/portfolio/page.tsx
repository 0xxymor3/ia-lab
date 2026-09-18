import Link from "next/link";
import type { Metadata } from "next";
import { portfolio } from "@/lib/content";
import { BLOCS, COMPETENCES, NIVEAUX } from "@/lib/referentiel";
import { Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Portfolio" };

const STATUT = { a_venir: { label: "À venir", tone: "neutral" }, en_cours: { label: "En cours", tone: "warn" }, termine: { label: "Terminé", tone: "ok" } } as const;

export default function Portfolio() {
  // Meilleur niveau démontré par compétence, avec le nombre de cas qui le prouvent.
  const preuves = new Map<string, { niveau: string; cas: Set<string>; valide: boolean }>();
  for (const p of portfolio)
    for (const c of p.competences ?? []) {
      const cur = preuves.get(c.id);
      const better = !cur || NIVEAUX.indexOf(c.niveau) > NIVEAUX.indexOf(cur.niveau as (typeof NIVEAUX)[number]);
      const entry = better ? { niveau: c.niveau, cas: new Set<string>(), valide: false } : cur!;
      entry.cas.add(p.id);
      entry.valide ||= c.statut === "valide";
      preuves.set(c.id, entry);
    }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Portfolio</h1>
      <p className="text-muted mt-2 max-w-3xl">
        Chaque mission est une mise en situation dans une entreprise fictive. Les livrables publiés ici (audit, pitch, blueprint, résultats de tests)
        sont les preuves des compétences démontrées. Une compétence est <strong>validée</strong> après deux démonstrations sur des cas différents.
      </p>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {portfolio.length === 0 && <p className="text-sm text-muted">Premières missions en cours.</p>}
        {portfolio.map((p) => (
          <Link key={p.id} href={`/portfolio/${p.id}`} className="block rounded-xl border border-line bg-surface p-5 hover:border-accent">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUT[p.statut].tone}>{STATUT[p.statut].label}</Badge>
              {p.date && <span className="text-xs text-muted">{p.date}</span>}
            </div>
            <h2 className="font-serif text-xl font-semibold mt-2">{p.titre}</h2>
            {p.resume && <p className="text-sm text-muted mt-1">{p.resume}</p>}
          </Link>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-semibold">Compétences démontrées</h2>
        <p className="text-sm text-muted mt-1">Seules les compétences appuyées par une preuve publiée apparaissent.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {BLOCS.map((b) => (
            <div key={b.id} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">
                <span className="font-mono text-accent text-sm mr-2">{b.id}</span>
                {b.titre}
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {COMPETENCES.filter((c) => c.bloc === b.id).map((c) => {
                  const pr = preuves.get(c.id);
                  return (
                    <li key={c.id} className="flex items-center justify-between gap-3">
                      <span className={pr ? "" : "text-muted"}>
                        <span className="font-mono text-xs mr-2">{c.id}</span>
                        {c.titre}
                      </span>
                      {pr ? (
                        <Badge tone={pr.valide ? "ok" : "warn"}>
                          {pr.niveau} · {pr.valide ? "validé" : `en cours (${pr.cas.size} cas)`}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
