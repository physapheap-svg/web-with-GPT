"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PortfolioContent } from "@/app/lib/content";

type StringKey = { [K in keyof PortfolioContent]: PortfolioContent[K] extends string ? K : never }[keyof PortfolioContent];
const parseLines = (value: string) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const parsePairs = (value: string) => parseLines(value).map((line) => { const [title, ...rest] = line.split("|"); return { title: title.trim(), body: rest.join("|").trim() }; }).filter((item) => item.title);
const parseTriples = (value: string) => parseLines(value).map((line) => { const [first, second, ...rest] = line.split("|"); return [first.trim(), second?.trim() ?? "", rest.join("|").trim()]; }).filter(([first]) => first);

export function AdminEditor() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [message, setMessage] = useState("Loading your portfolio settings…");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json() as { error?: string } & Partial<PortfolioContent>;
        if (!response.ok) throw new Error(body.error ?? "Could not load your settings.");
        setContent(body as PortfolioContent);
        setMessage("Changes are saved to your website after you select Save changes.");
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load your settings."));
  }, []);

  const setText = (key: StringKey, value: string) => setContent((current) => current ? { ...current, [key]: value } : current);
  const setTheme = (key: keyof PortfolioContent["theme"], value: string) => setContent((current) => current ? { ...current, theme: { ...current.theme, [key]: value } } : current);

  async function saveChanges() {
    if (!content) return;
    setBusy(true); setMessage("Saving your changes…");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) });
      const body = await response.json() as { error?: string; content?: PortfolioContent };
      if (!response.ok) throw new Error(body.error ?? "Could not save your changes.");
      if (!body.content) throw new Error("The saved settings could not be returned.");
      setContent(body.content);
      setMessage("Saved. Open your portfolio to see the changes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your changes.");
    } finally { setBusy(false); }
  }

  async function upload(kind: "photo" | "cv", file?: File) {
    if (!file) return;
    setBusy(true); setMessage(kind === "photo" ? "Uploading your photo…" : "Uploading your CV…");
    const data = new FormData(); data.set("kind", kind); data.set("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const body = await response.json() as { error?: string; url?: string };
      if (!response.ok) throw new Error(body.error ?? "Upload failed.");
      if (!body.url) throw new Error("The upload finished, but its link could not be returned.");
      setContent((current) => current ? { ...current, [kind === "photo" ? "photoUrl" : "cvUrl"]: body.url } : current);
      setMessage(kind === "photo" ? "Photo uploaded and saved." : "CV uploaded and saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally { setBusy(false); }
  }

  if (!content) return <main className="admin-shell"><section className="admin-card auth-card"><p className="admin-eyebrow">Portfolio dashboard</p><h1>Loading your editor</h1><p role="status">{message}</p><Link className="back-link" href="/">Return to portfolio</Link></section></main>;

  const highlightsText = content.highlights.map((item) => `${item.title} | ${item.body}`).join("\n");
  const educationText = content.education.map((item) => `${item.degree} | ${item.institution} | ${item.period}`).join("\n");
  const trainingText = content.training.map((item) => `${item.name} | ${item.provider} | ${item.period}`).join("\n");

  return <main className="admin-shell">
      <header className="admin-top"><Link className="admin-brand" href="/">PHEAP PHYSA <span>· SITE ADMIN</span></Link><Link className="admin-preview" href="/" target="_blank" rel="noreferrer">Open portfolio ↗</Link></header>
    <div className="admin-wrap">
      <div className="admin-heading"><div><p className="admin-eyebrow">Your private dashboard</p><h1>Manage your portfolio</h1><p>Edit the words, lists, colors, profile photo, and CV shown on your website.</p></div><button className="admin-button save-button" onClick={saveChanges} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div>
      <p className="admin-status" role="status" aria-live="polite">{message}</p>

      <section className="admin-card"><div className="admin-card-head"><span>01</span><div><h2>Profile &amp; introduction</h2><p>Update the name, role, headline, and introduction visitors see first.</p></div></div>
        <div className="admin-grid">
          <Field label="Name"><input value={content.name} onChange={(e) => setText("name", e.target.value)} /></Field>
          <Field label="Role"><input value={content.role} onChange={(e) => setText("role", e.target.value)} /></Field>
          <Field label="Location"><input value={content.location} onChange={(e) => setText("location", e.target.value)} /></Field>
          <Field label="Small heading"><input value={content.heroEyebrow} onChange={(e) => setText("heroEyebrow", e.target.value)} /></Field>
          <Field label="Main headline"><textarea rows={3} value={content.headline} onChange={(e) => setText("headline", e.target.value)} /><small>Use a new line to split the headline across lines.</small></Field>
          <Field label="Introduction"><textarea rows={4} value={content.intro} onChange={(e) => setText("intro", e.target.value)} /></Field>
          <Field label="About heading"><input value={content.aboutTitle} onChange={(e) => setText("aboutTitle", e.target.value)} /></Field>
          <Field label="About text"><textarea rows={4} value={content.aboutBody} onChange={(e) => setText("aboutBody", e.target.value)} /></Field>
          <ArrayField label="About cards · one per line: title | description" value={highlightsText} onChange={(v) => setContent({ ...content, highlights: parsePairs(v) })} />
        </div>
      </section>

      <section className="admin-card"><div className="admin-card-head"><span>02</span><div><h2>Experience</h2><p>Update your current role and responsibilities.</p></div></div>
        <div className="admin-grid">
          <Field label="Section heading"><input value={content.experienceTitle} onChange={(e) => setText("experienceTitle", e.target.value)} /></Field>
          <Field label="Section description"><textarea rows={3} value={content.experienceIntro} onChange={(e) => setText("experienceIntro", e.target.value)} /></Field>
          <Field label="Job title"><input value={content.jobTitle} onChange={(e) => setText("jobTitle", e.target.value)} /></Field>
          <Field label="Company"><input value={content.company} onChange={(e) => setText("company", e.target.value)} /></Field>
          <Field label="Dates"><input value={content.jobPeriod} onChange={(e) => setText("jobPeriod", e.target.value)} /></Field>
          <ArrayField label="Responsibilities · one per line" value={content.jobResponsibilities.join("\n")} onChange={(v) => setContent({ ...content, jobResponsibilities: parseLines(v) })} />
          <Field label="Digital work heading"><input value={content.digitalTitle} onChange={(e) => setText("digitalTitle", e.target.value)} /></Field>
          <Field label="Digital work description"><textarea rows={3} value={content.digitalIntro} onChange={(e) => setText("digitalIntro", e.target.value)} /></Field>
          <ArrayField label="Digital work · one per line" value={content.digitalTasks.join("\n")} onChange={(v) => setContent({ ...content, digitalTasks: parseLines(v) })} />
        </div>
      </section>

      <section className="admin-card"><div className="admin-card-head"><span>03</span><div><h2>Skills, education &amp; training</h2><p>Add or remove items by editing the lists.</p></div></div>
        <div className="admin-grid">
          <Field label="Skills heading"><input value={content.skillsTitle} onChange={(e) => setText("skillsTitle", e.target.value)} /></Field>
          <Field label="Skills description"><textarea rows={3} value={content.skillsIntro} onChange={(e) => setText("skillsIntro", e.target.value)} /></Field>
          <ArrayField label="Skills · one per line" value={content.skills.join("\n")} onChange={(v) => setContent({ ...content, skills: parseLines(v) })} />
          <Field label="Education heading"><input value={content.educationTitle} onChange={(e) => setText("educationTitle", e.target.value)} /></Field>
          <Field label="Education description"><textarea rows={3} value={content.educationIntro} onChange={(e) => setText("educationIntro", e.target.value)} /></Field>
          <ArrayField label="Education · one per line: qualification | school | dates" value={educationText} onChange={(v) => setContent({ ...content, education: parseTriples(v).map(([degree, institution, period]) => ({ degree, institution, period })) })} />
          <ArrayField label="Training · one per line: course | provider | date" value={trainingText} onChange={(v) => setContent({ ...content, training: parseTriples(v).map(([name, provider, period]) => ({ name, provider, period })) })} />
        </div>
      </section>

      <section className="admin-card"><div className="admin-card-head"><span>04</span><div><h2>Contact &amp; appearance</h2><p>Change your contact links and choose the portfolio colors.</p></div></div>
        <div className="admin-grid">
          <Field label="Contact heading"><input value={content.contactTitle} onChange={(e) => setText("contactTitle", e.target.value)} /></Field>
          <Field label="Contact message"><textarea rows={3} value={content.contactBody} onChange={(e) => setText("contactBody", e.target.value)} /></Field>
          <Field label="Email"><input type="email" value={content.email} onChange={(e) => setText("email", e.target.value)} /></Field>
          <Field label="Phone"><input value={content.phone} onChange={(e) => setText("phone", e.target.value)} /></Field>
          <Field label="LinkedIn URL"><input type="url" value={content.linkedin} onChange={(e) => setText("linkedin", e.target.value)} /></Field>
          <Field label="Telegram URL"><input type="url" value={content.telegram} onChange={(e) => setText("telegram", e.target.value)} /></Field>
          <Field label="Page background"><ColorField value={content.theme.paper} onChange={(v) => setTheme("paper", v)} /></Field>
          <Field label="Text color"><ColorField value={content.theme.ink} onChange={(v) => setTheme("ink", v)} /></Field>
          <Field label="Accent color"><ColorField value={content.theme.accent} onChange={(v) => setTheme("accent", v)} /></Field>
        </div>
      </section>

      <section className="admin-card"><div className="admin-card-head"><span>05</span><div><h2>Photo &amp; CV</h2><p>Upload replacements. Photos may be JPG, PNG, or WebP up to 5 MB; CVs must be PDF up to 10 MB.</p></div></div>
        <div className="upload-grid"><div className="upload-box"><img className="admin-photo-preview" src={content.photoUrl} alt="Current profile" /><div><strong>Profile photo</strong><p>Used in the portfolio header and profile card.</p><label className="upload-button">Choose photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload("photo", e.currentTarget.files?.[0])} /></label></div></div>
          <div className="upload-box"><div className="cv-icon">PDF</div><div><strong>CV document</strong><p><a href={content.cvUrl} target="_blank" rel="noreferrer">Preview current CV ↗</a></p><label className="upload-button">Choose CV<input type="file" accept="application/pdf" onChange={(e) => upload("cv", e.currentTarget.files?.[0])} /></label></div></div></div>
      </section>
      <div className="admin-bottom"><p>Only your signed-in owner account can edit this portfolio.</p><button className="admin-button save-button" onClick={saveChanges} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div>
    </div>
  </main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="admin-field"><span>{label}</span>{children}</label>;
}

function ArrayField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} /></Field>;
}

function ColorField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <span className="color-input"><input type="color" value={value} onChange={(e) => onChange(e.target.value)} /><code>{value}</code></span>;
}
