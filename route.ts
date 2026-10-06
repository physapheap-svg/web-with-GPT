import { readPortfolioContent } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await readPortfolioContent(), {
    headers: { "cache-control": "no-store" },
  });
}
