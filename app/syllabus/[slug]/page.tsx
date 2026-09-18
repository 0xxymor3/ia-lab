import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapitre, syllabus } from "@/lib/content";
import { Markdown } from "@/components/markdown";

export function generateStaticParams() {
  return syllabus.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/syllabus/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getChapitre(slug)?.titre ?? "Syllabus" };
}

export default async function Chapitre({ params }: PageProps<"/syllabus/[slug]">) {
  const { slug } = await params;
  const chapitre = getChapitre(slug);
  if (!chapitre) notFound();
  const i = syllabus.findIndex((c) => c.slug === slug);
  const prev = syllabus[i - 1];
  const next = syllabus[i + 1];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1 text-sm">
          {syllabus.map((c) => (
            <Link
              key={c.slug}
              href={`/syllabus/${c.slug}`}
              className={`block rounded-md px-3 py-2 ${c.slug === slug ? "bg-accent-soft text-accent font-medium" : "text-muted hover:text-fg"}`}
            >
              {c.titre}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="min-w-0">
        <Markdown>{chapitre.body}</Markdown>
        <div className="mt-12 flex justify-between gap-4 text-sm">
          {prev ? (
            <Link href={`/syllabus/${prev.slug}`} className="text-accent">
              ← {prev.titre}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/syllabus/${next.slug}`} className="text-accent text-right">
              {next.titre} →
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
