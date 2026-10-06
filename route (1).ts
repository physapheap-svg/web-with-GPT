import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

export async function GET() {
  const object = await env.BUCKET?.get("profile");
  if (!object) return new Response("Profile photo not found", { status: 404 });
  return new Response(object.body, { headers: { "content-type": object.httpMetadata?.contentType ?? "image/jpeg", "cache-control": "no-store" } });
}
