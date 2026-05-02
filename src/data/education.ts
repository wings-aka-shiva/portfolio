export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startYear: number;
  endYear: number | "Present";
  status: "completed" | "ongoing";
  clubs: string[];
}

export const education: Education[] = [
  {
    id: "rmit",
    institution: "Royal Melbourne Institute of Technology",
    degree: "Master of Information Technology",
    field: "Information Technology",
    location: "Melbourne, AU",
    startYear: 2025,
    endYear: 2026,
    status: "ongoing",
    clubs: ["CSIT", "Microsoft Enthusiasts Club", "Matrix"],
  },
  {
    id: "sreenidhi",
    institution: "Sreenidhi Institute of Science & Technology",
    degree: "Bachelor of Computer Science & Engineering",
    field: "Computer Science & Engineering",
    location: "Hyderabad, IN",
    startYear: 2019,
    endYear: 2023,
    status: "completed",
    clubs: ["CodeChef", "Sports (Football)"],
  },
];
