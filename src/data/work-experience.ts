import iffaLogo from "../assets/iffaawards.png";
import kekaLogo from "../assets/keka.svg";

export type EntryType = "Full Time" | "Internship" | "Contract" | "industry-project";

export interface WorkAward {
  title: string;
  praisedBy: string;
  date: string;
  description: string;
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: EntryType;
  /** Logo image URL; null falls back to an initials tile */
  logo: string | null;
  websiteUrl?: string;
  tech: string[];
  bullets: string[];
  highlight: WorkAward | null;
  isCurrent: boolean;
}

// Newest first - the timeline renders in this order.
export const workExperience: WorkEntry[] = [
  {
    id: "fsanz",
    company: "Food Systems Collective",
    role: "Software Engineer",
    location: "RMIT Industry Project",
    period: "Jul 2026 - Nov 2026",
    type: "industry-project",
    tech: ["React 18", "TypeScript", "Python", "FastAPI", "AWS Bedrock", "Pinecone", "PostgreSQL", "GitHub Actions"],
    bullets: [
      "Indexed the full Food Standards Code into 3,163 citation-ready chunks and built the retrieval pipeline: multi-query expansion, Reciprocal Rank Fusion and Pinecone search, with generation on AWS Bedrock.",
      "Built Amazon Cognito sign-in with single-flight token refresh and automatic request replay in React 18, so users never saw an expired-token error.",
      "Designed the 3-status, 6-reason-code compliance result model that became the shared contract across the team.",
      "Led the product side with the client, ran Scrum in Jira and reviewed all FastAPI backend code.",
    ],
    highlight: null,
    logo: null,
    isCurrent: false,
  },
  {
    id: "iffa",
    company: "International Film Festival of Australia",
    role: "IT Developer",
    location: "Melbourne, VIC",
    period: "Mar 2025 - Jun 2025",
    type: "Internship",
    logo: iffaLogo,
    websiteUrl: "https://www.iffa.com.au/",
    tech: ["React", "JavaScript"],
    bullets: [
      "Led a team of 4 FE developers; architected the festival's production React app from scratch (routing, service layer, dependency management)",
      "Delivered on deadline with a reusable component library and service-based data patterns",
    ],
    highlight: null,
    isCurrent: false,
  },
  {
    id: "keka",
    company: "Keka Technologies",
    role: "Associate Software Engineer",
    location: "Hyderabad, India",
    period: "May 2023 - Dec 2024",
    type: "Full Time",
    logo: kekaLogo,
    websiteUrl: "https://www.keka.com/",
    tech: ["Angular", "TypeScript", "Azure DevOps", "MySQL"],
    bullets: [
      "Built the KEKA Marketplace single-handedly as the only FE engineer, architecting the standalone Angular app from scratch: ~10-15 listed apps, ~7 live integrations",
      "Part of the 30+ dev frontend team that cut build time from 30+ minutes to under 1 minute (NgModule → Angular Standalone migration)",
      "Reduced post-deployment bugs 30% through code review standards and proactive testing",
    ],
    highlight: {
      title: "Above & Beyond Award",
      praisedBy: "Shubham Shukla, PM",
      date: "19 Feb 2024",
      description: "To the person who is beyond the expectations.",
    },
    isCurrent: false,
  },
];
