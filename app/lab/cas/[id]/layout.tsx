import { notFound } from "next/navigation";
import { getCase } from "@/lib/content";
import { CaseTabs } from "@/components/case/tabs";

export default async function CaseLayout({ children, params }: LayoutProps<"/lab/cas/[id]">) {
  const { id } = await params;
  const pack = getCase(id);
  if (!pack) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-medium">{pack.entreprise.nom}</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">{pack.meta.titre}</h1>
          <p className="text-sm text-muted mt-1">
            {pack.meta.secteur} · {pack.meta.localisation} · {pack.entreprise.effectif} salariés
          </p>
        </div>
      </div>
      <CaseTabs id={id} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
