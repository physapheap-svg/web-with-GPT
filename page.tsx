import { Portfolio } from "@/app/Portfolio";
import { isPortfolioAdmin } from "@/app/lib/admin-auth";
import { readPortfolioContent } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, isOwner] = await Promise.all([readPortfolioContent(), isPortfolioAdmin()]);
  return <Portfolio content={content} isOwner={isOwner} />;
}
