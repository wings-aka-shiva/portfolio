export interface LiminalPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  lines: string[];
}

export const liminalPosts: LiminalPost[] = [
  {
    id: "1",
    title: "Open Secret",
    slug: "open-secret",
    date: "June 2026",
    lines: [
      "To ask you out, but never mean to show it off",
      "To tell you all, but not for you to feel me small",
      "To hold you close, but never say a word",
      "To kiss you deep, and let the silence keep",
      "",
      "To live the best, and not drag the rest",
      "To exist in what we hold, rather than what words can hold",
      "To pull you near, and keep it unclear",
      "To walk hand in hand, but never quite meet your eyes",
      "",
      "To pull away when it starts to show",
      "To hold back, When I am about to crack",
      "To laugh it off, when our eyes say what we don't",
      "To stay an open secret, never to be unwrapped",
      "",
      "You know you are all I see",
      "I know I am all you seek",
      "Yet we play mute, and let our gestures speak",
      "The loudest silence, in the words we never breathe",
      "",
      "Coz I don't want us to turn normal",
      "The normal that ruins ' OUR ' special",
    ],
  },
];
