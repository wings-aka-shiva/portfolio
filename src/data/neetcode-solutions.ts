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
  10: {
    id: 10,
    date: "2026-11-24",
    lcNumber: 125,
    tc: "O(n)",
    summary:
      "A phrase is a palindrome if, after lowercasing everything and stripping out all non-alphanumeric characters, it reads the same forwards and backwards. Return `True` if `s` is a palindrome, `False` otherwise.",
    approach: [
      {
        label: "The obvious first move",
        text: "Clean the string: lowercase it, drop everything that isn't a letter or digit, then check if the cleaned string equals its own reverse. That works, but it builds a whole new string just to throw it away after one comparison.",
      },
      {
        label: "Ask: do we even need the new string?",
        text: "The cleaning was only ever a means to an end: comparing the two ends. So skip the middleman. Keep two pointers, one at the front and one at the back of the original string, and compare as you walk them inward.",
      },
      {
        label: "Handling the junk characters",
        text: "The catch is that the original string still has spaces, commas, colons. So before each comparison, nudge each pointer past any non-alphanumeric character. The front pointer moves right, the back pointer moves left, until both land on real characters. Then compare them (lowercased). If they ever disagree, it's not a palindrome, return `False` immediately. Otherwise step both inward and repeat until they meet.",
      },
      {
        label: "The complexity surprise",
        text: "The nested `while` loops look like they might be O(n²), but they're not. Each pointer only ever moves inward. Across the entire run, they collectively cover the string just once. So it's O(n) time, with the early exit making it even faster on non-palindromes.",
      },
      {
        label: "Complexity",
        text: "O(n) time, O(1) space. No cleaned-up copy of the string is ever built.",
      },
    ],
    insight:
      "Cleaning the string was never the goal, comparing the ends was. Two pointers on the raw string do the same job with no extra memory.",
    language: "python",
    code: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        ind_start, ind_end = 0, len(s) - 1

        while ind_start < ind_end:
            while ind_start < ind_end and not s[ind_start].isalnum():
                ind_start += 1
            while ind_start < ind_end and not s[ind_end].isalnum():
                ind_end -= 1

            if s[ind_start].lower() != s[ind_end].lower():
                return False

            ind_start += 1
            ind_end -= 1

        return True`,
    learned: [
      "`.isalnum()` checks if a character is a letter or digit, exactly the \"keep this one\" test the problem describes, no manual ASCII range needed.",
      "`.lower()` handles the case-insensitive comparison in one call.",
      "Nested `while` loops aren't automatically O(n²). When the inner loops only ever advance pointers that never reset, the total movement is bounded by the string length, so it's O(n) in disguise.",
    ],
    gotchas: [
      "The `ind_start < ind_end` guard inside both inner loops matters. Without it, a string of all-junk characters (or pointers crossing mid-skip) could run a pointer off the end and compare out of bounds.",
      "An empty or all-non-alphanumeric string (like `\" \"`) is correctly a palindrome: the pointers skip everything, never find a mismatch, and the outer loop exits returning `True`.",
    ],
  },
  15: {
    id: 15,
    date: "2026-11-24",
    lcNumber: 121,
    tc: "O(n)",
    summary:
      "You're given an array where `prices[i]` is the stock price on day `i`. Buy on one day, sell on a later day, and return the maximum profit. If no profit is possible, return 0.",
    approach: [
      {
        label: "The core rule",
        text: "You can only sell after you buy. So for any day you're considering as the buy day, the profit depends on the highest price that comes after it. Buy low, sell high, but \"high\" must be to the right.",
      },
      {
        label: "First idea",
        text: "For each day, look at every later day and find the best sell price. That's a nested loop, O(n²). Too slow.",
      },
      {
        label: "Walk backward, remember the best sell price",
        text: "Here's the shift. If you move through the days from right to left, you can carry a single value: the highest price seen so far to the right. Standing on any day, that value is the best price you could sell at in the future. Profit for buying today is simply `max_right - price_today`. Track the best such profit as you go.",
      },
      {
        label: "Why one variable is enough",
        text: "You might reach for an array holding \"max price to the right of every index.\" But you only ever need the single best price to the right at the current step, not the whole history. A running variable replaces the entire array, dropping space from O(n) to O(1).",
      },
      {
        label: "Alternative framing (forward, min-so-far)",
        text: "The more conventional version sweeps left to right, tracking the cheapest price seen so far and measuring profit as \"today's price minus cheapest buy so far.\" Same O(n) time, O(1) space, just the mirror image of this backward approach. Both are optimal; worth knowing the forward one too, as it's what most interviewers expect.",
      },
    ],
    insight:
      "The trick is realizing you don't need to store a max-to-the-right for every position. One variable, updated as you sweep backward, carries everything the next step needs.",
    language: "python",
    code: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        max_profit, max_right = 0, 0

        for index in range(len(prices) - 1, -1, -1):
            max_profit = max(max_profit, max_right - prices[index])
            max_right = max(max_right, prices[index])

        return max_profit`,
    learned: [
      "When you want to walk an array in reverse by index, use `range(len(prices) - 1, -1, -1)`, not `enumerate` on a reversed slice. `enumerate` always counts `0, 1, 2...` forward regardless of what you feed it, so its index won't match the original positions. Reversing a slice reverses the values, never the index.",
      "Order of the two lines inside the loop matters: check profit before updating `max_right`. On the current day, `max_right` should still mean \"best price strictly to the right,\" so you compute profit first, then fold today's price into `max_right` for the days further left.",
      "A whole auxiliary array often collapses into a single running variable once you notice you only ever read one entry of it at a time. (Same lesson as the prefix/suffix problems, in reverse.)",
    ],
    gotchas: [
      "Since `max_right` and `max_profit` both start at 0, a strictly decreasing array (no profit possible) correctly returns 0 without any special case.",
      "A single-element array needs no guard: the loop runs once, no future price exists, profit stays 0.",
    ],
  },
  21: {
    id: 21,
    date: "2026-11-25",
    lcNumber: 20,
    tc: "O(n)",
    summary:
      "Given a string of just `()`, `{}`, and `[]`, decide if it's valid. Every open bracket must close with the same type, in the correct order, and every close must have a matching open before it.",
    approach: [
      {
        label: "Why plain logic doesn't cut it",
        text: "Your eye reads the whole string at once and the nesting \"looks\" obviously right or wrong. But a program can't take it in as a whole, it reads one character at a time. So the question becomes: what does the computer need to remember as it walks left to right?",
      },
      {
        label: "The key realization",
        text: "The moment you hit a closing bracket, the only thing that matters is the most recent unclosed opening bracket. If that one matches, the pair is settled: you can forget it entirely and move on. If it doesn't match, the string is invalid. So at any point you're carrying a pile of \"open brackets I haven't closed yet,\" and you always care about the one on top.",
      },
      {
        label: "That's a stack",
        text: "A structure where you only ever add to the top and remove from the top (last in, first out) is exactly a stack. Push every opening bracket. On every closing bracket, pop the top and check it's the correct partner. A small dict maps each closing bracket to the opening one it expects.",
      },
      {
        label: "The two failure modes",
        text: "A closing bracket with an empty stack means there's nothing to match it: invalid. A popped bracket that isn't the right partner (like `)` landing on top of `{`): invalid. And after the whole walk, any brackets still left in the stack are unclosed opens: also invalid. Only a completely empty stack at the end means every pair resolved.",
      },
      {
        label: "Complexity",
        text: "O(n) time, O(n) space (worst case, all opening brackets pile onto the stack).",
      },
    ],
    insight:
      "The whole insight is \"I only ever need the latest unmatched open bracket,\" and that only the top matters is what makes a stack the natural fit.",
    language: "python",
    code: `from collections import deque

class Solution:
    def isValid(self, s: str) -> bool:
        stack = deque()
        close_to_open = {')': '(', '}': '{', ']': '['}

        for brace in s:
            if brace in close_to_open:
                if not stack or stack.pop() != close_to_open[brace]:
                    return False
            else:
                stack.append(brace)

        return not stack`,
    learned: [
      "Mapping closing brackets to their opening partner in a dict (`close_to_open`) turns \"is this the right pair?\" into a clean one-line lookup, no chain of if/elif.",
      "`not stack` is the Pythonic empty-check: it's `True` when the stack is empty. So `return not stack` says \"valid only if nothing is left unmatched.\"",
      "Checking `not stack` before `stack.pop()` matters: popping an empty stack throws. Python's `or` short-circuits, so if `not stack` is true, the pop never runs. The guard and the pop sit in the right order.",
      "A `list` works as a stack too (`.append()` / `.pop()`), and both are O(1) at the top. `deque` just makes the intent explicit, and it's also O(1) at the front, which a list isn't.",
    ],
    gotchas: [
      "Forgetting the final `return not stack` and returning `True` instead silently passes strings like `\"(((\"`. The loop finishes without complaint, but the unclosed opens should make it invalid.",
      "A string starting with a closing bracket (like `\")(\"`) must fail on the empty-stack check, not crash. That's exactly what the `not stack` guard handles.",
    ],
  },
  22: {
    id: 22,
    date: "2026-11-25",
    lcNumber: 155,
    tc: "O(1)",
    summary:
      "Design a stack supporting `push`, `pop`, `top`, and `getMin`, where `getMin` returns the smallest element currently in the stack, all in O(1) time.",
    approach: [
      {
        label: "The easy part",
        text: "`push`, `pop`, and `top` are just a normal stack: append to the end, pop from the end, peek the last element. All O(1) already.",
      },
      {
        label: "The catch is getMin",
        text: "The naive way to find the minimum is to scan the whole stack, but that's O(n), and the problem demands O(1). Scanning on every call is off the table.",
      },
      {
        label: "Remember the min as you go",
        text: "Since pushes and pops only ever happen at the top, the minimum can only change at the top too. So keep a second stack that runs in lockstep with the main one. Every time you push a value, also push \"the smallest value seen so far up to this point\" onto the min stack. That's `min(new value, current min on top)`.",
      },
      {
        label: "Why this stays correct through pops",
        text: "Because the min stack grows and shrinks together with the main stack, its top always reflects the minimum of exactly the elements currently present. Pop one off the main stack, pop one off the min stack, and the new top of the min stack is automatically the min of what remains, no recomputation. `getMin` is just \"peek the top of the min stack,\" O(1).",
      },
      {
        label: "Complexity",
        text: "O(1) for every operation. Space is O(n): the min stack doubles the storage, which is the trade for constant-time minimums.",
      },
    ],
    insight:
      "The whole trick: the minimum only changes at the top, so a parallel stack of running minimums keeps the answer ready at all times, no searching.",
    language: "python",
    code: `class MinStack:

    def __init__(self):
        self.stack = list()
        self.min_left = list()

    def push(self, value: int) -> None:
        self.stack.append(value)
        if not self.min_left:
            self.min_left.append(value)
        else:
            self.min_left.append(min(self.min_left[-1], value))

    def pop(self) -> None:
        self.min_left.pop()
        return self.stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_left[-1]`,
    learned: [
      "Inside a class method, every attribute needs `self.`: `stack` alone is an undefined name, `self.stack` is the object's data. Python makes this explicit where Java hides it behind `this`.",
      "The two stacks must push and pop together to stay in sync. If a `pop` only touches one of them, the min stack drifts out of alignment and `getMin` starts lying.",
      "`self.min_left[-1]` peeks the top without removing it: the running min is always sitting right there.",
    ],
    gotchas: [
      "No empty-guards in `pop`, `top` or `getMin`: the problem guarantees they're only called on a non-empty stack. The one check that stays is in `push`, and it isn't a guard: on the very first push there's no current minimum yet, so `self.min_left[-1]` would crash.",
    ],
  },
  28: {
    id: 28,
    date: "2026-11-25",
    lcNumber: 704,
    tc: "O(log n)",
    summary:
      "Given a sorted ascending array and a target, return the target's index, or `-1` if it's not there. Must run in O(log n).",
    approach: [
      {
        label: "Use what \"sorted\" gives you",
        text: "In an unsorted array you'd have to check every element, O(n). But sorted means you can make a decision at the middle and throw away half the array in one shot. That's the whole reason the problem hands you a sorted input.",
      },
      {
        label: "Look at the middle, then halve",
        text: "Check the middle element. If it's the target, done. If the target is smaller, it can only be in the left half, so discard everything from the middle rightward. If it's larger, keep only the right half. Each step the search window shrinks by half.",
      },
      {
        label: "Why that's O(log n)",
        text: "Halving the window each step means after k steps you're down to n / 2^k elements. The number of halvings before you're left with one element is log₂(n), so the work is O(log n), not O(n).",
      },
      {
        label: "Knowing when to give up",
        text: "The window is defined by two bounds, `front` and `rear`. Each step moves one of them past the middle (`mid - 1` or `mid + 1`). If the target isn't present, the window keeps shrinking until `front` overtakes `rear`. That crossover means \"nowhere left to look,\" so return `-1`.",
      },
      {
        label: "Complexity",
        text: "O(log n) time. This recursive version uses O(log n) space for the call stack; an iterative `while front <= rear` loop does the same in O(1) space and is the more common interview form.",
      },
    ],
    insight:
      "The core move is \"the middle lets me discard half,\" and the whole efficiency comes from halving instead of scanning.",
    language: "python",
    code: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        return self.binarySearch(nums, target, 0, len(nums) - 1)

    def binarySearch(self, nums: list[int], target: int, front: int, rear: int) -> int:
        if front > rear:
            return -1

        mid = (rear + front) // 2

        if nums[mid] == target:
            return mid
        elif target < nums[mid]:
            return self.binarySearch(nums, target, front, mid - 1)
        else:
            return self.binarySearch(nums, target, mid + 1, rear)`,
    learned: [
      "The midpoint is `(front + rear) // 2`: the average of the two bounds, giving an absolute index into the array. A tempting mistake is `(rear - front) // 2`, which is a length offset from zero, not a real position. It can land outside the window, and only works by accident when `front` is 0.",
      "The `front > rear` base case is what makes a missing target terminate instead of recursing forever or running off the array. When the bounds cross, every index has been ruled out.",
      "Methods calling other methods on the same class need `self.`: the recursive call is `self.binarySearch(...)`, not a bare name.",
    ],
    gotchas: [
      "`front > rear` must be checked first, before computing `mid`. Otherwise on an empty window you'd index into nothing.",
      "Moving to `mid - 1` / `mid + 1` (not just `mid`) is essential. Recursing with `mid` still inside the window on a missing target would loop forever, since the window would stop shrinking.",
    ],
  },
};

export function getSolution(id: number): NeetCodeSolution | undefined {
  return neetcodeSolutions[id];
}
