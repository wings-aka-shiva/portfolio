export type Hackathon = {
  id: string;
  name: string;
  theme: string;
  role: string;
  date: string;
  where: string;
  stat?: { value: string; label: string };
  builds: { title: string; challenge: string; body: string }[];
  stack: string[];
};

// Newest first - the first entry renders as the featured card.
export const hackathons: Hackathon[] = [
  {
    id: "rmit-hackathon-2026",
    name: "RMIT Hackathon 2026",
    theme: "Security x Generative AI x Low-Resource Languages",
    role: "Team Lead, Team ULTRON",
    date: "22-23 Oct 2026",
    where: "3 campuses: RMIT Melbourne, RMIT Vietnam, Taylor's University Malaysia",
    stat: { value: "0.96660", label: "Team-best Kaggle leaderboard score" },
    builds: [
      {
        title: "Guardian Circle",
        challenge: "Tide challenge",
        body: "A working prototype that blocks unilateral release of an older person's funds with TideCloak 2-of-3 signed approvals. I ran selection across 5 member proposals, supervised the Next.js + TypeScript build with Claude Code and Tide's MCP server, and gave the pitch and live demo to the judges.",
      },
      {
        title: "Low-resource language classifier",
        challenge: "Kaggle challenge",
        body: "Coordinated parallel fine-tuning of XLM-RoBERTa and mmBERT models on 2x T4 GPUs, including my own 512-token XLM-RoBERTa-large run, to a team-best 0.96660.",
      },
    ],
    stack: ["Next.js", "TypeScript", "TideCloak", "Docker", "MCP", "XLM-RoBERTa", "mmBERT", "Kaggle"],
  },
];
