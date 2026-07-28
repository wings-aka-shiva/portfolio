export interface Interest {
  id: string;
  emoji: string;
  category: string;
  headline: string;
  detail: string;
  /** Hex color used for the hover glow, badge, and border accent */
  glowColor: string;
}

export const interests: Interest[] = [
  {
    id: "travel",
    emoji: "🌏",
    category: "Travel & Adventure",
    headline: "Chasing beaches, conquering trails.",
    detail: "",
    glowColor: "#06b6d4",
  },
  {
    id: "reading",
    emoji: "📚",
    category: "Reading",
    headline: "Always mid-novel.",
    detail: "",
    glowColor: "#4f46e5",
  },
  {
    id: "football",
    emoji: "⚽",
    category: "Football",
    headline: "Weekend warrior, local club regular.",
    detail: "Playing for Redbacks FC - left foot still a work in progress.",
    glowColor: "#22c55e",
  },
  {
    id: "guitar",
    emoji: "🎸",
    category: "Guitar",
    headline: "Six strings, zero calluses.",
    detail: "Learning one chord at a time. Literally.",
    glowColor: "#f59e0b",
  },
  {
    id: "food-cultures",
    emoji: "🍜",
    category: "Food & Cultures",
    headline: "One cuisine at a time.",
    detail: "Embracing cultures through food - every new dish is a new world.",
    glowColor: "#f59e0b",
  },
  {
    id: "language",
    emoji: "🌸",
    category: "Language Learning",
    headline: "Some things are worth learning from scratch.",
    detail:
      "They say the best way to understand a culture is to speak its language. I'm starting from こんにちは.",
    glowColor: "#f43f5e",
  },
];
