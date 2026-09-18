"use client";

import { useState, useTransition } from "react";
import { validerPack, type ValidationResult } from "./actions";

export function ValidatorForm() {
  const [texte, setTexte] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="mt-6 space-y-4">
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        rows={16}
        spellCheck={false}
        placeholder='{ "schema_version": "1.0", "meta": { … } }'
        className="w-full rounded-lg border border-line bg-surface p-3 font-mono text-xs outline-none focus:border-accent"
      />
      <button
        disabled={pending || !texte.trim()}
        onClick={() => start(async () => setResult(await validerPack(texte)))}
        className="rounded-lg bg-accent text-accent-fg px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Validation…" : "Valider"}
      </button>
      {result?.ok === false && (
        <div className="rounded-lg bg-danger-soft text-danger p-4 text-sm">
          <div className="font-semibold mb-2">{result.erreurs.length} erreur(s)</div>
          <ul className="list-disc pl-5 space-y-1 font-mono text-xs">
            {result.erreurs.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {result?.ok && (
        <div className="rounded-lg bg-ok-soft text-ok p-4 text-sm space-y-1">
          <div className="font-semibold">Pack valide : {result.resume.titre}</div>
          <div>Identifiant : {result.resume.id}</div>
          <div>
            Tables générées : {Object.entries(result.resume.tables).map(([k, v]) => `${k} (${v})`).join(", ")}
          </div>
          <div>
            {result.resume.campagnes} campagne(s), {result.resume.scenarios} scénario(s), {result.resume.questions_jury} question(s) de jury
          </div>
        </div>
      )}
    </div>
  );
}
