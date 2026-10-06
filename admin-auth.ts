import { getChatGPTUser } from "@/app/chatgpt-auth";

export const ADMIN_EMAIL = "physa.pheap@jobify.works";

export async function isPortfolioAdmin() {
  const user = await getChatGPTUser();
  return Boolean(user && user.email.toLowerCase() === ADMIN_EMAIL);
}

export async function adminApiResponse() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Please sign in to manage this site." }, { status: 401 });
  if (user.email.toLowerCase() !== ADMIN_EMAIL) return Response.json({ error: "You do not have permission to edit this portfolio." }, { status: 403 });
  return null;
}
