import Link from "next/link";
import type { Metadata } from "next";
import { syllabus } from "@/lib/content";

export const metadata: Metadata = { title: "Syllabus" };

export default function SyllabusIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Syllabus</h1>
      <p className="text-muted mt-2">
        Parcours « Consultant·e formateur·rice IA — automatisation, intégration, architecture ». Référentiel, modalités d&apos;évaluation et
        parcours de progression.
      </p>
      <ol className="mt-8 space-y-3">
        {syllabus.map((c) => (
          <li key={c.slug}>
            <Link href={`/syllabus/${c.slug}`} className="block rounded-xl border border-line bg-surface p-5 hover:border-accent">
              <div className="font-serif text-lg font-semibold">{c.titre}</div>
              <div className="text-sm text-muted mt-1">{c.resume}</div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
