import Link from "next/link";
import type { Metadata } from "next";
import { cases } from "@/lib/content";
import { getStore } from "@/lib/store";
import { competence } from "@/lib/referentiel";
import { Badge, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Laboratoire" };
export const dynamic = "force-dynamic";

export default function LabHome() {
  const persistent = getStore().persistent;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Laboratoire</h1>
      <p className="text-muted mt-2">Choisissez un cas pour entrer dans l&apos;entreprise : brief, organigramme, logiciels, données, API et testeur.</p>
      {!persistent && (
        <div className="mt-6">
          <Notice tone="warn">
            Stockage en mémoire (non persistant) : connectez Upstash Redis (variables KV_REST_API_URL / KV_REST_API_TOKEN) pour conserver
            l&apos;état du sandbox et les résultats du testeur entre deux requêtes.
          </Notice>
        </div>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {cases.map((c) => (
          <Link key={c.meta.id} href={`/lab/cas/${c.meta.id}/brief`} className="block rounded-xl border border-line bg-surface p-6 hover:border-accent">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">{c.meta.type}</Badge>
              <Badge>{c.meta.niveau_vise}</Badge>
              <Badge>{c.meta.duree_estimee_jours} j</Badge>
            </div>
            <h2 className="font-serif text-xl font-semibold mt-3">{c.meta.titre}</h2>
            {c.meta.sous_titre && <p className="text-sm text-muted mt-1">{c.meta.sous_titre}</p>}
            <p className="text-sm mt-3">{c.meta.resume}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.meta.competences_cibles.map((cc) => (
                <span key={cc.id} title={competence(cc.id)?.titre} className="text-[11px] rounded bg-surface-2 px-1.5 py-0.5 text-muted">
                  {cc.id}·{cc.niveau}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-sm text-muted">
        Nouveau cas généré par le projet Claude ?{" "}
        <Link href="/admin/valider" className="text-accent underline">
          Valider un pack JSON
        </Link>{" "}
        puis importez-le avec <code className="text-xs bg-surface-2 px-1 rounded">pnpm case:import pack.json</code>.
      </div>
    </div>
  );
}
