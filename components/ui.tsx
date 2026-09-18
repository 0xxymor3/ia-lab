import type { ReactNode } from "react";
import { ATTITUDES } from "@/lib/schema/case-pack";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface p-5 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-xl font-semibold">{children}</h2>
      {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
    </div>
  );
}

type Tone = "neutral" | "accent" | "ok" | "warn" | "danger";
const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  accent: "bg-accent-soft text-accent",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONES[tone]}`}>{children}</span>;
}

const ATTITUDE_TONE: Record<(typeof ATTITUDES)[number], Tone> = {
  sponsor: "ok",
  enthousiaste: "accent",
  neutre: "neutral",
  sceptique: "warn",
  reticent: "warn",
  bloquant: "danger",
};
const ATTITUDE_LABEL: Record<(typeof ATTITUDES)[number], string> = {
  sponsor: "Sponsor",
  enthousiaste: "Enthousiaste",
  neutre: "Neutre",
  sceptique: "Sceptique",
  reticent: "Réticent·e",
  bloquant: "Bloquant·e",
};

export function AttitudeBadge({ attitude }: { attitude: (typeof ATTITUDES)[number] }) {
  return <Badge tone={ATTITUDE_TONE[attitude]}>IA : {ATTITUDE_LABEL[attitude]}</Badge>;
}

export function Notice({ children, tone = "accent" }: { children: ReactNode; tone?: Tone }) {
  return <div className={`rounded-lg px-4 py-3 text-sm ${TONES[tone]}`}>{children}</div>;
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" }) {
  const cls =
    variant === "primary"
      ? "bg-accent text-accent-fg hover:opacity-90"
      : "border border-line hover:bg-surface-2";
  return (
    <a href={href} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${cls}`}>
      {children}
    </a>
  );
}
