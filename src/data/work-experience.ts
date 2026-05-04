import iffaLogo from "../assets/iffaawards.png";
import kekaLogo from "../assets/keka.svg";

export type EmploymentType = "Full Time" | "Internship" | "Contract";

export interface WorkAward {
  title: string;
  praisedBy: string;
  date: string;
  description: string;
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  type: EmploymentType;
  logo: string;
  logoAlt: string;
  websiteUrl: string;
  highlights: string[];
  tags: string[];
  award?: WorkAward;
}

export const workExperience: WorkEntry[] = [
  {
    id: "iffa",
    company: "International Film Festival of Australia",
    role: "IT Developer",
    duration: "Mar 2025 – Jun 2025",
    location: "Melbourne, AU",
    type: "Internship",
    logo: iffaLogo,
    logoAlt: "IFFA logo",
    websiteUrl: "https://www.iffa.com.au/",
    highlights: [
      "Streamlined development workflow by moving all static data to service files and creating shared components, increasing development speed by over 50%.",
      "Implemented the entire project setup from scratch, configuring React, Bootstrap, and resolving all associated dependencies to ensure a seamless development environment.",
      "Managed a team of developers to accelerate project progress by 50% through effective leadership, task delegation, and fostering collaboration.",
    ],
    tags: ["React", "Bootstrap", "TypeScript", "Leadership"],
  },
  {
    id: "keka",
    company: "Keka Technologies",
    role: "Associate Software Engineer",
    duration: "May 2023 – Dec 2024",
    location: "Hyderabad, IN",
    type: "Full Time",
    logo: kekaLogo,
    logoAlt: "Keka logo",
    websiteUrl: "https://www.keka.com/",
    highlights: [
      "Played a pivotal role in developing the Keka Marketplace standalone application from scratch, architecting foundational features and implementing scalable modules.",
      "Transformed a modular application into a standalone architecture by refactoring file structures and optimising import dependency conventions, achieving a 70% reduction in build time.",
      "Implemented rigorous code review processes, reducing post-deployment bugs by 30% through proactive testing, refactoring, and quality assurance measures.",
    ],
    tags: ["React", "TypeScript", "Architecture", "Code Review"],
    award: {
      title: "Above & Beyond",
      praisedBy: "Shubham Shukla, Product Manager (Marketplace, Platform)",
      date: "19 Feb 2024",
      description: "To the person who is beyond the expectations.",
    },
  },
];
