import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const portfolioContent = sqliteTable("portfolio_content", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: text("updated_at").notNull(),
});
