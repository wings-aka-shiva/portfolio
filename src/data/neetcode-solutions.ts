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
  learned?: string | string[];
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
  3: {
    id: 3,
    day: 2,
    lcNumber: 1,
    tc: "O(n)",
    summary:
      "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Exactly one solution exists.",
    approach: [
      {
        label: "First thought",
        text: "For each number, scan the rest of the array for `target - num`. That's O(n²), a nested loop checking every pair.",
      },
      {
        label: "The bottleneck",
        text: "The inner scan. For every element, we're asking \"does `target - num` exist?\" That's a lookup problem.",
      },
      {
        label: "Build a dict as you go",
        text: "For each number, check if its complement (`target - num`) is already in the dict. If yes, return both indices. If no, store `{num: index}` and move on. One pass, done.",
      },
      {
        label: "Why one pass works",
        text: "By the time you reach the second number of the pair, the first is already stored. You never use the same element twice because you check before storing.",
      },
      {
        label: "Complexity",
        text: "O(n) time, O(n) space.",
      },
    ],
    insight:
      "Turn \"does `target - num` exist?\" into a dict lookup: store each number with its index as you go, and the pair shows up in a single pass.",
    language: "python",
    code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pair_sum = dict()
        for i, num in enumerate(nums):
            if target - num in pair_sum:
                return [pair_sum[target - num], i]
            pair_sum[num] = i`,
    learned:
      "`enumerate(nums)` gives you both index and value, no need for `range(len(nums))` and manual indexing.",
    gotchas: [
      "Check before you store. If you put `num` in the dict first, a number that's exactly half the target matches itself: `nums = [3, 2, 4]`, `target = 6` would return `[0, 0]`.",
      "Don't sort. Sorting plus two pointers loses the original indices, and the problem asks for indices, not values.",
    ],
  },
  4: {
    id: 4,
    day: 2,
    lcNumber: 49,
    tc: "O(n · k)",
    summary:
      "Given an array of strings `strs`, group the anagrams together. Return them as a list of lists, in any order.",
    approach: [
      {
        label: "First thought",
        text: "Anagrams are the same word when sorted. So sort each word and use it as a dict key: all words sharing that key are anagrams. Group them together.",
      },
      {
        label: "Pushing further",
        text: "Sorting each word costs O(k log k). But we already know from Valid Anagram that comparing character counts works. A 26-slot count array for each word is O(k). Convert it to a tuple (lists can't be dict keys, they're mutable) and use that as the key instead. Saves the log k factor.",
      },
      {
        label: "Complexity",
        text: "O(n · k) time, O(n · k) space, where n is the number of strings and k is the max string length.",
      },
    ],
    insight:
      "We don't need the actual sorted string, just a fingerprint that's identical for all anagrams. A tuple of character counts is that fingerprint.",
    language: "python",
    code: `# from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        grouped = defaultdict(list)

        for word in strs:
            char_count = [0] * 26
            for letter in word:
                char_count[ord(letter) - ord('a')] += 1
            grouped[tuple(char_count)].append(word)

        return list(grouped.values())`,
    learned: [
      "`defaultdict(list)` auto-creates an empty list for new keys, no if/else needed.",
      "Strings are iterable: `for letter in word` works directly, no need for `list(word)`.",
    ],
    gotchas: [
      "Lists are mutable, so they can't be dict keys (`TypeError: unhashable type: 'list'`). Tuples are immutable, so they can. That's why the count goes through `tuple()`.",
      "Lists use `.append()`, not `.add()`. Sets use `.add()`.",
      "An empty string still gets a key: its count is all zeros, so `[\"\"]` returns `[[\"\"]]`.",
    ],
  },
  5: {
    id: 5,
    day: 2,
    lcNumber: 347,
    tc: "O(n)",
    summary: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
    approach: [
      {
        label: "First thought",
        text: "Count frequencies with a dict, sort by frequency descending, take the first `k`. But sorting is O(n log n), and the follow-up asks us to beat that.",
      },
      {
        label: "The bottleneck",
        text: "Sorting. We need the top k by frequency without sorting.",
      },
      {
        label: "Bucket sort by frequency",
        text: "The maximum frequency any element can have is `n` (the array length). That's a bounded range, which means we can use bucket sort. Create a list of length `n + 1` where each index represents a frequency. Drop each number into the bucket matching its count. Then walk from the end (highest frequency) and collect until we have `k` elements.",
      },
      {
        label: "Complexity",
        text: "O(n) time, O(n) space.",
      },
    ],
    insight:
      "Frequencies can't exceed n, so use them as indices: bucket each number by its count, then walk from the highest bucket down until you have k.",
    language: "python",
    code: `from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        nums_count = Counter(nums)

        bucket_sort = [[] for _ in range(len(nums) + 1)]

        for num, count in nums_count.items():
            bucket_sort[count].append(num)

        k_freq_ele = []

        for key_list in bucket_sort[::-1]:
            if len(key_list):
                for key in key_list:
                    k_freq_ele.append(key)
                    k -= 1
                    if not k:
                        return k_freq_ele`,
    learned: [
      "`Counter(nums)` is a dict subclass that counts elements in one line, and returns 0 for missing keys instead of crashing.",
      "`not k` is Python's equivalent of `!k`.",
    ],
    gotchas: [
      "`[[] for _ in range(n)]` creates `n` independent lists. `[[]] * n` creates `n` pointers to the same list, so appending to one bucket appends to all of them.",
      "`.append()` is for lists, `.add()` is for sets. Mixing them up is a common early mistake.",
    ],
  },
  7: {
    id: 7,
    day: 2,
    lcNumber: 238,
    tc: "O(n)",
    summary:
      "Given an integer array `nums`, return an array where each element is the product of all the other elements. No division allowed, and it must run in O(n) time.",
    approach: [
      {
        label: "First thought",
        text: "Every idea I had involved division: total product divided by each element. But the constraint explicitly bans division. That leaves prefix and suffix products.",
      },
      {
        label: "Prefix × suffix",
        text: "For any index `i`, the answer is `(product of everything left of i) × (product of everything right of i)`. Two independent halves, no division needed.",
      },
      {
        label: "Using the output array",
        text: "The output array doesn't count as extra space. So build the suffix products into the output array first, then walk left to right with a single running prefix variable, multiplying it into each position.",
      },
      {
        label: "Key detail",
        text: "When building the suffix, append `prod` before multiplying, because we want the product of everything to the right, excluding the current element. Starting `prod` at 1 handles the last element naturally (nothing to its right).",
      },
      {
        label: "Complexity",
        text: "O(n) time. The approach needs only O(1) extra space (output array not counted), but this version uses O(n) extra because `nums[::-1]` and `suffix_prods[::-1]` each make a copy.",
      },
    ],
    insight:
      "For any index i, the answer is the product of everything to its left times the product of everything to its right. Two independent halves, no division needed.",
    language: "python",
    code: `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        suffix_prods = list()
        prod = 1

        for num in nums[::-1]:
            suffix_prods.append(prod)
            prod *= num

        suffix_prods = suffix_prods[::-1]
        prod = 1

        for ind in range(len(nums)):
            suffix_prods[ind] *= prod
            prod *= nums[ind]

        return suffix_prods`,
    learned: [
      "`nums[::-1]` reverses a list in one line without mutating the original, unlike `.reverse()`.",
      "Append before multiply vs after multiply changes whether the current element is included. That matters a lot for prefix/suffix problems.",
    ],
    gotchas: [
      "Slicing copies. `nums[::-1]` builds a whole new list, so it costs O(n) memory. For true O(1) extra space, loop with `reversed(nums)` (a lazy iterator, no copy) and fill the output by index instead of appending and reversing.",
    ],
  },
};

export function getSolution(id: number): NeetCodeSolution | undefined {
  return neetcodeSolutions[id];
}
