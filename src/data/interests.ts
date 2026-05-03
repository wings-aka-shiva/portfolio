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
    detail:
      "Vietnam this year. Mt Sturgeon last weekend. Working through every beach around Melbourne.",
    glowColor: "#06b6d4",
  },
  {
    id: "reading",
    emoji: "📚",
    category: "Reading",
    headline: "Always mid-novel.",
    detail: "Currently: Twisted Games by Ana Huang.",
    glowColor: "#4f46e5",
  },
  {
    id: "football",
    emoji: "⚽",
    category: "Football",
    headline: "Weekend warrior, local club regular.",
    detail: "Playing for Redbacks FC — left foot still a work in progress.",
    glowColor: "#22c55e",
  },
  {
    id: "guitar",
    emoji: "🎸",
    category: "Guitar",
    headline: "On a creative pause.",
    detail:
      "Learning guitar when life allows. The strings aren't going anywhere.",
    glowColor: "#f59e0b",
  },
];
