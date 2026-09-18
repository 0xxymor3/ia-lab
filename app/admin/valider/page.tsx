import type { Metadata } from "next";
import { ValidatorForm } from "./form";

export const metadata: Metadata = { title: "Valider un pack" };

export default function ValiderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Valider un pack de cas</h1>
      <p className="text-muted mt-2">
        Collez le JSON produit par le projet Claude (<code>/nouveau-cas</code>). Pack livré en trois parties : collez-les dans un tableau <code>[partie1, partie2, partie3]</code>. Les erreurs sont listées avec leur chemin. Une fois valide, enregistrez-le
        dans un fichier et importez-le : <code className="text-xs bg-surface-2 px-1 rounded">pnpm case:import pack.json</code> (ou <code className="text-xs bg-surface-2 px-1 rounded">pnpm case:import partie1.json partie2.json partie3.json</code>), puis
        poussez sur GitHub pour le déployer.
      </p>
      <ValidatorForm />
    </div>
  );
}
