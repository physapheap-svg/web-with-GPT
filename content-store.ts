import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { portfolioContent } from "@/db/schema";
import { DEFAULT_CONTENT, normalizeContent } from "@/app/lib/content";

export async function readPortfolioContent() {
  try {
    const [row] = await getDb().select().from(portfolioContent).where(eq(portfolioContent.id, "main")).limit(1);
    return row ? normalizeContent(JSON.parse(row.content)) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function savePortfolioContent(content: unknown) {
  const normalized = normalizeContent(content);
  await getDb().insert(portfolioContent).values({
    id: "main",
    content: JSON.stringify(normalized),
    updatedAt: new Date().toISOString(),
  }).onConflictDoUpdate({
    target: portfolioContent.id,
    set: { content: JSON.stringify(normalized), updatedAt: new Date().toISOString() },
  });
  return normalized;
}
