export interface Skill {
  name: string;
  /** What I reach for first; highlighted on the homepage */
  core?: boolean;
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
      { name: "TypeScript", core: true },
      { name: "Python", core: true },
      { name: "SQL", core: true },
      { name: "JavaScript" },
      { name: "C#", core: true },
      { name: "Java", core: true },
      { name: "C" },
      { name: "C++" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", core: true },
      { name: "Angular", core: true },
      { name: "Next.js", core: true },
      { name: "Tailwind CSS", core: true },
      { name: "React Router" },
      { name: "Vite" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaFX" },
    ],
  },
  {
    id: "backend",
    label: "Backend and APIs",
    skills: [
      { name: "Node.js", core: true },
      { name: "FastAPI", core: true },
      { name: "Flask", core: true },
      { name: "ASP.NET Core", core: true },
      { name: "Express.js" },
      { name: "Entity Framework Core" },
      { name: "REST API design" },
      { name: "JWT" },
      { name: "gunicorn" },
    ],
  },
  {
    id: "cloud-devops",
    label: "Cloud and DevOps",
    skills: [
      { name: "AWS", core: true },
      { name: "Docker", core: true },
      { name: "DynamoDB" },
      { name: "S3" },
      { name: "Lambda" },
      { name: "API Gateway" },
      { name: "EC2" },
      { name: "ECS Fargate" },
      { name: "ECR" },
      { name: "Cognito" },
      { name: "Bedrock" },
      { name: "CodeBuild" },
      { name: "GitHub Actions" },
      { name: "Linux" },
      { name: "Git" },
      { name: "Azure DevOps" },
    ],
  },
  {
    id: "ai-llm",
    label: "AI / LLM",
    skills: [
      { name: "RAG", core: true },
      { name: "Embeddings", core: true },
      { name: "Pinecone", core: true },
      { name: "Claude API", core: true },
      { name: "MCP", core: true },
      { name: "Fine-tuning", core: true },
      { name: "LangChain.js" },
      { name: "Deep learning" },
      { name: "Chunking" },
      { name: "Semantic search" },
      { name: "Reciprocal Rank Fusion" },
      { name: "LLM evaluation" },
      { name: "Multimodal (vision)" },
      { name: "Prompt engineering" },
      { name: "Structured output" },
      { name: "XLM-RoBERTa" },
      { name: "mmBERT" },
      { name: "Classical ML (Weka)" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    skills: [
      { name: "PostgreSQL", core: true },
      { name: "MySQL" },
      { name: "DynamoDB" },
      { name: "SQL Server / Azure SQL" },
      { name: "SQLite" },
      { name: "Pinecone (vector)" },
    ],
  },
  {
    id: "practices",
    label: "Practices",
    skills: [
      { name: "System design" },
      { name: "Unit testing (JUnit)" },
      { name: "Automated test suites" },
      { name: "Code review" },
      { name: "Agile/Scrum" },
      { name: "Jira" },
      { name: "Azure Boards" },
      { name: "AI-assisted development (Claude Code)" },
    ],
  },
  {
    id: "security",
    label: "Security",
    skills: [
      { name: "Cognito SRP" },
      { name: "JWT" },
      { name: "PBKDF2 hashing" },
      { name: "iptables" },
      { name: "Wireshark" },
      { name: "OpenSSL" },
      { name: "OWASP web vulnerabilities" },
    ],
  },
];

/**
 * Unique skill count across categories. Parenthetical notes are ignored, so
 * "Pinecone (vector)" counts as Pinecone; JWT and DynamoDB appear twice by name.
 */
export const uniqueSkillCount = new Set(
  skillCategories.flatMap((c) => c.skills.map((s) => s.name.replace(/\s*\(.*\)$/, "").toLowerCase()))
).size;

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
    title: "CodeChef Chapter SNIST - Board Member",
    issuer: "Sreenidhi Institute of Science & Technology",
    date: "Jul 2021 - May 2023",
    description: "Problem setter, tester and board member - promoted coding culture through workshops and competitions.",
  },
];
