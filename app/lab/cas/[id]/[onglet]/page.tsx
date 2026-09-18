import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getCase } from "@/lib/content";
import {
  BriefSection,
  DocumentsSection,
  DonneesSection,
  EntrepriseSection,
  LogicielsSection,
  MissionsSection,
  OrganigrammeSection,
} from "@/components/case/sections";
import { ApiDocSection } from "@/components/case/api-doc";
import { JournalSection } from "@/components/case/journal";

export const dynamic = "force-dynamic";

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function Onglet({ params, searchParams }: PageProps<"/lab/cas/[id]/[onglet]">) {
  const { id, onglet } = await params;
  const sp = await searchParams;
  const pack = getCase(id);
  if (!pack) notFound();

  switch (onglet) {
    case "brief":
      return <BriefSection pack={pack} />;
    case "entreprise":
      return <EntrepriseSection pack={pack} />;
    case "organigramme":
      return <OrganigrammeSection pack={pack} />;
    case "logiciels":
      return <LogicielsSection pack={pack} />;
    case "donnees":
      return <DonneesSection pack={pack} />;
    case "documents":
      return <DocumentsSection pack={pack} docId={typeof sp.doc === "string" ? sp.doc : undefined} />;
    case "missions":
      return <MissionsSection pack={pack} />;
    case "api":
      return <ApiDocSection pack={pack} origin={await origin()} />;
    case "journal":
      return <JournalSection pack={pack} />;
    default:
      notFound();
  }
}
