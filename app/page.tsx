import Link from "next/link";
import { cases, portfolio, syllabus } from "@/lib/content";
import { BLOCS, POSTES } from "@/lib/referentiel";
import { Badge } from "@/components/ui";

export default function Home() {
  const valides = portfolio.flatMap((p) => p.competences ?? []).filter((c) => c.statut === "valide");
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-accent font-medium">Laboratoire de compétences</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mt-3">
          Prouver, cas après cas, ce qu&apos;un consultant IA sait vraiment faire.
        </h1>
        <p className="mt-5 text-lg text-muted leading-relaxed">
          Des entreprises fictives, des données volontairement imparfaites, des API simulées et un testeur qui vérifie les automatisations
          sans complaisance. Chaque cas terminé devient une preuve publique : audit, pitch, blueprint des workflows et résultats des tests.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/portfolio" className="rounded-lg bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium hover:opacity-90">
            Voir le portfolio
          </Link>
          <Link href="/syllabus" className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium hover:bg-surface-2">
            Lire le syllabus
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="text-3xl font-serif font-semibold">{BLOCS.length} blocs</div>
          <p className="text-sm text-muted mt-2">27 compétences décrites en savoirs, savoir-faire et technologies, sur 4 niveaux.</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="text-3xl font-serif font-semibold">{cases.length} cas</div>
          <p className="text-sm text-muted mt-2">Mises en situation construites à partir des compétences à valider, jamais à partir d&apos;un outil.</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="text-3xl font-serif font-semibold">{valides.length} validées</div>
          <p className="text-sm text-muted mt-2">Une compétence est validée quand elle est démontrée sur deux cas différents, preuve à l&apos;appui.</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold">Postes visés</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {POSTES.map((p) => (
            <Badge key={p.id} tone="accent">
              {p.titre}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold">Syllabus</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {syllabus.map((c) => (
            <li key={c.slug}>
              <Link href={`/syllabus/${c.slug}`} className="block rounded-xl border border-line bg-surface p-4 hover:border-accent">
                <div className="font-medium">{c.titre}</div>
                <div className="text-sm text-muted mt-1">{c.resume}</div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
