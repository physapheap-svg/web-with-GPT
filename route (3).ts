import { adminApiResponse } from "@/app/lib/admin-auth";
import { savePortfolioContent, readPortfolioContent } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await adminApiResponse();
  if (denied) return denied;
  return Response.json(await readPortfolioContent(), { headers: { "cache-control": "no-store" } });
}

export async function PUT(request: Request) {
  const denied = await adminApiResponse();
  if (denied) return denied;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });

  try {
    const payload = await request.json() as { content?: unknown };
    if (!payload.content || typeof payload.content !== "object" || JSON.stringify(payload.content).length > 100_000) {
      return Response.json({ error: "The portfolio data is invalid or too large." }, { status: 400 });
    }
    const content = await savePortfolioContent(payload.content);
    return Response.json({ ok: true, content });
  } catch {
    return Response.json({ error: "Could not save the portfolio. Please check the form and try again." }, { status: 500 });
  }
}
