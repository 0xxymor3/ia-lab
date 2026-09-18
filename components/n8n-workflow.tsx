"use client";

import { createElement, useEffect, useState } from "react";

const SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.0.0/webcomponents-loader.js",
  "https://cdn.jsdelivr.net/npm/lit@2.0.0-rc.2/polyfill-support.js",
];
const MODULE = "https://cdn.jsdelivr.net/npm/@n8n_io/n8n-demo-component/n8n-demo.bundled.js";

function load(src: string, module = false) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    if (module) s.type = "module";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(src));
    document.head.appendChild(s);
  });
}

// Affiche un workflow n8n exporté (JSON) avec le composant officiel n8n-demo.
export function N8nWorkflow({ url, titre }: { url: string; titre: string }) {
  const [json, setJson] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        for (const s of SCRIPTS) await load(s);
        await load(MODULE, true);
        const res = await fetch(url);
        setJson(JSON.stringify(await res.json()));
      } catch {
        setError(true);
      }
    })();
  }, [url]);

  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line text-sm">
        <span className="font-medium">{titre}</span>
        <a href={url} download className="text-accent text-xs underline">
          Télécharger le JSON
        </a>
      </div>
      {error ? (
        <p className="p-4 text-sm text-muted">Aperçu indisponible — téléchargez le JSON et importez-le dans n8n.</p>
      ) : json ? (
        createElement("n8n-demo", { workflow: json, frame: "true", style: { display: "block", height: "480px" } })
      ) : (
        <p className="p-4 text-sm text-muted">Chargement de l&apos;aperçu…</p>
      )}
    </div>
  );
}
