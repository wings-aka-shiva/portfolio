export interface Skill {
  name: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Award {
  id: string;
  emoji: string;
  title: string;
  praisedBy?: string;
  issuer: string;
  date: string;
  description: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "C#" },
      { name: "Java" },
      { name: "Python" },
      { name: "C" },
      { name: "C++" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Tailwind CSS" },
      { name: "Bootstrap" },
      { name: "SignalR" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: ".NET 9" },
      { name: "REST API" },
      { name: "JWT" },
      { name: "BCrypt" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    skills: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
    ],
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    skills: [
      { name: "AWS" },
      { name: "Azure" },
      { name: "Docker" },
      { name: "Git" },
      { name: "Linux" },
    ],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    skills: [
      { name: "Claude API" },
      { name: "Prompt Engineering" },
      { name: "RAG" },
      { name: "LLM Integration" },
      { name: "Agents" },
      { name: "MCP" },
      { name: "LangChain.js" },
      { name: "Vercel AI SDK" },
    ],
  },
];

export const certifications: Certification[] = [
  {
    id: "aws-cloud-foundations",
    name: "AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services",
    date: "Nov 2021",
    credentialUrl: "https://www.credly.com/badges/d8d764c7-204e-4548-8dea-2424cf50399d",
  },
  {
    id: "aws-solutions-arch",
    name: "AWS Solutions Architecture Job Simulation",
    issuer: "Forage x AWS",
    date: "Jul 2025",
    credentialUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/pmnMSL4QiQ9JCgE3W/kkE9HyeNcw6rwCRGw_pmnMSL4QiQ9JCgE3W_JpYDn6xenraMkzS4o_1752764304935_completion_certificate.pdf",
  },
  {
    id: "deloitte-tech",
    name: "Deloitte Technology Job Simulation",
    issuer: "Forage x Deloitte",
    date: "Jul 2025",
    credentialUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_JpYDn6xenraMkzS4o_1752315831460_completion_certificate.pdf",
  },
  {
    id: "nsw-digital",
    name: "NSW Government Digital Job Simulation",
    issuer: "Forage x NSW Government",
    date: "Apr 2025",
    credentialUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/nppSEH2cXYTz95hL7/cyvjFvbkyoWcsFNhM_nppSEH2cXYTz95hL7_JpYDn6xenraMkzS4o_1745889011531_completion_certificate.pdf",
  },
];

export const awards: Award[] = [
  {
    id: "above-and-beyond",
    emoji: "🏆",
    title: "Above & Beyond",
    praisedBy: "Shubham Shukla, Product Manager (Marketplace, Platform)",
    issuer: "Keka Technologies",
    date: "19 Feb 2024",
    description: "To the person who is beyond the expectations.",
  },
  {
    id: "codechef-board",
    emoji: "📌",
    title: "CodeChef Chapter SNIST — Board Member",
    issuer: "Sreenidhi Institute of Science & Technology",
    date: "Jul 2021 – May 2023",
    description: "Problem setter, tester and board member — promoted coding culture through workshops and competitions.",
  },
];
