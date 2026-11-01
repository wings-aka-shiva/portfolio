export interface Education {
  id: string;
  institution: string;
  /** Short name for compact rows, e.g. "RMIT" */
  short: string;
  degree: string;
  field: string;
  location: string;
  startYear: number;
  endYear: number | "Present";
  status: "completed" | "ongoing";
  clubs: string[];
  /** One-line relevance note shown on the card */
  note: string;
}

export const education: Education[] = [
  {
    id: "rmit",
    institution: "Royal Melbourne Institute of Technology",
    short: "RMIT",
    degree: "Master of Information Technology",
    field: "Information Technology",
    location: "Melbourne, AU",
    startYear: 2025,
    endYear: 2026,
    status: "ongoing",
    clubs: ["CSIT", "Microsoft Enthusiasts Club", "Matrix"],
    note: "Relevant: Cloud Computing, Algorithms, Data Mining, AI RAG project, Security",
  },
  {
    id: "sreenidhi",
    institution: "Sreenidhi Institute of Science & Technology",
    short: "SNIST",
    degree: "Bachelor of Computer Science & Engineering",
    field: "Computer Science & Engineering",
    location: "Hyderabad, IN",
    startYear: 2019,
    endYear: 2023,
    status: "completed",
    clubs: ["CodeChef", "Sports (Football)"],
    note: "CodeChef Chapter Board · Programming competitions",
  },
];

/** "2025 - Dec 2026" for ongoing study, "2019 - 2023" once completed */
export function educationPeriod(entry: Education): string {
  return `${entry.startYear} - ${entry.status === "ongoing" ? `Dec ${entry.endYear}` : entry.endYear}`;
}
