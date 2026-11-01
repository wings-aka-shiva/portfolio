export type RepoInfo =
  | { visibility: "public"; url: string }
  | { visibility: "private"; owner: "RMIT org repo" | "Client project" | "Personal" };

export type Project = {
  id: string;
  title: string;
  context: string;
  year: string;
  category: "AI" | "Cloud" | "Backend" | "Full stack" | "Algorithms" | "Data";
  summary: string;
  /** Exactly 2, each with a number */
  highlights: [string, string];
  stack: string[];
  repo: RepoInfo;
};

export const projects: Project[] = [
  {
    id: "music-subscription-aws",
    title: "Music Subscription App on AWS",
    context: "RMIT Cloud Computing",
    year: "2026",
    category: "Cloud",
    summary: "The same music-subscription API deployed three ways on AWS: Flask on EC2, Docker on ECS Fargate, and Lambda behind API Gateway.",
    highlights: [
      "Designed a DynamoDB composite key from a cardinality analysis that cut import overwrites from 6 to 0.",
      "Added a GSI and an LSI so searches use indexed queries instead of full-table scans, and kept 71 artist images private behind pre-signed S3 URLs.",
    ],
    stack: ["Python", "Flask", "DynamoDB", "S3", "Lambda", "API Gateway", "ECS Fargate", "Docker"],
    repo: { visibility: "private", owner: "RMIT org repo" },
  },
  {
    id: "smart-bookmark-cli",
    title: "Smart Bookmark CLI",
    context: "Personal project",
    year: "2026",
    category: "AI",
    summary: "A terminal tool that turns any webpage into a tagged, searchable summary using the Claude API.",
    highlights: [
      "Parsed Claude responses into type-safe TypeScript interfaces with structured JSON and few-shot prompting.",
      "Added retries and error handling so LLM output is safe to store and search.",
    ],
    stack: ["Node.js", "TypeScript", "Claude API", "Cheerio", "Commander.js"],
    repo: { visibility: "public", url: "https://github.com/wings-aka-shiva/smart-bookmark" },
  },
  {
    id: "mcba-banking",
    title: "MCBA Internet Banking",
    context: "RMIT Web Development Technologies",
    year: "2025",
    category: "Full stack",
    summary: "A full internet banking site: deposits, withdrawals, transfers, statements and scheduled bill payments.",
    highlights: [
      "Wrapped every balance update in EF Core transactions and secured logins with PBKDF2-SHA256 (100,000 iterations).",
      "Built a .NET BackgroundService that catches up on missed bill payments after a restart, plus a JWT-secured admin Web API.",
    ],
    stack: ["C#", ".NET 9", "ASP.NET Core", "EF Core", "Azure SQL", "JWT", "Swagger"],
    repo: { visibility: "private", owner: "RMIT org repo" },
  },
  {
    id: "disease-outbreak",
    title: "Disease Outbreak Modelling",
    context: "RMIT Algorithms and Analysis",
    year: "2026",
    category: "Algorithms",
    summary: "Graph-based outbreak risk modelling and antiviral allocation.",
    highlights: [
      "Replaced a Monte Carlo baseline with a deterministic dynamic-programming solver, O(T x |E|), passing all 28 tests on both graph representations.",
      "Solved antiviral allocation as a 0/1 knapsack with memoisation and backtracking to recover the exact chosen set.",
    ],
    stack: ["Python", "Graphs", "Dynamic Programming", "Benchmarking"],
    repo: { visibility: "private", owner: "RMIT org repo" },
  },
  {
    id: "super-event",
    title: "The Super Event",
    context: "RMIT Advanced Programming",
    year: "2026",
    category: "Backend",
    summary: "A desktop event-booking app with live seat checks, checkout and an admin dashboard.",
    highlights: [
      "Built on MVC with a Singleton-managed SQLite connection, so carts, orders and seat counts stay consistent across logins and restarts.",
      "Hashed passwords and covered password, seat-availability and existence rules with JUnit tests.",
    ],
    stack: ["Java", "JavaFX", "SQLite", "JDBC", "JUnit"],
    repo: { visibility: "private", owner: "RMIT org repo" },
  },
  {
    id: "data-mining",
    title: "Data Mining: Models That Hold Up",
    context: "RMIT Data Mining",
    year: "2025",
    category: "Data",
    summary: "Benchmarking classifiers, ensembles and neural networks on real-world datasets, judged on the right metrics.",
    highlights: [
      "Cut classification error on a chronic-kidney-disease dataset from 37.5% to 1.0% by comparing 7 classifiers.",
      "Showed a J48 tree beat a tuned neural network on hypothyroid data, cutting error from 30.12% to 22.95%.",
    ],
    stack: ["Weka", "Random Forest", "AdaBoost", "MLP", "K-means"],
    repo: { visibility: "private", owner: "RMIT org repo" },
  },
];

/** Public repos first, then data order (Array.prototype.sort is stable). */
export const projectsPublicFirst: Project[] = [...projects].sort(
  (a, b) => Number(a.repo.visibility !== "public") - Number(b.repo.visibility !== "public")
);
