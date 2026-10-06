import type { CSSProperties } from "react";
import type { PortfolioContent } from "@/app/lib/content";

export function Portfolio({ content, isOwner }: { content: PortfolioContent; isOwner: boolean }) {
  const theme = {
    "--paper": content.theme.paper,
    "--ink": content.theme.ink,
    "--accent": content.theme.accent,
  } as CSSProperties;
  return (
    <main className="portfolio" style={theme}>
      <header className="site-header wrap">
        <a className="brand" href="#home" aria-label={`${content.name}, home`}><img className="brand-avatar" src={content.photoUrl} alt="" />{content.name}</a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#home">Home</a><a href="#experience">Experience</a><a href="#skills">Skill</a><a href="#contact">Contact</a>
          {isOwner && <a className="manage-link" href="/admin">Manage site ↗</a>}
        </nav>
      </header>

      <section className="hero wrap" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" />{content.heroEyebrow}</p>
          <h1>{content.headline.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}{index < content.headline.split("\n").length - 1 && <br />}</span>)}</h1>
          <p className="intro">{content.intro}</p>
          <div className="hero-actions"><a className="button primary" href="#experience">Explore my work ↓</a><a className="button outline" href={content.cvUrl} download>Download my CV ↓</a></div>
        </div>
        <div className="profile-card">
          <span className="card-label">PROFILE · {content.location}</span>
          <img className="profile-photo" src={content.photoUrl} alt={`Portrait of ${content.name}`} />
          <div className="profile-caption"><strong>{content.name}</strong><span>{content.role}</span></div>
        </div>
      </section>

      <section className="content-section" id="about"><div className="wrap">
        <div className="section-heading"><p className="section-label">01 / About</p><div><h2>{content.aboutTitle}</h2><p className="section-lead">{content.aboutBody}</p></div></div>
        <div className="highlight-grid">{content.highlights.map((item, index) => <article className="highlight-card" key={`${item.title}-${index}`}><span className="card-number">{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
      </div></section>

      <section className="content-section" id="experience"><div className="wrap">
        <div className="section-heading"><p className="section-label">02 / Experience</p><div><h2>{content.experienceTitle}</h2><p className="section-lead">{content.experienceIntro}</p></div></div>
        <div className="experience-grid">
          <article className="experience-card dark-card"><p className="meta">{content.jobPeriod}</p><h3>{content.jobTitle}</h3><p className="company">{content.company}</p><ul>{content.jobResponsibilities.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></article>
          <article className="experience-card soft-card"><p className="meta">Digital recruitment &amp; administration</p><h3>{content.digitalTitle}</h3><p className="company">{content.digitalIntro}</p><ul>{content.digitalTasks.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></article>
        </div>
      </div></section>

      <section className="content-section" id="skills"><div className="wrap">
        <div className="section-heading"><p className="section-label">03 / Skills</p><div><h2>{content.skillsTitle}</h2><p className="section-lead">{content.skillsIntro}</p></div></div>
        <div className="skill-list">{content.skills.map((skill, index) => <span className="skill-chip" key={`${skill}-${index}`}>{skill}</span>)}</div>
      </div></section>

      <section className="content-section" id="education"><div className="wrap">
        <div className="section-heading"><p className="section-label">04 / Education</p><div><h2>{content.educationTitle}</h2><p className="section-lead">{content.educationIntro}</p></div></div>
        <div className="education-list">{content.education.map((item, index) => <article className="education-row" key={`${item.degree}-${index}`}><div><h3>{item.degree}</h3><p>{item.institution}</p></div><span>{item.period}</span></article>)}</div>
        {content.training.length > 0 && <div className="training-block"><p className="section-label">Training</p>{content.training.map((item, index) => <article className="education-row" key={`${item.name}-${index}`}><div><h3>{item.name}</h3><p>{item.provider}</p></div><span>{item.period}</span></article>)}</div>}
      </div></section>

      <section className="contact-section" id="contact"><div className="wrap contact-layout"><div><p className="section-label">Let’s connect</p><h2>{content.contactTitle}</h2><p className="contact-copy">{content.contactBody}</p><div className="contact-links"><a href={`tel:${content.phone.replace(/[^+\d]/g, "")}`}>{content.phone}</a><a href={content.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={content.telegram} target="_blank" rel="noreferrer">Telegram ↗</a></div></div><a className="button contact-button" href={`mailto:${content.email}`}>Email Physa ↗</a></div></section>
      <footer className="wrap site-footer"><span>© {new Date().getFullYear()} {content.name} · Personal portfolio</span><a href="#home">Back to top ↑</a></footer>
    </main>
  );
}
