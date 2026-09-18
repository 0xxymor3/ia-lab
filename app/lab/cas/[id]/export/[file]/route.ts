import { getCase } from "@/lib/content";
import { datasetFor } from "@/lib/data/generator";
import { toCsv, toXlsx } from "@/lib/data/export";

// Route protégée par proxy.ts (préfixe /lab).
export async function GET(_req: Request, ctx: RouteContext<"/lab/cas/[id]/export/[file]">) {
  const { id, file } = await ctx.params;
  const pack = getCase(id);
  if (!pack) return new Response("Cas inconnu", { status: 404 });
  const m = /^([a-z0-9_-]+)\.(csv|xlsx)$/.exec(file);
  if (!m) return new Response("Fichier invalide", { status: 400 });
  const [, name, ext] = m;
  const ds = datasetFor(pack);

  if (name === "tout" && ext === "xlsx") {
    const buf = await toXlsx(ds);
    return new Response(new Uint8Array(buf), {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": `attachment; filename="${pack.meta.id}-donnees.xlsx"`,
      },
    });
  }
  const rows = ds[name];
  if (!rows) return new Response("Table inconnue", { status: 404 });
  if (ext === "csv")
    return new Response(toCsv(rows), {
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${name}.csv"` },
    });
  const buf = await toXlsx({ [name]: rows });
  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${name}.xlsx"`,
    },
  });
}
