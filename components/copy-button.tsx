"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copier" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // presse-papiers indisponible
        }
      }}
      className="rounded-md border border-line px-2 py-1 text-xs hover:bg-surface-2"
    >
      {done ? "Copié ✓" : label}
    </button>
  );
}
