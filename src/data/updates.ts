import { neetcodeProblems } from "./neetcode-problems";
import { neetcodeSolutions } from "./neetcode-solutions";

export type UpdateType = "feature" | "blog" | "project";

export interface SiteUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  type: UpdateType;
  title: string;
  link?: string;
}

export const manualUpdates: SiteUpdate[] = [
  {
    id: "neetcode-unlock",
    date: "2026-11-19",
    type: "feature",
    title: "NeetCode map: every topic's first question is open, so I'm working through them side by side",
    link: "/blog/neetcode",
  },
  {
    id: "neetcode-python",
    date: "2026-11-19",
    type: "blog",
    title: "NeetCode write-ups are moving from Java to Python",
    link: "/blog/neetcode",
  },
];

const TYPE_ORDER: Record<UpdateType, number> = { project: 0, feature: 1, blog: 2 };

/** Local calendar date as YYYY-MM-DD. */
export function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function neetcodeAutoUpdates(): SiteUpdate[] {
  const byId = new Map(neetcodeProblems.map((p) => [p.id, p]));
  const byDate = new Map<string, { title: string; slug: string }[]>();

  for (const sol of Object.values(neetcodeSolutions)) {
    const problem = byId.get(sol.id);
    if (!problem) continue;
    const list = byDate.get(sol.date) ?? [];
    list.push({ title: problem.title, slug: problem.slug });
    byDate.set(sol.date, list);
  }

  return [...byDate.entries()].map(([date, items]) => {
    let title: string;
    if (items.length === 1) {
      title = `New NeetCode write-up: ${items[0].title}`;
    } else {
      const shown = items.slice(0, 3).map((i) => i.title);
      const rest = items.length - shown.length;
      const list =
        rest > 0
          ? `${shown.join(", ")} and ${rest} more`
          : `${shown.slice(0, -1).join(", ")} and ${shown[shown.length - 1]}`;
      title = `${items.length} new NeetCode write-ups: ${list}`;
    }
    return {
      id: `neetcode-${date}`,
      date,
      type: "blog" as const,
      title,
      link: items.length === 1 ? `/blog/neetcode/${items[0].slug}` : "/blog/neetcode",
    };
  });
}

export function getRecentUpdates(days = 14): SiteUpdate[] {
  const now = new Date();
  const today = toLocalISODate(now);
  const cutoff = toLocalISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - days));

  return [...manualUpdates, ...neetcodeAutoUpdates()]
    .filter((u) => u.date > cutoff && u.date <= today)
    .sort((a, b) =>
      a.date === b.date ? TYPE_ORDER[a.type] - TYPE_ORDER[b.type] : a.date < b.date ? 1 : -1,
    );
}
