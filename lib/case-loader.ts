// Chargement d'un pack de cas depuis le disque (scripts et tests uniquement, jamais dans l'application).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import { CasePackSchema, formatZodIssues } from "./schema/case-pack";

function readStructured(file: string): unknown {
  const raw = fs.readFileSync(file, "utf8");
  return file.endsWith(".json") ? JSON.parse(raw) : YAML.parse(raw);
}

function firstExisting(...files: string[]) {
  return files.find((f) => fs.existsSync(f));
}

export function loadCase(dir: string) {
  const main = firstExisting(path.join(dir, "case.yaml"), path.join(dir, "case.yml"), path.join(dir, "case.json"));
  if (!main) throw new Error(`Aucun case.yaml / case.json dans ${dir}`);
  const pack = readStructured(main) as Record<string, unknown>;

  const docsDir = path.join(dir, "documents");
  if (fs.existsSync(docsDir)) {
    const docs = (pack.documents as unknown[] | undefined) ?? [];
    for (const f of fs.readdirSync(docsDir).filter((f) => f.endsWith(".md")).sort()) {
      const { data, content } = matter(fs.readFileSync(path.join(docsDir, f), "utf8"));
      // Le frontmatter YAML convertit les dates non quotées en objets Date : on revient à AAAA-MM-JJ.
      const front = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v instanceof Date ? v.toISOString().slice(0, 10) : v]));
      docs.push({ ...front, id: front.id ?? path.basename(f, ".md"), contenu_md: content.trim() });
    }
    pack.documents = docs;
  }

  const evalFile = firstExisting(path.join(dir, "_evaluateur", "evaluation.yaml"), path.join(dir, "_evaluateur", "evaluation.json"));
  if (evalFile) pack.evaluation = readStructured(evalFile);

  const parsed = CasePackSchema.safeParse(pack);
  if (!parsed.success) {
    throw new Error(`Pack invalide (${path.basename(dir)}) :\n  - ${formatZodIssues(parsed.error).join("\n  - ")}`);
  }
  return parsed.data;
}
