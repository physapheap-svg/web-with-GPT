import { env } from "cloudflare:workers";
import { adminApiResponse } from "@/app/lib/admin-auth";
import { readPortfolioContent, savePortfolioContent } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = await adminApiResponse();
  if (denied) return denied;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  if (!env.BUCKET) return Response.json({ error: "File storage is not available yet. Please publish the site again." }, { status: 503 });

  try {
    const data = await request.formData();
    const kind = data.get("kind");
    const file = data.get("file");
    if (kind !== "photo" && kind !== "cv") return Response.json({ error: "Choose a profile photo or CV." }, { status: 400 });
    if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });
    if (kind === "photo" && (!(["image/jpeg", "image/png", "image/webp"].includes(file.type)) || file.size > 5_000_000)) {
      return Response.json({ error: "Use a JPG, PNG, or WebP photo under 5 MB." }, { status: 400 });
    }
    if (kind === "cv" && (file.type !== "application/pdf" || file.size > 10_000_000)) {
      return Response.json({ error: "Use a PDF CV under 10 MB." }, { status: 400 });
    }

    const key = kind === "photo" ? "profile" : "cv";
    await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    const url = kind === "photo" ? "/api/media/profile" : "/api/media/cv";
    const content = await readPortfolioContent();
    if (kind === "photo") content.photoUrl = url;
    else content.cvUrl = url;
    await savePortfolioContent(content);
    return Response.json({ ok: true, url });
  } catch {
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
