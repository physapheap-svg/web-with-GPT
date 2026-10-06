export type PortfolioContent = {
  name: string;
  role: string;
  location: string;
  heroEyebrow: string;
  headline: string;
  intro: string;
  aboutTitle: string;
  aboutBody: string;
  highlights: { title: string; body: string }[];
  experienceTitle: string;
  experienceIntro: string;
  company: string;
  jobTitle: string;
  jobPeriod: string;
  jobResponsibilities: string[];
  digitalTitle: string;
  digitalIntro: string;
  digitalTasks: string[];
  skillsTitle: string;
  skillsIntro: string;
  skills: string[];
  educationTitle: string;
  educationIntro: string;
  education: { degree: string; institution: string; period: string }[];
  training: { name: string; provider: string; period: string }[];
  contactTitle: string;
  contactBody: string;
  email: string;
  phone: string;
  linkedin: string;
  telegram: string;
  photoUrl: string;
  cvUrl: string;
  theme: { paper: string; ink: string; accent: string };
};

export const DEFAULT_CONTENT: PortfolioContent = {
  name: "Pheap Physa",
  role: "HR Officer & IT Recruiter Executive",
  location: "Phnom Penh, Cambodia",
  heroEyebrow: "HR · IT Recruitment · People Operations",
  headline: "People,\ntalent &\ntechnology.",
  intro: "Hello, I’m Physa — an HR Officer and IT Recruiter Executive in Cambodia with more than four years of experience at Jobify. I support recruitment, HR operations, administration, and digital recruiting.",
  aboutTitle: "Helping people and organizations move forward.",
  aboutBody: "Since 14 September 2021, I’ve supported end-to-end recruitment and HR administration at Jobify. I enjoy connecting people with opportunities, organizing people processes, and helping candidates, clients, and colleagues work well together.",
  highlights: [
    { title: "Find the right people", body: "IT recruitment from role briefing and candidate screening through interviews, offers, and onboarding." },
    { title: "Support the full journey", body: "Practical HR and administration for contracts, attendance, payroll coordination, and staff communication." },
    { title: "Build trusted partnerships", body: "Thoughtful coordination between clients, candidates, and teams to keep work moving with care." },
  ],
  experienceTitle: "Supporting people from first search to everyday HR.",
  experienceIntro: "My experience combines talent sourcing, recruitment coordination, employee administration, and digital tools for people operations.",
  company: "Jobify (Cambodia) Co., Ltd.",
  jobTitle: "HR Officer & IT Recruiter Executive",
  jobPeriod: "14 September 2021 – Present",
  jobResponsibilities: [
    "Source and screen candidates for IT and non-IT roles; introduce qualified people to clients.",
    "Coordinate interviews and follow up with clients and candidates throughout hiring.",
    "Maintain employee records and prepare attendance, payroll, onboarding, and staff documents.",
    "Prepare offer letters, contracts, service agreements, NDAs, MOUs, and internal policies.",
    "Support NSSF processing, payroll posting in Odoo, and HR reports.",
  ],
  digitalTitle: "People processes, powered by good tools.",
  digitalIntro: "Practical support that keeps candidates, teams, and information connected.",
  digitalTasks: [
    "Manage job postings and company social channels, including Telegram.",
    "Create recruitment posters and job lists using Canva, Adobe tools, and CapCut.",
    "Store CVs and team records in Google Drive; support weekly and monthly reporting.",
    "Use digital platforms for sourcing, candidate communication, and HR administration.",
  ],
  skillsTitle: "Organized, people-focused, and comfortable with tech.",
  skillsIntro: "The capabilities I bring to daily work and long-term partnerships.",
  skills: [
    "IT & non-IT recruitment", "Talent hunting", "Candidate screening", "Interview coordination",
    "HR operations", "Employee records", "Onboarding & training", "Payroll & attendance",
    "NSSF processing", "Contracts & policies", "AI tools", "Social media management",
    "Canva, Adobe & CapCut", "Microsoft Office", "Odoo & Google Drive",
    "Telegram channel management", "English & Khmer", "Communication & teamwork",
    "Adaptability & problem solving",
  ],
  educationTitle: "A technology foundation.",
  educationIntro: "A computer science background helps me understand technical roles and communicate across people and technology teams.",
  education: [
    { degree: "Bachelor of Science in Computer Science", institution: "Royal University of Phnom Penh", period: "2019–2023" },
    { degree: "English Literature", institution: "The University of Cambodia", period: "2019–2020" },
    { degree: "General English Program · GEP 6", institution: "Spring Education Center", period: "Training" },
  ],
  training: [
    { name: "Effective HR Management", provider: "SMEs Technical Training Program · Phnom Penh", period: "October 2025" },
  ],
  contactTitle: "Good people make great work.",
  contactBody: "For recruitment, HR collaboration, or a professional introduction, feel free to reach out. I’d be glad to hear from you.",
  email: "pheapphysa@gmail.com",
  phone: "096 2625 072",
  linkedin: "https://www.linkedin.com/in/pheapphysa/",
  telegram: "https://t.me/pheapphysa",
  photoUrl: "/assets/physa-profile.jpg",
  cvUrl: "/assets/Pheap-Physa-CV.pdf",
  theme: { paper: "#f5f3ef", ink: "#173042", accent: "#ed9b77" },
};

export function normalizeContent(value: unknown): PortfolioContent {
  if (!value || typeof value !== "object") return DEFAULT_CONTENT;
  const candidate = value as Partial<PortfolioContent>;
  return {
    ...DEFAULT_CONTENT,
    ...candidate,
    highlights: Array.isArray(candidate.highlights) ? candidate.highlights : DEFAULT_CONTENT.highlights,
    jobResponsibilities: Array.isArray(candidate.jobResponsibilities) ? candidate.jobResponsibilities : DEFAULT_CONTENT.jobResponsibilities,
    digitalTasks: Array.isArray(candidate.digitalTasks) ? candidate.digitalTasks : DEFAULT_CONTENT.digitalTasks,
    skills: Array.isArray(candidate.skills) ? candidate.skills : DEFAULT_CONTENT.skills,
    education: Array.isArray(candidate.education) ? candidate.education : DEFAULT_CONTENT.education,
    training: Array.isArray(candidate.training) ? candidate.training : DEFAULT_CONTENT.training,
    theme: { ...DEFAULT_CONTENT.theme, ...(candidate.theme ?? {}) },
  };
}
