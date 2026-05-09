export interface TravelEntry {
  id: string;
  place: string;
  year: number;
  type: "international" | "hike" | "beach" | "city";
  highlight?: string;
}

export const travels: TravelEntry[] = [
  {
    id: "vietnam-2026",
    place: "Vietnam",
    year: 2026,
    type: "international",
  },
  {
    id: "mt-sturgeon-2026",
    place: "Mt Sturgeon",
    year: 2026,
    type: "hike",
  },
  {
    id: "melbourne-beaches",
    place: "Melbourne beaches",
    year: 2026,
    type: "beach",
    highlight: "working through all of them",
  },
];
