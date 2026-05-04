export type CategoryStyle = "default" | "liminal";

export interface BlogCategory {
  id: string;
  emoji: string;
  name: string;
  caption: string;
  slug: string;
  live: boolean;
  postCount?: number;
  style: CategoryStyle;
}

export const blogCategories: BlogCategory[] = [
  {
    id: "neetcode",
    emoji: "🗺️",
    name: "NeetCode 150",
    caption: "150 problems. one map.",
    slug: "neetcode",
    live: true,
    postCount: 3,
    style: "default",
  },
  {
    id: "travel",
    emoji: "✈️",
    name: "Travelling",
    caption: "beaches, trails, and everything between",
    slug: "travel",
    live: false,
    style: "default",
  },
  {
    id: "ai",
    emoji: "🤖",
    name: "AI Journey",
    caption: "building, breaking, and learning — one model at a time",
    slug: "ai",
    live: true,
    postCount: 1,
    style: "default",
  },
  {
    id: "novels",
    emoji: "📖",
    name: "Novels",
    caption: "pages that stayed with me",
    slug: "novels",
    live: true,
    postCount: 35,
    style: "default",
  },
  {
    id: "food",
    emoji: "🍜",
    name: "Food",
    caption: "eating my way through everything",
    slug: "food",
    live: false,
    style: "default",
  },
  {
    id: "liminal",
    emoji: "🌌",
    name: "Liminal",
    caption: "unmoored",
    slug: "liminal",
    live: false,
    style: "liminal",
  },
];
