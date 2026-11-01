import leetcodeIcon  from "../assets/leetcode.svg";
import hackerrankIcon from "../assets/hackerrank.svg";
import codechefIcon   from "../assets/codechef.svg";

// Codeforces has no local asset - using the same source as the original component
const codeforcesIcon =
  "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo.png";

export interface CodingProfile {
  id: string;
  platform: string;
  username: string;
  tagline: string;
  /** Optional until a local asset exists */
  icon?: string;
  profileUrl: string | null; // null = coming soon
  /** Kept in the data but not shown anywhere */
  hidden?: boolean;
  /** Shown as "[ coming soon ]" until the username and URL are filled in */
  comingSoon?: boolean;
}

// Order: LeetCode, HackerRank, then the rest. Fill in Kaggle's username and URL when ready.
export const codingProfiles: CodingProfile[] = [
  {
    id: "leetcode",
    platform: "LeetCode",
    username: "@shiva_flyin",
    tagline: "Daily practice",
    icon: leetcodeIcon,
    profileUrl: "https://leetcode.com/u/shiva_flyin/",
  },
  {
    id: "hackerrank",
    platform: "HackerRank",
    username: "@wingsAkaShiva",
    tagline: "Where it all started",
    icon: hackerrankIcon,
    profileUrl: "https://www.hackerrank.com/profile/wingsAkaShiva",
  },
  {
    id: "codeforces",
    platform: "Codeforces",
    username: "@wings_tales",
    tagline: "Competitive rounds",
    icon: codeforcesIcon,
    profileUrl: "https://codeforces.com/profile/wings_tales",
    hidden: true,
  },
  {
    id: "codechef",
    platform: "CodeChef",
    username: "-",
    tagline: "Coming soon",
    icon: codechefIcon,
    profileUrl: null,
  },
  {
    id: "kaggle",
    platform: "Kaggle",
    username: "-",
    tagline: "Coming soon",
    profileUrl: null,
    comingSoon: true,
  },
];
