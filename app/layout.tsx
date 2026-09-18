import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif-display" });

export const metadata: Metadata = {
  title: { default: "IA Lab — Laurent Noël", template: "%s · IA Lab" },
  description:
    "Laboratoire de compétences d'un consultant formateur IA : syllabus, cas pratiques en entreprise fictive, tests automatisés et portfolio vérifiable.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${serif.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-5 text-sm">
            <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
              IA&nbsp;Lab
            </Link>
            <div className="flex items-center gap-4 overflow-x-auto">
              <Link href="/syllabus" className="text-muted hover:text-fg">
                Syllabus
              </Link>
              <Link href="/portfolio" className="text-muted hover:text-fg">
                Portfolio
              </Link>
              <Link href="/lab" className="text-muted hover:text-fg">
                Laboratoire
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line text-xs text-muted">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>Entreprises, personnes et données des cas pratiques : entièrement fictives.</span>
            <span>Laurent Noël — consultant formateur IA · Vannes</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
