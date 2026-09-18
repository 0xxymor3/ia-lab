import type { NextRequest } from "next/server";
import { getCase } from "@/lib/content";
import { Sandbox } from "@/lib/sandbox/state";

export const dynamic = "force-dynamic";

// Capture de webhooks : simule un outil tiers (Slack, Teams, SMS…) qui reçoit des notifications.
export async function POST(req: NextRequest, ctx: { params: Promise<{ caseId: string; name: string }> }) {
  const { caseId, name } = await ctx.params;
  const pack = getCase(caseId);
  if (!pack || !/^[a-z0-9_-]{1,40}$/.test(name)) return Response.json({ error: "introuvable" }, { status: 404 });
  const text = (await req.text()).slice(0, 20000);
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // corps non JSON conservé tel quel
  }
  const sb = new Sandbox(pack);
  await sb.pushHook(name, { recu_le: new Date().toISOString(), content_type: req.headers.get("content-type"), body });
  await sb.log({ ts: new Date().toISOString(), method: "POST", path: `/hooks/${name}`, status: 200, ms: 0, apercu: text.slice(0, 400) });
  return Response.json({ ok: true });
}
