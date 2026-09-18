"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ONGLETS = [
  { slug: "brief", label: "Demande client" },
  { slug: "entreprise", label: "Fiche entreprise" },
  { slug: "organigramme", label: "Organigramme" },
  { slug: "logiciels", label: "Logiciels" },
  { slug: "donnees", label: "Données" },
  { slug: "documents", label: "Documents internes" },
  { slug: "missions", label: "Missions" },
  { slug: "api", label: "Doc API" },
  { slug: "journal", label: "Journal" },
  { slug: "testeur", label: "Testeur" },
] as const;

export function CaseTabs({ id }: { id: string }) {
  const pathname = usePathname();
  return (
    <nav className="mt-6 -mx-4 px-4 overflow-x-auto border-b border-line">
      <ul className="flex gap-1 min-w-max">
        {ONGLETS.map((o) => {
          const href = `/lab/cas/${id}/${o.slug}`;
          const active = pathname?.startsWith(href);
          return (
            <li key={o.slug}>
              <Link
                href={href}
                className={`block px-3 py-2.5 text-sm border-b-2 -mb-px ${
                  active ? "border-accent text-fg font-medium" : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
