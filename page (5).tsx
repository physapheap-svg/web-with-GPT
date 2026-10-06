import Link from "next/link";
import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { ADMIN_EMAIL } from "@/app/lib/admin-auth";
import { AdminEditor } from "@/app/admin/AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getChatGPTUser();
  if (!user) {
    return <main className="admin-shell"><section className="admin-card auth-card"><p className="admin-eyebrow">Portfolio dashboard</p><h1>Sign in to manage your site</h1><p>Your portfolio settings are protected. Sign in with the account that owns this site to continue.</p><a className="admin-button" href={chatGPTSignInPath("/admin")} target="_top">Sign in with ChatGPT</a><Link className="back-link" href="/">Return to portfolio</Link></section></main>;
  }
  if (user.email.toLowerCase() !== ADMIN_EMAIL) {
    return <main className="admin-shell"><section className="admin-card auth-card"><p className="admin-eyebrow">Portfolio dashboard</p><h1>Access restricted</h1><p>This dashboard is available only to the portfolio owner.</p><Link className="back-link" href="/">Return to portfolio</Link></section></main>;
  }
  return <AdminEditor />;
}
