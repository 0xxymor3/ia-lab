// Compile le dossier content/ (syllabus, packs de cas, portfolio) en un module JSON
// importé par l'application. Valide chaque pack : le build échoue si un pack est invalide.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { loadCase } from "../lib/case-loader";

const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "generated");

function build() {
  const syllabusDir = path.join(CONTENT, "syllabus");
  const syllabus = fs
    .readdirSync(syllabusDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(syllabusDir, f), "utf8"));
      return { slug: path.basename(f, ".md"), titre: data.titre, ordre: data.ordre, resume: data.resume, body: content.trim() };
    })
    .sort((a, b) => a.ordre - b.ordre);

  const casesDir = path.join(CONTENT, "cases");
  const cases = fs.existsSync(casesDir)
    ? fs
        .readdirSync(casesDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
        .map((d) => loadCase(path.join(casesDir, d.name)))
    : [];

  const portfolioDir = path.join(CONTENT, "portfolio");
  const portfolio = fs.existsSync(portfolioDir)
    ? fs
        .readdirSync(portfolioDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .flatMap((d) => {
          const file = path.join(portfolioDir, d.name, "index.md");
          if (!fs.existsSync(file)) return [];
          const { data, content } = matter(fs.readFileSync(file, "utf8"));
          return [{ id: d.name, ...data, body: content.trim() }];
        })
    : [];

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = { generated_at: new Date().toISOString(), syllabus, cases, portfolio };
  fs.writeFileSync(path.join(OUT_DIR, "content.json"), JSON.stringify(out));
  console.log(
    `content.json : ${syllabus.length} chapitres, ${cases.length} cas (${cases.map((c) => c.meta.id).join(", ")}), ${portfolio.length} entrées de portfolio`,
  );
}

try {
  build();
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}
