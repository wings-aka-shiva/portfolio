export interface ApproachStep {
  label: string;
  text: string;
}

export interface NeetCodeSolution {
  id: number; // matches NeetCodeProblem.id
  day: number;
  lcNumber: number;
  tc: string; // time complexity, e.g. "O(n)"
  summary: string;
  approach: ApproachStep[];
  insight: string;
  language: "python";
  code: string;
  learned?: string;
  gotchas: string[];
}

export const neetcodeSolutions: Record<number, NeetCodeSolution> = {
  1: {
    id: 1,
    day: 1,
    lcNumber: 217,
    tc: "O(n)",
    summary:
      "Given an integer array `nums`, return `True` if any value appears at least twice, and `False` if every element is distinct.",
    approach: [
      {
        label: "Brute-force idea",
        text: "Compare every pair of elements using two nested loops checking `nums[i] == nums[j]` for all i < j. That's O(n^2) time, O(1) space. Way too slow for large inputs.",
      },
      {
        label: "Key observation",
        text: "If the array were sorted, duplicates would sit right next to each other, so one pass comparing adjacent elements would do it. That's O(n log n) for the sort plus O(n) for the scan, so O(n log n) overall. Better, but we're still paying for the sort. Since traversing all n elements at least once is unavoidable, the question becomes: can we check \"have I seen this number before?\" in O(1) per element? A set does exactly that. Both lookup and insertion are O(1) average.",
      },
      {
        label: "Chosen strategy",
        text: "Walk through the array once. At each element, check if it's already in a set. If yes, we found a duplicate, return `True` immediately. If no, add it to the set and move on. If we finish the loop without hitting a duplicate, return `False`.",
      },
      {
        label: "Complexity",
        text: "Time O(n), single pass with O(1) set operations per element. Space O(n), in the worst case (all unique) the set holds every element.",
      },
    ],
    insight:
      "When you need fast \"seen before?\" checks during a single traversal, a `set` turns an O(n^2) or O(n log n) problem into O(n).",
    language: "python",
    code: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        no_duplicates = set()
        for num in nums:
            if num in no_duplicates:
                return True
            no_duplicates.add(num)

        return False`,
    learned:
      "Python's `set` is a hash table under the hood, which is why membership checks are O(1) on average. It's the go-to when the core question is \"have I seen this before?\" during iteration. The pattern of \"iterate, check set, add to set\" comes up constantly in array and string problems.",
    gotchas: [
      "Empty array or single element: no duplicates possible, loop never triggers, returns `False` correctly.",
      "The early return on first duplicate means best case is O(1) if the first two elements match. We don't always pay for the full traversal.",
    ],
  },
  2: {
    id: 2,
    day: 1,
    lcNumber: 242,
    tc: "O(n)",
    summary: "Given two strings `s` and `t`, return `True` if `t` is an anagram of `s`.",
    approach: [
      {
        label: "First thought",
        text: "Sort both strings and compare. If they match, it's an anagram. Works, but that's O(n log n).",
      },
      {
        label: "The bottleneck",
        text: "Sorting is overkill. We don't need order, we need to know if both strings use the exact same characters the exact same number of times.",
      },
      {
        label: "Counting in 26 slots",
        text: "The constraint says lowercase English letters only, so there are just 26 possible characters. Create a list of length 26, where each index maps to a character via `ord(char) - ord('a')`. Increment for every character in `s`, decrement for every character in `t`. If everything lands back at zero, they're anagrams.",
      },
      {
        label: "Why not a set?",
        text: "A set only tracks presence, not count. `\"aab\"` and `\"abb\"` have the same set but aren't anagrams.",
      },
      {
        label: "Complexity",
        text: "O(n) time, O(1) space (fixed 26-slot list).",
      },
    ],
    insight:
      "Only 26 lowercase letters are possible, so a fixed list of counters replaces sorting: increment for `s`, decrement for `t`, and anagrams land back at all zeros.",
    language: "python",
    code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False

        occurrences = [0] * 26

        for char in s:
            occurrences[ord(char) - ord('a')] += 1

        for char in t:
            occurrences[ord(char) - ord('a')] -= 1

        for count in occurrences:
            if count:
                return False

        return True`,
    gotchas: ["`int(\"a\")` doesn't work like Java's implicit char cast. Use `ord()` to get the ASCII value."],
  },
};

export function getSolution(id: number): NeetCodeSolution | undefined {
  return neetcodeSolutions[id];
}
