import { workExperience, type WorkAward } from "./work-experience";

export type Track = "tech" | "life";

export interface TimelineEntry {
  id: string;
  track: Track;
  /** "YYYY-MM", used for sorting and year grouping. Month 01 where only the year is known. */
  start: string;
  role: string;
  /** Short name used on the timeline */
  org: string;
  orgFull: string;
  /** Display string, e.g. "Jul - Nov 2026" */
  dates?: string;
  showOnHome: boolean;
  /** Tech cards on /experience */
  bullets?: string[];
  tech?: string[];
  award?: WorkAward | null;
  link?: { to: string; label: string };
  /** Life cards on /experience: one line */
  text?: string;
}

const kekaAward = workExperience.find((w) => w.id === "keka")?.highlight ?? null;

export const timeline: TimelineEntry[] = [
  {
    id: "woolworths",
    track: "life",
    start: "2026-10",
    role: "Team Member",
    org: "Woolworths",
    orgFull: "Woolworths",
    dates: "Oct 2026 - now",
    showOnHome: true,
    text: "Talking to anyone, and stepping in wherever help is needed.",
  },
  {
    id: "rmit-hackathon-2026",
    track: "tech",
    start: "2026-10",
    role: "Team Lead, Team ULTRON",
    org: "RMIT Hackathon 2026",
    orgFull: "RMIT Hackathon 2026",
    dates: "22-23 Oct 2026",
    showOnHome: false,
    bullets: [
      "Ran selection across 5 proposals, supervised the Guardian Circle build and gave the pitch and live demo.",
      "Coordinated XLM-RoBERTa and mmBERT fine-tuning to a team-best 0.96660 on Kaggle.",
    ],
    tech: ["Next.js", "TypeScript", "TideCloak", "MCP", "XLM-RoBERTa", "mmBERT"],
    link: { to: "/hackathons", label: "see the build →" },
  },
  {
    id: "fsanz",
    track: "tech",
    start: "2026-07",
    role: "Software Engineer",
    org: "FSANZ",
    orgFull: "Food Systems Collective · RMIT industry project",
    dates: "Jul - Nov 2026",
    showOnHome: true,
    bullets: [
      "Indexed the Food Standards Code into 3,163 citation-ready chunks and built the retrieval pipeline: multi-query expansion, Reciprocal Rank Fusion, Pinecone, AWS Bedrock.",
      "Built Cognito sign-in with single-flight token refresh, so users never saw an expired-token error.",
      "Designed the 3-status, 6-reason-code result model the whole team built against.",
      "Led the product side with the client and reviewed all FastAPI backend code.",
    ],
    tech: ["React", "TypeScript", "Python", "FastAPI", "AWS Bedrock", "Pinecone"],
    link: { to: "/work/fsanz-regulatory-assistant", label: "read the case study →" },
  },
  {
    id: "peer-mentor",
    track: "life",
    start: "2026-01",
    role: "Peer Mentor",
    org: "Algorithms and Analysis, RMIT",
    orgFull: "RMIT University",
    dates: "2026",
    showOnHome: false,
    text: "Peer mentor for students taking Algorithms and Analysis.",
  },
  {
    id: "coding-community",
    track: "life",
    start: "2026-01",
    role: "Founder",
    org: "student coding community, RMIT",
    orgFull: "RMIT University",
    showOnHome: false,
    text: "Students team up for competitions, share what they've learned, and grow together.",
  },
  {
    id: "student-union",
    track: "life",
    start: "2026-01",
    role: "Volunteer",
    org: "RMIT Student Union",
    orgFull: "RMIT University Student Union",
    showOnHome: false,
  },
  {
    id: "redbacks",
    track: "life",
    start: "2026-01",
    role: "Right back",
    org: "Redbacks F.C.",
    orgFull: "Redbacks F.C.",
    dates: "weekends",
    showOnHome: false,
  },
  {
    id: "coles",
    track: "life",
    start: "2025-07",
    role: "Stocktake",
    org: "Coles",
    orgFull: "Coles",
    dates: "Jul 2025 - Sep 2026",
    showOnHome: true,
    text: "Stocktaking across many Coles stores.",
  },
  {
    id: "iffa",
    track: "tech",
    start: "2025-03",
    role: "IT Developer Intern",
    org: "IFFA",
    orgFull: "International Film Festival of Australia",
    dates: "Mar - Jun 2025",
    showOnHome: true,
    bullets: [
      "Led 4 frontend developers building React sites for 3 IFFA Awards clients: a gym and fitness brand, an inner health and yoga studio, and a juice shop in Windsor.",
      "Set up the shared architecture and a reusable component library, so all 3 sites shipped on deadline.",
    ],
    tech: ["React", "JavaScript"],
  },
  {
    id: "moved-to-melbourne",
    track: "life",
    start: "2025-01",
    role: "Moved to Melbourne",
    org: "",
    orgFull: "",
    dates: "2025",
    showOnHome: false,
    text: "Left a job I loved in Hyderabad, joined a social soccer club, and rode random trams to see where they went.",
  },
  {
    id: "keka",
    track: "tech",
    start: "2023-05",
    role: "Associate Software Engineer",
    org: "KEKA",
    orgFull: "Keka Technologies · Hyderabad",
    dates: "May 2023 - Dec 2024",
    showOnHome: true,
    bullets: [
      "Founding engineer on the KEKA Marketplace and its only frontend engineer: architected the Angular app from scratch.",
      "Brought about 7 third-party integrations live with product, design, cloud and backend teams.",
      "Part of the 30+ developer team that cut build time from over 30 minutes to under 1 minute.",
      "Cut post-deployment bugs by 30% with code review standards and proactive testing.",
    ],
    tech: ["Angular", "TypeScript", "Azure DevOps", "MySQL"],
    award: kekaAward,
  },
  {
    id: "late-deploys",
    track: "life",
    start: "2023-05",
    role: "Late deploys and table tennis",
    org: "KEKA",
    orgFull: "Keka Technologies",
    dates: "May 2023 - Dec 2024",
    showOnHome: false,
    text: "Friends with the security staff from waiting on pipelines to pass.",
  },
  {
    id: "codechef",
    track: "life",
    start: "2021-07",
    role: "Board Committee",
    org: "CodeChef SNIST",
    orgFull: "CodeChef Chapter, SNIST",
    dates: "Jul 2021 - May 2023",
    showOnHome: true,
    text: "Set contest problems and ran workshops. Went from wanting to code to helping others do it.",
  },
];

/** Newest start first; Array.prototype.sort is stable, so ties keep data order. */
export const timelineNewestFirst = [...timeline].sort((a, b) => b.start.localeCompare(a.start));

export const homeTimeline = timelineNewestFirst.filter((e) => e.showOnHome);

export interface TimelineYear {
  year: string;
  tech: TimelineEntry[];
  life: TimelineEntry[];
}

export const timelineByYear: TimelineYear[] = timelineNewestFirst.reduce<TimelineYear[]>((years, entry) => {
  const year = entry.start.slice(0, 4);
  let group = years.find((y) => y.year === year);
  if (!group) {
    group = { year, tech: [], life: [] };
    years.push(group);
  }
  group[entry.track].push(entry);
  return years;
}, []);
