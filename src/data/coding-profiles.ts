import leetcodeIcon  from "../assets/leetcode.svg";
import hackerrankIcon from "../assets/hackerrank.svg";
import codechefIcon   from "../assets/codechef.svg";

// Codeforces has no local asset — using the same source as the original component
const codeforcesIcon =
  "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo.png";

export interface CodingProfile {
  id: string;
  platform: string;
  username: string;
  tagline: string;
  icon: string;
  profileUrl: string | null; // null = coming soon
}

export const codingProfiles: CodingProfile[] = [
  {
    id: "hackerrank",
    platform: "HackerRank",
    username: "@wingsAkaShiva",
    tagline: "Where it all started",
    icon: hackerrankIcon,
    profileUrl: "https://www.hackerrank.com/profile/wingsAkaShiva",
  },
  {
    id: "leetcode",
    platform: "LeetCode",
    username: "@shiva_flyin",
    tagline: "Daily practice",
    icon: leetcodeIcon,
    profileUrl: "https://leetcode.com/u/shiva_flyin/",
  },
  {
    id: "codeforces",
    platform: "Codeforces",
    username: "@wings_tales",
    tagline: "Competitive rounds",
    icon: codeforcesIcon,
    profileUrl: "https://codeforces.com/profile/wings_tales",
  },
  {
    id: "codechef",
    platform: "CodeChef",
    username: "—",
    tagline: "Coming soon",
    icon: codechefIcon,
    profileUrl: null,
  },
];
