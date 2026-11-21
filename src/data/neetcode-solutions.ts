export interface ApproachStep {
  label: string;
  text: string;
}

export interface NeetCodeSolution {
  id: number; // matches NeetCodeProblem.id
  date: string; // ISO "YYYY-MM-DD"
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
    date: "2026-11-19",
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
    date: "2026-11-19",
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
        label: "Think of it as a tally sheet",
        text: "Walk through `s` and add one tally for each letter. Then walk through `t` and remove one tally for each letter. If the two are truly anagrams, every tally you added gets removed again, so every counter ends back at zero. Any leftover, positive or negative, means the letters didn't line up. Since there are only 26 lowercase letters, a 26-slot list is all we need. We map a letter to its slot with `ord(char) - ord('a')` ('a' → 0, 'b' → 1, and so on).",
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
    date: "2026-11-20",
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
    date: "2026-11-20",
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
    date: "2026-11-20",
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
    date: "2026-11-20",
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
        label: "Picture standing on element i",
        text: "Everything to your left, multiplied together, is one number. Everything to your right, multiplied together, is another. Multiply those two and you have the product of the whole array except the element you're standing on. No division needed, you just never include yourself.",
      },
      {
        label: "Using the output array",
        text: "The output array doesn't count as extra space. So build the suffix products into the output array first, then walk left to right with a single running prefix variable, multiplying it into each position.",
      },
      {
        label: "Key detail",
        text: "When building the suffix, store `prod` at index `i` before multiplying, because we want the product of everything to the right, excluding the current element. Starting `prod` at 1 handles the last element naturally (nothing to its right).",
      },
      {
        label: "Complexity",
        text: "O(n) time, O(1) extra space (output array not counted).",
      },
    ],
    insight:
      "For any index i, the answer is the product of everything to its left times the product of everything to its right. Two independent halves, no division needed.",
    language: "python",
    code: `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        suffix_prods = [1] * len(nums)
        prod = 1

        for i in range(len(nums) - 1, -1, -1):
            suffix_prods[i] = prod
            prod *= nums[i]

        prod = 1

        for ind in range(len(nums)):
            suffix_prods[ind] *= prod
            prod *= nums[ind]

        return suffix_prods`,
    learned: [
      "`range(len(nums) - 1, -1, -1)` walks the indices backwards without copying the list.",
      "Storing before multiplying vs after multiplying changes whether the current element is included. That matters a lot for prefix/suffix problems.",
    ],
    gotchas: [],
  },
  8: {
    id: 8,
    date: "2026-11-21",
    lcNumber: 36,
    tc: "O(1)",
    summary:
      "You're handed a Sudoku board, partly filled. You're not solving it, you're just the referee. Your only job: check that nobody has broken the rules so far. No repeated digit in any row, any column, or any 3×3 box.",
    approach: [
      {
        label: "Where most people start (and get stuck)",
        text: "The obvious instinct is \"let me check all the rows, then go back and check all the columns, then go back again for the boxes.\" That works, but you're walking the whole board three times. The moment you feel yourself scanning the same grid again and again, that's your signal there's a smarter way.",
      },
      {
        label: "The shift in thinking",
        text: "Every cell belongs to exactly one row, one column, and one box at the same time. So why not check all three the moment you land on a cell? Visit each cell once, and ask three questions right there: \"Have I seen this digit in this row before? This column? This box?\" If any answer is yes, the board's already broken, stop. If all three are no, remember this digit for its row, column, and box, then move on.",
      },
      {
        label: "What you need to remember things",
        text: "For each of the 9 rows you need a memory of \"digits seen so far.\" Same for the 9 columns, and the 9 boxes. A set is perfect for this: it's built to answer \"have I seen this already?\" instantly.",
      },
      {
        label: "The one genuinely tricky bit",
        text: "Rows and columns are easy: the cell at `(row, col)` obviously belongs to row `row` and column `col`. But which box? The boxes are numbered 0 to 8, left to right, top to bottom. The pattern that cracks it: divide the row and column by 3. `row // 3` tells you which band of boxes you're in (top, middle, bottom), and `col // 3` tells you which column of boxes. Stitch them together with `(row // 3) * 3 + (col // 3)` and you get the box number. Don't just memorize this: sketch the 9 boxes on paper and plug in a few cells until it clicks. That \"aha\" is worth more than the formula.",
      },
      {
        label: "Complexity",
        text: "The board is always 9×9, so this is effectively constant time and space.",
      },
    ],
    insight:
      "Every cell belongs to exactly one row, one column and one box, so check all three the moment you land on it: one pass, three sets of memory.",
    language: "python",
    code: `class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        rows_set = [set() for _ in range(9)]
        cols_set = [set() for _ in range(9)]
        sqrs_set = [set() for _ in range(9)]

        for row in range(len(board)):
            for col in range(len(board)):
                if board[row][col] == ".":
                    continue

                if board[row][col] in rows_set[row]:
                    return False
                rows_set[row].add(board[row][col])

                if board[row][col] in sqrs_set[(row // 3) * 3 + (col // 3)]:
                    return False
                sqrs_set[(row // 3) * 3 + (col // 3)].add(board[row][col])

                if board[row][col] in cols_set[col]:
                    return False
                cols_set[col].add(board[row][col])

        return True`,
    learned: ["`//` is integer division, the quiet hero behind the box-index formula."],
    gotchas: [
      "`set()` makes an empty set. Watch out: `{}` makes an empty dict, not a set.",
      "Sets use `.add()`, lists use `.append()`, but checking membership with `in` works the same for both.",
    ],
  },
  9: {
    id: 9,
    date: "2026-11-21",
    lcNumber: 128,
    tc: "O(n)",
    summary:
      "Given an unsorted array, return the length of the longest run of consecutive integers. Must run in O(n) time.",
    approach: [
      {
        label: "First thought",
        text: "Sort the array and scan for runs. But sorting is O(n log n), and the problem explicitly demands O(n). So sorting is off the table.",
      },
      {
        label: "Put everything in a set",
        text: "We need instant \"does this number exist?\" lookups. A set gives that in O(1). Convert the whole array to a set first, which also drops duplicates for free.",
      },
      {
        label: "The naive trap",
        text: "Now walk through and for each number keep checking `num + 1`, `num + 2`, and so on, counting the run. This works, but it's wasteful. If the array has `12, 13, 14, 15`, you'd count the full run starting from 13, then count almost the same run again starting from 12. For a long chain you re-walk the same numbers over and over, which can blow up toward O(n²).",
      },
      {
        label: "The fix that makes it O(n)",
        text: "Only start counting from the beginning of a sequence. How do you know a number is the beginning? If `num - 1` is not in the set, nothing comes before it, so it's a starting point. If `num - 1` is in the set, skip this number entirely, because its run will be counted when we reach the real start. This way each sequence is counted exactly once, and every number is touched at most twice overall.",
      },
    ],
    insight:
      "The whole game is \"only count from the start of a run.\" Checking `num - 1` is how you spot a start, and it's what turns a potential O(n²) into a clean O(n).",
    language: "python",
    code: `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        nums_set = set(nums)
        max_conseq = 0

        for num in nums_set:
            if num - 1 in nums_set:
                continue

            temp = num
            conseq = 0

            while temp in nums_set:
                temp += 1
                conseq += 1

            max_conseq = max(max_conseq, conseq)

        return max_conseq`,
    learned: [
      "`set(nums)` converts a whole list to a set in one line and drops duplicates for free.",
      "Iterate the set, not the list. Looping over `nums` re-processes every duplicate, and for an array full of repeats that pushes the work toward O(n²) and times out. Looping over `nums_set` visits each distinct value exactly once. Since the algorithm treats each number independently (it only queries the set by value, never by position), the set's lack of ordering doesn't matter at all.",
      "O(n) doesn't mean \"touch each element once.\" Here each number can be visited twice (once in the outer loop, once while walking a run), and that's still O(n) overall.",
    ],
    gotchas: [
      "The \"only start from a sequence head\" check is doing all the heavy lifting. Without it, the inner `while` loop re-counts overlapping runs and the solution silently degrades to O(n²).",
      "Iterating over the raw list instead of the set passes small cases but hits Time Limit Exceeded on inputs with heavy duplication. The set collapses those repeats.",
      "Empty array: the loop never runs, `max_conseq` stays 0, which is the correct answer.",
    ],
  },
};

export function getSolution(id: number): NeetCodeSolution | undefined {
  return neetcodeSolutions[id];
}
