export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;       // ISO date string
  readTime: number;   // minutes
  tags: string[];
  slug: string;
  published: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "typescript-stop-using-any",
    title: "Stop Using `any` — A Practical Guide to TypeScript's Type System",
    excerpt:
      "The `any` type is a trap. Every time you write `as any`, you're silently opting out of the safety TypeScript was built to give you. Here's how to replace your `any` habits with types that actually enforce contracts at the call site.",
    date: "2025-04-15",
    readTime: 6,
    tags: ["TypeScript", "Best Practices"],
    slug: "stop-using-any-typescript",
    published: false,
  },
  {
    id: "react-stop-useeffect-fetching",
    title: "Why I Stopped Writing useEffect for Data Fetching",
    excerpt:
      "The `useEffect` + `useState` combo for fetching data works until it doesn't — race conditions, stale closures, and duplicate requests that are painful to debug. There's a cleaner mental model, and it starts with thinking in async lifecycles, not side effects.",
    date: "2025-03-28",
    readTime: 8,
    tags: ["React", "Patterns"],
    slug: "stop-useeffect-data-fetching",
    published: false,
  },
  {
    id: "system-design-10x-traffic",
    title: "Designing for 10x Traffic: What Changes and What Doesn't",
    excerpt:
      "When a system needs to handle 10 times its current load, most engineers reach straight for horizontal scaling. The real work is identifying what breaks before you scale — and most of it isn't where you'd expect it to be.",
    date: "2025-02-10",
    readTime: 10,
    tags: ["System Design", "Backend"],
    slug: "designing-for-10x-traffic",
    published: false,
  },
];
