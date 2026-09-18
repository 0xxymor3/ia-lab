import Link from "next/link";
import type { CasePack, Personne } from "@/lib/schema/case-pack";
import { datasetFor } from "@/lib/data/generator";
import { competence } from "@/lib/referentiel";
import { Markdown } from "@/components/markdown";
import { AttitudeBadge, Badge, Card, Notice, SectionTitle } from "@/components/ui";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// ─── Demande client ────────────────────────────────────────────────────────
export function BriefSection({ pack }: { pack: CasePack }) {
  const { email, compte_rendu_md, contraintes } = pack.brief;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6 min-w-0">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-line bg-surface-2 px-5 py-3 text-sm space-y-1">
            <div>
              <span className="text-muted w-14 inline-block">De</span> {email.de}
            </div>
            <div>
              <span className="text-muted w-14 inline-block">À</span> {email.a}
            </div>
            <div>
              <span className="text-muted w-14 inline-block">Date</span> {fmtDate(email.date)}
            </div>
            <div className="font-semibold pt-1">{email.objet}</div>
          </div>
          <div className="p-5">
            <Markdown>{email.corps_md}</Markdown>
          </div>
        </Card>
        <Card>
          <SectionTitle>Compte rendu du premier rendez-vous</SectionTitle>
          <Markdown>{compte_rendu_md}</Markdown>
        </Card>
      </div>
      <aside className="space-y-4">
        <Card>
          <h3 className="font-semibold">Contraintes</h3>
          <dl className="mt-3 space-y-3 text-sm">
            {contraintes.budget && (
              <div>
                <dt className="text-muted">Budget</dt>
                <dd>{contraintes.budget}</dd>
              </div>
            )}
            {contraintes.delai && (
              <div>
                <dt className="text-muted">Délai</dt>
                <dd>{contraintes.delai}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Techniques</dt>
              <dd>
                <ul className="list-disc pl-4 space-y-1">
                  {contraintes.techniques.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Réglementaires</dt>
              <dd>
                <ul className="list-disc pl-4 space-y-1">
                  {contraintes.reglementaires.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h3 className="font-semibold">Compétences évaluées</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {pack.meta.competences_cibles.map((c) => (
              <li key={c.id} className="flex gap-2">
                <span className="font-mono text-xs text-accent w-10 shrink-0 pt-0.5">{c.id}</span>
                <span>
                  {competence(c.id)?.titre} <span className="text-muted">({c.niveau})</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}

// ─── Fiche entreprise ──────────────────────────────────────────────────────
export function EntrepriseSection({ pack }: { pack: CasePack }) {
  const e = pack.entreprise;
  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <div className="text-muted">Raison sociale</div>
            <div className="font-medium">{e.nom}</div>
            <div className="text-muted">{e.forme_juridique}</div>
          </div>
          <div>
            <div className="text-muted">Création</div>
            <div className="font-medium">{e.creation}</div>
          </div>
          <div>
            <div className="text-muted">Effectif</div>
            <div className="font-medium">{e.effectif} salariés</div>
          </div>
          <div>
            <div className="text-muted">Chiffre d&apos;affaires</div>
            <div className="font-medium">{e.chiffre_affaires}</div>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="text-muted">Adresse</div>
            <div>{e.adresse}</div>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {e.chiffres_cles.map((k) => (
          <div key={k.label} className="rounded-xl border border-line bg-surface p-4">
            <div className="text-xs text-muted">{k.label}</div>
            <div className="mt-1 font-semibold">{k.valeur}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle>Activité</SectionTitle>
          <Markdown>{e.activite_md}</Markdown>
        </Card>
        <Card>
          <SectionTitle>Histoire</SectionTitle>
          <Markdown>{e.histoire_md}</Markdown>
        </Card>
        <Card>
          <SectionTitle>Clients et marché</SectionTitle>
          <Markdown>{e.clients_md}</Markdown>
        </Card>
        <Card>
          <SectionTitle>Enjeux</SectionTitle>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            {e.enjeux.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {e.culture_md && (
            <>
              <h3 className="font-semibold mt-5 mb-2">Culture</h3>
              <Markdown>{e.culture_md}</Markdown>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── Organigramme ──────────────────────────────────────────────────────────
function PersonCard({ p }: { p: Personne }) {
  return (
    <details className="group rounded-xl border border-line bg-surface p-3 w-64 text-left open:shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="font-semibold text-sm">{p.nom}</div>
        <div className="text-xs text-muted">{p.poste}</div>
        <div className="mt-2 flex flex-wrap gap-1">
          <AttitudeBadge attitude={p.attitude_ia} />
        </div>
      </summary>
      <div className="mt-3 space-y-2 text-xs border-t border-line pt-3">
        {p.anciennete && <div className="text-muted">Ancienneté : {p.anciennete}</div>}
        <Markdown className="text-xs">{p.profil_md}</Markdown>
        {p.citation && <blockquote className="italic border-l-2 border-accent pl-2">« {p.citation} »</blockquote>}
        {p.enjeux.length > 0 && (
          <div>
            <div className="font-medium">Enjeux</div>
            <ul className="list-disc pl-4">
              {p.enjeux.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
        {p.irritants.length > 0 && (
          <div>
            <div className="font-medium">Irritants</div>
            <ul className="list-disc pl-4">
              {p.irritants.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
        {p.email && <div className="text-muted">{p.email}</div>}
      </div>
    </details>
  );
}

function Branch({ id, byManager, all }: { id: string; byManager: Map<string | null, Personne[]>; all: Personne[] }) {
  const p = all.find((x) => x.id === id)!;
  const children = byManager.get(id) ?? [];
  return (
    <li className="relative">
      <PersonCard p={p} />
      {children.length > 0 && (
        <ul className="mt-3 ml-6 pl-5 border-l border-line space-y-3">
          {children.map((c) => (
            <Branch key={c.id} id={c.id} byManager={byManager} all={all} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function OrganigrammeSection({ pack }: { pack: CasePack }) {
  const all = pack.organigramme.personnes;
  const byManager = new Map<string | null, Personne[]>();
  for (const p of all) byManager.set(p.manager_id, [...(byManager.get(p.manager_id) ?? []), p]);
  const roots = byManager.get(null) ?? [];
  const services = [...new Set(all.map((p) => p.service))];
  return (
    <div className="space-y-6">
      <Notice>Cliquez sur une personne pour lire son profil, ses enjeux, ses irritants et ce qu&apos;elle a dit en entretien.</Notice>
      <div className="flex flex-wrap gap-2 text-xs">
        {services.map((s) => (
          <Badge key={s}>
            {s} · {all.filter((p) => p.service === s).length}
          </Badge>
        ))}
      </div>
      <div className="overflow-x-auto pb-4">
        <ul className="space-y-3 min-w-max">
          {roots.map((r) => (
            <Branch key={r.id} id={r.id} byManager={byManager} all={all} />
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Logiciels ─────────────────────────────────────────────────────────────
const ACCES_LABEL = {
  api_sandbox: { label: "API disponible (sandbox)", tone: "ok" as const },
  export_fichier: { label: "Export fichier uniquement", tone: "warn" as const },
  email: { label: "Via la messagerie", tone: "accent" as const },
  aucun: { label: "Aucun accès technique", tone: "danger" as const },
};

export function LogicielsSection({ pack }: { pack: CasePack }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {pack.stack.logiciels.map((l) => (
        <Card key={l.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{l.nom}</h3>
              <div className="text-xs text-muted">{l.categorie}</div>
            </div>
            <Badge tone={ACCES_LABEL[l.acces.type].tone}>{ACCES_LABEL[l.acces.type].label}</Badge>
          </div>
          <div className="mt-3">
            <Markdown className="text-sm">{l.usage_md}</Markdown>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-muted">Utilisateurs</dt>
              <dd>{l.utilisateurs.join(", ")}</dd>
            </div>
            {l.cout_annuel && (
              <div>
                <dt className="text-muted">Coût annuel</dt>
                <dd>{l.cout_annuel}</dd>
              </div>
            )}
            <div className="col-span-2">
              <dt className="text-muted">Données</dt>
              <dd>{l.donnees.join(" · ")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">Irritants</dt>
              <dd>
                <ul className="list-disc pl-4">
                  {l.irritants.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          {(l.acces.ressources?.length || l.acces.note) && (
            <div className="mt-4 rounded-lg bg-surface-2 p-3 text-xs space-y-1">
              {l.acces.ressources?.length ? (
                <div>
                  Accès :{" "}
                  {l.acces.type === "api_sandbox" ? (
                    <Link href={`/lab/cas/${pack.meta.id}/api`} className="text-accent underline">
                      {l.acces.ressources.map((r) => `/${r}`).join(", ")}
                    </Link>
                  ) : (
                    <Link href={`/lab/cas/${pack.meta.id}/donnees`} className="text-accent underline">
                      {l.acces.ressources.join(", ")}
                    </Link>
                  )}
                </div>
              ) : null}
              {l.acces.note && <div className="text-muted">{l.acces.note}</div>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── Données ───────────────────────────────────────────────────────────────
function cell(v: unknown) {
  if (v === null || v === undefined) return <span className="text-muted/60">∅</span>;
  if (typeof v === "boolean") return v ? "oui" : "non";
  return String(v);
}

export function DonneesSection({ pack }: { pack: CasePack }) {
  const ds = datasetFor(pack);
  const exposed = new Map(pack.api.ressources.filter((r) => r.table).map((r) => [r.table!, r.nom]));
  return (
    <div className="space-y-8">
      <Notice>
        Exports tels que fournis par l&apos;entreprise (état initial). Les tables marquées « API » sont aussi accessibles et modifiables via
        l&apos;API sandbox. <a className="underline" href={`/lab/cas/${pack.meta.id}/export/tout.xlsx`}>Télécharger tout (XLSX)</a>
      </Notice>
      {pack.donnees.tables.map((t) => {
        const rows = ds[t.nom] ?? [];
        const cols = rows.length ? Object.keys(rows[0]) : t.champs.filter((c) => !c.masque).map((c) => c.nom);
        return (
          <section key={t.nom}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-semibold font-mono text-sm">{t.nom}</h3>
                <p className="text-sm text-muted">
                  {t.description} — <em>{t.source}</em>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge>{rows.length} lignes</Badge>
                {exposed.has(t.nom) && <Badge tone="ok">API : /{exposed.get(t.nom)}</Badge>}
                <a className="rounded-md border border-line px-2 py-1 text-xs hover:bg-surface-2" href={`/lab/cas/${pack.meta.id}/export/${t.nom}.csv`}>
                  CSV
                </a>
                <a className="rounded-md border border-line px-2 py-1 text-xs hover:bg-surface-2" href={`/lab/cas/${pack.meta.id}/export/${t.nom}.xlsx`}>
                  XLSX
                </a>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto rounded-lg border border-line max-h-96">
              <table className="text-xs w-full">
                <thead className="bg-surface-2 sticky top-0">
                  <tr>
                    {cols.map((c) => (
                      <th key={c} className="px-2 py-1.5 text-left font-medium whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 25).map((r, i) => (
                    <tr key={i} className="border-t border-line">
                      {cols.map((c) => (
                        <td key={c} className="px-2 py-1 whitespace-nowrap max-w-xs truncate">
                          {cell(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 25 && <p className="text-xs text-muted mt-1">Aperçu des 25 premières lignes — téléchargez l&apos;export complet.</p>}
          </section>
        );
      })}
    </div>
  );
}

// ─── Documents ─────────────────────────────────────────────────────────────
const DOC_TYPE: Record<string, string> = {
  procedure: "Procédure",
  notice: "Notice",
  politique: "Politique",
  compte_rendu: "Compte rendu",
  fiche_produit: "Fiche produit",
  email: "Email",
  contrat: "Contrat",
  autre: "Autre",
};

export function DocumentsSection({ pack, docId }: { pack: CasePack; docId?: string }) {
  const doc = pack.documents.find((d) => d.id === docId) ?? pack.documents[0];
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <ul className="space-y-1 text-sm">
        {pack.documents.map((d) => (
          <li key={d.id}>
            <Link
              href={`/lab/cas/${pack.meta.id}/documents?doc=${d.id}`}
              className={`block rounded-lg px-3 py-2 ${d.id === doc?.id ? "bg-accent-soft text-accent" : "hover:bg-surface-2"}`}
            >
              <div className="font-medium leading-snug">{d.titre}</div>
              <div className="text-xs text-muted mt-0.5">
                {DOC_TYPE[d.type]} {d.date ? `· ${d.date}` : ""} · <span className="font-mono">{d.id}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {doc && (
        <Card className="min-w-0">
          <div className="text-xs text-muted mb-4">
            {DOC_TYPE[doc.type]} · {doc.auteur ?? "—"} · {doc.date ?? "—"} · identifiant <code>{doc.id}</code>
          </div>
          <Markdown>{doc.contenu_md}</Markdown>
        </Card>
      )}
    </div>
  );
}

// ─── Missions ──────────────────────────────────────────────────────────────
export function MissionsSection({ pack }: { pack: CasePack }) {
  return (
    <div className="space-y-6">
      <Notice>
        Les paliers sont progressifs. Le niveau atteint par bloc correspond au palier le plus élevé réussi (≥ 70 % des critères, aucun critère
        bloquant échoué). Utilisez le projet Claude (<code>/evaluer</code>, <code>/jury</code>) pour l&apos;évaluation des livrables.
      </Notice>
      {pack.paliers.map((p) => {
        const campagnes = pack.evaluation.campagnes.filter((c) => c.palier === p.id);
        return (
          <Card key={p.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono text-accent">{p.id}</div>
                <h3 className="font-serif text-xl font-semibold">{p.titre}</h3>
                <p className="text-sm text-muted mt-1">{p.objectif}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge>≈ {p.duree_estimee_h} h</Badge>
                {campagnes.length > 0 && <Badge tone="ok">Testeur automatique</Badge>}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.competences.map((c) => (
                <span key={c} title={competence(c)?.titre} className="text-[11px] rounded bg-surface-2 px-1.5 py-0.5 text-muted">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <Markdown>{p.consignes_md}</Markdown>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="font-semibold text-sm mb-2">Livrables</h4>
                <ul className="space-y-2 text-sm">
                  {p.livrables.map((l) => (
                    <li key={l.id}>
                      <span className="font-medium">{l.nom}</span> <span className="text-muted">({l.format})</span> — {l.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Critères d&apos;évaluation</h4>
                <ul className="space-y-2 text-sm">
                  {p.criteres.map((c) => (
                    <li key={c.id} className="flex gap-2">
                      <span className="font-mono text-xs text-accent w-10 shrink-0 pt-0.5">{c.competence_id}</span>
                      <span>
                        {c.indicateur} {c.bloquant && <Badge tone="danger">bloquant</Badge>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
