import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

export async function GET() {
  const object = await env.BUCKET?.get("cv");
  if (!object) return new Response("CV not found", { status: 404 });
  return new Response(object.body, { headers: { "content-type": object.httpMetadata?.contentType ?? "application/pdf", "content-disposition": "attachment; filename=\"Pheap-Physa-CV.pdf\"", "cache-control": "no-store" } });
}
