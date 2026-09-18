// Importe un pack JSON (généré par le projet Claude) dans content/cases/<id>/ :
//   case.json                 → tout sauf l'évaluation et les documents
//   documents/<id>.md         → un fichier Markdown par document (frontmatter)
//   _evaluateur/evaluation.json → campagnes du testeur et questions du jury (spoilers)
// Usage : pnpm case:import pack.json [partie2.json partie3.json …] [--force]
// Plusieurs fichiers (pack livré en parties) sont fusionnés clé par clé avant validation.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { CasePackSchema, formatZodIssues } from "../lib/schema/case-pack";
import { generateDataset } from "../lib/data/generator";

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const files = args.filter((a) => !a.startsWith("--"));
if (!files.length) {
  console.error("Usage : pnpm case:import pack.json [partie2.json …] [--force]");
  process.exit(1);
}

const parts = files.flatMap((file) => {
  const raw = fs.readFileSync(path.resolve(file), "utf8");
  const parsed = file.endsWith(".json") ? JSON.parse(raw) : YAML.parse(raw);
  return Array.isArray(parsed) ? parsed : [parsed];
});
const data = Object.assign({}, ...parts);
const parsed = CasePackSchema.safeParse(data);
if (!parsed.success) {
  console.error(`Pack invalide :\n  - ${formatZodIssues(parsed.error).join("\n  - ")}`);
  process.exit(1);
}
const pack = parsed.data;
generateDataset(pack); // échoue si un générateur est invalide

const dir = path.resolve(__dirname, "..", "content", "cases", pack.meta.id);
if (fs.existsSync(dir) && !flags.includes("--force")) {
  console.error(`Le cas ${pack.meta.id} existe déjà (${dir}). Relancez avec --force pour l'écraser.`);
  process.exit(1);
}
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(path.join(dir, "documents"), { recursive: true });
fs.mkdirSync(path.join(dir, "_evaluateur"), { recursive: true });

const { evaluation, documents, ...rest } = pack;
fs.writeFileSync(path.join(dir, "case.json"), JSON.stringify(rest, null, 2));
fs.writeFileSync(path.join(dir, "_evaluateur", "evaluation.json"), JSON.stringify(evaluation, null, 2));
for (const d of documents) {
  const { contenu_md, ...front } = d;
  fs.writeFileSync(path.join(dir, "documents", `${d.id}.md`), `---\n${YAML.stringify(front, { defaultStringType: "QUOTE_DOUBLE", defaultKeyType: "PLAIN" })}---\n\n${contenu_md}\n`);
}
console.log(`Cas importé : ${pack.meta.id} → ${dir}`);
console.log(`${documents.length} document(s), ${evaluation.campagnes.length} campagne(s), ${evaluation.jury.length} question(s) de jury.`);
console.log("Étapes suivantes : pnpm content && git add content/cases && git commit && git push");
