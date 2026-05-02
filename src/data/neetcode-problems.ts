export type Difficulty = "Easy" | "Medium" | "Hard";

export interface NeetCodeProblem {
  id: number;
  topic: string;
  title: string;
  difficulty: Difficulty;
  slug: string;
  solved: boolean;
  leetcodeUrl: string;
}

export interface NeetCodeTopic {
  name: string;
  problems: NeetCodeProblem[];
}

const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;

export const neetcodeProblems: NeetCodeProblem[] = [
  // Arrays & Hashing
  { id: 1,   topic: "Arrays & Hashing",          title: "Contains Duplicate",                              difficulty: "Easy",   slug: "contains-duplicate",                              solved: true,  leetcodeUrl: lc("contains-duplicate") },
  { id: 2,   topic: "Arrays & Hashing",          title: "Valid Anagram",                                   difficulty: "Easy",   slug: "valid-anagram",                                   solved: true,  leetcodeUrl: lc("valid-anagram") },
  { id: 3,   topic: "Arrays & Hashing",          title: "Two Sum",                                         difficulty: "Easy",   slug: "two-sum",                                         solved: true,  leetcodeUrl: lc("two-sum") },
  { id: 4,   topic: "Arrays & Hashing",          title: "Group Anagrams",                                  difficulty: "Medium", slug: "group-anagrams",                                  solved: false, leetcodeUrl: lc("group-anagrams") },
  { id: 5,   topic: "Arrays & Hashing",          title: "Top K Frequent Elements",                         difficulty: "Medium", slug: "top-k-frequent-elements",                         solved: false, leetcodeUrl: lc("top-k-frequent-elements") },
  { id: 6,   topic: "Arrays & Hashing",          title: "Encode and Decode Strings",                       difficulty: "Medium", slug: "encode-and-decode-strings",                       solved: false, leetcodeUrl: lc("encode-and-decode-strings") },
  { id: 7,   topic: "Arrays & Hashing",          title: "Product of Array Except Self",                    difficulty: "Medium", slug: "product-of-array-except-self",                    solved: false, leetcodeUrl: lc("product-of-array-except-self") },
  { id: 8,   topic: "Arrays & Hashing",          title: "Valid Sudoku",                                    difficulty: "Medium", slug: "valid-sudoku",                                    solved: false, leetcodeUrl: lc("valid-sudoku") },
  { id: 9,   topic: "Arrays & Hashing",          title: "Longest Consecutive Sequence",                    difficulty: "Medium", slug: "longest-consecutive-sequence",                    solved: false, leetcodeUrl: lc("longest-consecutive-sequence") },

  // Two Pointers
  { id: 10,  topic: "Two Pointers",              title: "Valid Palindrome",                                difficulty: "Easy",   slug: "valid-palindrome",                                solved: false, leetcodeUrl: lc("valid-palindrome") },
  { id: 11,  topic: "Two Pointers",              title: "Two Sum II - Input Array Is Sorted",              difficulty: "Medium", slug: "two-sum-ii-input-array-is-sorted",                solved: false, leetcodeUrl: lc("two-sum-ii-input-array-is-sorted") },
  { id: 12,  topic: "Two Pointers",              title: "3Sum",                                            difficulty: "Medium", slug: "3sum",                                            solved: false, leetcodeUrl: lc("3sum") },
  { id: 13,  topic: "Two Pointers",              title: "Container With Most Water",                       difficulty: "Medium", slug: "container-with-most-water",                       solved: false, leetcodeUrl: lc("container-with-most-water") },
  { id: 14,  topic: "Two Pointers",              title: "Trapping Rain Water",                             difficulty: "Hard",   slug: "trapping-rain-water",                             solved: false, leetcodeUrl: lc("trapping-rain-water") },

  // Sliding Window
  { id: 15,  topic: "Sliding Window",            title: "Best Time to Buy and Sell Stock",                 difficulty: "Easy",   slug: "best-time-to-buy-and-sell-stock",                 solved: false, leetcodeUrl: lc("best-time-to-buy-and-sell-stock") },
  { id: 16,  topic: "Sliding Window",            title: "Longest Substring Without Repeating Characters",  difficulty: "Medium", slug: "longest-substring-without-repeating-characters",  solved: false, leetcodeUrl: lc("longest-substring-without-repeating-characters") },
  { id: 17,  topic: "Sliding Window",            title: "Longest Repeating Character Replacement",         difficulty: "Medium", slug: "longest-repeating-character-replacement",         solved: false, leetcodeUrl: lc("longest-repeating-character-replacement") },
  { id: 18,  topic: "Sliding Window",            title: "Permutation in String",                           difficulty: "Medium", slug: "permutation-in-string",                           solved: false, leetcodeUrl: lc("permutation-in-string") },
  { id: 19,  topic: "Sliding Window",            title: "Minimum Window Substring",                        difficulty: "Hard",   slug: "minimum-window-substring",                        solved: false, leetcodeUrl: lc("minimum-window-substring") },
  { id: 20,  topic: "Sliding Window",            title: "Sliding Window Maximum",                          difficulty: "Hard",   slug: "sliding-window-maximum",                          solved: false, leetcodeUrl: lc("sliding-window-maximum") },

  // Stack
  { id: 21,  topic: "Stack",                     title: "Valid Parentheses",                               difficulty: "Easy",   slug: "valid-parentheses",                               solved: false, leetcodeUrl: lc("valid-parentheses") },
  { id: 22,  topic: "Stack",                     title: "Min Stack",                                       difficulty: "Medium", slug: "min-stack",                                       solved: false, leetcodeUrl: lc("min-stack") },
  { id: 23,  topic: "Stack",                     title: "Evaluate Reverse Polish Notation",                difficulty: "Medium", slug: "evaluate-reverse-polish-notation",                solved: false, leetcodeUrl: lc("evaluate-reverse-polish-notation") },
  { id: 24,  topic: "Stack",                     title: "Generate Parentheses",                            difficulty: "Medium", slug: "generate-parentheses",                            solved: false, leetcodeUrl: lc("generate-parentheses") },
  { id: 25,  topic: "Stack",                     title: "Daily Temperatures",                              difficulty: "Medium", slug: "daily-temperatures",                              solved: false, leetcodeUrl: lc("daily-temperatures") },
  { id: 26,  topic: "Stack",                     title: "Car Fleet",                                       difficulty: "Medium", slug: "car-fleet",                                       solved: false, leetcodeUrl: lc("car-fleet") },
  { id: 27,  topic: "Stack",                     title: "Largest Rectangle in Histogram",                  difficulty: "Hard",   slug: "largest-rectangle-in-histogram",                  solved: false, leetcodeUrl: lc("largest-rectangle-in-histogram") },

  // Binary Search
  { id: 28,  topic: "Binary Search",             title: "Binary Search",                                   difficulty: "Easy",   slug: "binary-search",                                   solved: false, leetcodeUrl: lc("binary-search") },
  { id: 29,  topic: "Binary Search",             title: "Search a 2D Matrix",                              difficulty: "Medium", slug: "search-a-2d-matrix",                              solved: false, leetcodeUrl: lc("search-a-2d-matrix") },
  { id: 30,  topic: "Binary Search",             title: "Koko Eating Bananas",                             difficulty: "Medium", slug: "koko-eating-bananas",                             solved: false, leetcodeUrl: lc("koko-eating-bananas") },
  { id: 31,  topic: "Binary Search",             title: "Find Minimum in Rotated Sorted Array",            difficulty: "Medium", slug: "find-minimum-in-rotated-sorted-array",            solved: false, leetcodeUrl: lc("find-minimum-in-rotated-sorted-array") },
  { id: 32,  topic: "Binary Search",             title: "Search in Rotated Sorted Array",                  difficulty: "Medium", slug: "search-in-rotated-sorted-array",                  solved: false, leetcodeUrl: lc("search-in-rotated-sorted-array") },
  { id: 33,  topic: "Binary Search",             title: "Time Based Key-Value Store",                      difficulty: "Medium", slug: "time-based-key-value-store",                      solved: false, leetcodeUrl: lc("time-based-key-value-store") },
  { id: 34,  topic: "Binary Search",             title: "Median of Two Sorted Arrays",                     difficulty: "Hard",   slug: "median-of-two-sorted-arrays",                     solved: false, leetcodeUrl: lc("median-of-two-sorted-arrays") },

  // Linked List
  { id: 35,  topic: "Linked List",               title: "Reverse Linked List",                             difficulty: "Easy",   slug: "reverse-linked-list",                             solved: false, leetcodeUrl: lc("reverse-linked-list") },
  { id: 36,  topic: "Linked List",               title: "Merge Two Sorted Lists",                          difficulty: "Easy",   slug: "merge-two-sorted-lists",                          solved: false, leetcodeUrl: lc("merge-two-sorted-lists") },
  { id: 37,  topic: "Linked List",               title: "Reorder List",                                    difficulty: "Medium", slug: "reorder-list",                                    solved: false, leetcodeUrl: lc("reorder-list") },
  { id: 38,  topic: "Linked List",               title: "Remove Nth Node From End of List",                difficulty: "Medium", slug: "remove-nth-node-from-end-of-list",                solved: false, leetcodeUrl: lc("remove-nth-node-from-end-of-list") },
  { id: 39,  topic: "Linked List",               title: "Copy List with Random Pointer",                   difficulty: "Medium", slug: "copy-list-with-random-pointer",                   solved: false, leetcodeUrl: lc("copy-list-with-random-pointer") },
  { id: 40,  topic: "Linked List",               title: "Add Two Numbers",                                 difficulty: "Medium", slug: "add-two-numbers",                                 solved: false, leetcodeUrl: lc("add-two-numbers") },
  { id: 41,  topic: "Linked List",               title: "Linked List Cycle",                               difficulty: "Easy",   slug: "linked-list-cycle",                               solved: false, leetcodeUrl: lc("linked-list-cycle") },
  { id: 42,  topic: "Linked List",               title: "Find the Duplicate Number",                       difficulty: "Medium", slug: "find-the-duplicate-number",                       solved: false, leetcodeUrl: lc("find-the-duplicate-number") },
  { id: 43,  topic: "Linked List",               title: "LRU Cache",                                       difficulty: "Medium", slug: "lru-cache",                                       solved: false, leetcodeUrl: lc("lru-cache") },
  { id: 44,  topic: "Linked List",               title: "Merge K Sorted Lists",                            difficulty: "Hard",   slug: "merge-k-sorted-lists",                            solved: false, leetcodeUrl: lc("merge-k-sorted-lists") },
  { id: 45,  topic: "Linked List",               title: "Reverse Nodes in k-Group",                        difficulty: "Hard",   slug: "reverse-nodes-in-k-group",                        solved: false, leetcodeUrl: lc("reverse-nodes-in-k-group") },

  // Trees
  { id: 46,  topic: "Trees",                     title: "Invert Binary Tree",                              difficulty: "Easy",   slug: "invert-binary-tree",                              solved: false, leetcodeUrl: lc("invert-binary-tree") },
  { id: 47,  topic: "Trees",                     title: "Maximum Depth of Binary Tree",                    difficulty: "Easy",   slug: "maximum-depth-of-binary-tree",                    solved: false, leetcodeUrl: lc("maximum-depth-of-binary-tree") },
  { id: 48,  topic: "Trees",                     title: "Diameter of Binary Tree",                         difficulty: "Easy",   slug: "diameter-of-binary-tree",                         solved: false, leetcodeUrl: lc("diameter-of-binary-tree") },
  { id: 49,  topic: "Trees",                     title: "Balanced Binary Tree",                            difficulty: "Easy",   slug: "balanced-binary-tree",                            solved: false, leetcodeUrl: lc("balanced-binary-tree") },
  { id: 50,  topic: "Trees",                     title: "Same Tree",                                       difficulty: "Easy",   slug: "same-tree",                                       solved: false, leetcodeUrl: lc("same-tree") },
  { id: 51,  topic: "Trees",                     title: "Subtree of Another Tree",                         difficulty: "Easy",   slug: "subtree-of-another-tree",                         solved: false, leetcodeUrl: lc("subtree-of-another-tree") },
  { id: 52,  topic: "Trees",                     title: "Lowest Common Ancestor of a Binary Search Tree",  difficulty: "Medium", slug: "lowest-common-ancestor-of-a-binary-search-tree",  solved: false, leetcodeUrl: lc("lowest-common-ancestor-of-a-binary-search-tree") },
  { id: 53,  topic: "Trees",                     title: "Binary Tree Level Order Traversal",               difficulty: "Medium", slug: "binary-tree-level-order-traversal",               solved: false, leetcodeUrl: lc("binary-tree-level-order-traversal") },
  { id: 54,  topic: "Trees",                     title: "Binary Tree Right Side View",                     difficulty: "Medium", slug: "binary-tree-right-side-view",                     solved: false, leetcodeUrl: lc("binary-tree-right-side-view") },
  { id: 55,  topic: "Trees",                     title: "Count Good Nodes in Binary Tree",                 difficulty: "Medium", slug: "count-good-nodes-in-binary-tree",                 solved: false, leetcodeUrl: lc("count-good-nodes-in-binary-tree") },
  { id: 56,  topic: "Trees",                     title: "Validate Binary Search Tree",                     difficulty: "Medium", slug: "validate-binary-search-tree",                     solved: false, leetcodeUrl: lc("validate-binary-search-tree") },
  { id: 57,  topic: "Trees",                     title: "Kth Smallest Element in a BST",                   difficulty: "Medium", slug: "kth-smallest-element-in-a-bst",                   solved: false, leetcodeUrl: lc("kth-smallest-element-in-a-bst") },
  { id: 58,  topic: "Trees",                     title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", slug: "construct-binary-tree-from-preorder-and-inorder-traversal", solved: false, leetcodeUrl: lc("construct-binary-tree-from-preorder-and-inorder-traversal") },
  { id: 59,  topic: "Trees",                     title: "Binary Tree Maximum Path Sum",                    difficulty: "Hard",   slug: "binary-tree-maximum-path-sum",                    solved: false, leetcodeUrl: lc("binary-tree-maximum-path-sum") },
  { id: 60,  topic: "Trees",                     title: "Serialize and Deserialize Binary Tree",           difficulty: "Hard",   slug: "serialize-and-deserialize-binary-tree",           solved: false, leetcodeUrl: lc("serialize-and-deserialize-binary-tree") },

  // Heap / Priority Queue
  { id: 61,  topic: "Heap / Priority Queue",     title: "Kth Largest Element in a Stream",                 difficulty: "Easy",   slug: "kth-largest-element-in-a-stream",                 solved: false, leetcodeUrl: lc("kth-largest-element-in-a-stream") },
  { id: 62,  topic: "Heap / Priority Queue",     title: "Last Stone Weight",                               difficulty: "Easy",   slug: "last-stone-weight",                               solved: false, leetcodeUrl: lc("last-stone-weight") },
  { id: 63,  topic: "Heap / Priority Queue",     title: "K Closest Points to Origin",                      difficulty: "Medium", slug: "k-closest-points-to-origin",                      solved: false, leetcodeUrl: lc("k-closest-points-to-origin") },
  { id: 64,  topic: "Heap / Priority Queue",     title: "Kth Largest Element in an Array",                 difficulty: "Medium", slug: "kth-largest-element-in-an-array",                 solved: false, leetcodeUrl: lc("kth-largest-element-in-an-array") },
  { id: 65,  topic: "Heap / Priority Queue",     title: "Task Scheduler",                                  difficulty: "Medium", slug: "task-scheduler",                                  solved: false, leetcodeUrl: lc("task-scheduler") },
  { id: 66,  topic: "Heap / Priority Queue",     title: "Design Twitter",                                  difficulty: "Medium", slug: "design-twitter",                                  solved: false, leetcodeUrl: lc("design-twitter") },
  { id: 67,  topic: "Heap / Priority Queue",     title: "Find Median from Data Stream",                    difficulty: "Hard",   slug: "find-median-from-data-stream",                    solved: false, leetcodeUrl: lc("find-median-from-data-stream") },

  // Backtracking
  { id: 68,  topic: "Backtracking",              title: "Subsets",                                         difficulty: "Medium", slug: "subsets",                                         solved: false, leetcodeUrl: lc("subsets") },
  { id: 69,  topic: "Backtracking",              title: "Combination Sum",                                 difficulty: "Medium", slug: "combination-sum",                                 solved: false, leetcodeUrl: lc("combination-sum") },
  { id: 70,  topic: "Backtracking",              title: "Permutations",                                    difficulty: "Medium", slug: "permutations",                                    solved: false, leetcodeUrl: lc("permutations") },
  { id: 71,  topic: "Backtracking",              title: "Subsets II",                                      difficulty: "Medium", slug: "subsets-ii",                                      solved: false, leetcodeUrl: lc("subsets-ii") },
  { id: 72,  topic: "Backtracking",              title: "Combination Sum II",                              difficulty: "Medium", slug: "combination-sum-ii",                              solved: false, leetcodeUrl: lc("combination-sum-ii") },
  { id: 73,  topic: "Backtracking",              title: "Word Search",                                     difficulty: "Medium", slug: "word-search",                                     solved: false, leetcodeUrl: lc("word-search") },
  { id: 74,  topic: "Backtracking",              title: "Palindrome Partitioning",                         difficulty: "Medium", slug: "palindrome-partitioning",                         solved: false, leetcodeUrl: lc("palindrome-partitioning") },
  { id: 75,  topic: "Backtracking",              title: "Letter Combinations of a Phone Number",           difficulty: "Medium", slug: "letter-combinations-of-a-phone-number",           solved: false, leetcodeUrl: lc("letter-combinations-of-a-phone-number") },
  { id: 76,  topic: "Backtracking",              title: "N-Queens",                                        difficulty: "Hard",   slug: "n-queens",                                        solved: false, leetcodeUrl: lc("n-queens") },

  // Tries
  { id: 77,  topic: "Tries",                     title: "Implement Trie (Prefix Tree)",                    difficulty: "Medium", slug: "implement-trie-prefix-tree",                      solved: false, leetcodeUrl: lc("implement-trie-prefix-tree") },
  { id: 78,  topic: "Tries",                     title: "Design Add and Search Words Data Structure",      difficulty: "Medium", slug: "design-add-and-search-words-data-structure",      solved: false, leetcodeUrl: lc("design-add-and-search-words-data-structure") },
  { id: 79,  topic: "Tries",                     title: "Word Search II",                                  difficulty: "Hard",   slug: "word-search-ii",                                  solved: false, leetcodeUrl: lc("word-search-ii") },

  // Graphs
  { id: 80,  topic: "Graphs",                    title: "Number of Islands",                               difficulty: "Medium", slug: "number-of-islands",                               solved: false, leetcodeUrl: lc("number-of-islands") },
  { id: 81,  topic: "Graphs",                    title: "Max Area of Island",                              difficulty: "Medium", slug: "max-area-of-island",                              solved: false, leetcodeUrl: lc("max-area-of-island") },
  { id: 82,  topic: "Graphs",                    title: "Clone Graph",                                     difficulty: "Medium", slug: "clone-graph",                                     solved: false, leetcodeUrl: lc("clone-graph") },
  { id: 83,  topic: "Graphs",                    title: "Walls and Gates",                                 difficulty: "Medium", slug: "walls-and-gates",                                 solved: false, leetcodeUrl: lc("walls-and-gates") },
  { id: 84,  topic: "Graphs",                    title: "Rotting Oranges",                                 difficulty: "Medium", slug: "rotting-oranges",                                 solved: false, leetcodeUrl: lc("rotting-oranges") },
  { id: 85,  topic: "Graphs",                    title: "Pacific Atlantic Water Flow",                     difficulty: "Medium", slug: "pacific-atlantic-water-flow",                     solved: false, leetcodeUrl: lc("pacific-atlantic-water-flow") },
  { id: 86,  topic: "Graphs",                    title: "Surrounded Regions",                              difficulty: "Medium", slug: "surrounded-regions",                              solved: false, leetcodeUrl: lc("surrounded-regions") },
  { id: 87,  topic: "Graphs",                    title: "Course Schedule",                                 difficulty: "Medium", slug: "course-schedule",                                 solved: false, leetcodeUrl: lc("course-schedule") },
  { id: 88,  topic: "Graphs",                    title: "Course Schedule II",                              difficulty: "Medium", slug: "course-schedule-ii",                              solved: false, leetcodeUrl: lc("course-schedule-ii") },
  { id: 89,  topic: "Graphs",                    title: "Graph Valid Tree",                                difficulty: "Medium", slug: "graph-valid-tree",                                solved: false, leetcodeUrl: lc("graph-valid-tree") },
  { id: 90,  topic: "Graphs",                    title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", slug: "number-of-connected-components-in-an-undirected-graph", solved: false, leetcodeUrl: lc("number-of-connected-components-in-an-undirected-graph") },
  { id: 91,  topic: "Graphs",                    title: "Redundant Connection",                            difficulty: "Medium", slug: "redundant-connection",                            solved: false, leetcodeUrl: lc("redundant-connection") },
  { id: 92,  topic: "Graphs",                    title: "Word Ladder",                                     difficulty: "Hard",   slug: "word-ladder",                                     solved: false, leetcodeUrl: lc("word-ladder") },

  // Advanced Graphs
  { id: 93,  topic: "Advanced Graphs",           title: "Reconstruct Itinerary",                           difficulty: "Hard",   slug: "reconstruct-itinerary",                           solved: false, leetcodeUrl: lc("reconstruct-itinerary") },
  { id: 94,  topic: "Advanced Graphs",           title: "Min Cost to Connect All Points",                  difficulty: "Medium", slug: "min-cost-to-connect-all-points",                  solved: false, leetcodeUrl: lc("min-cost-to-connect-all-points") },
  { id: 95,  topic: "Advanced Graphs",           title: "Network Delay Time",                              difficulty: "Medium", slug: "network-delay-time",                              solved: false, leetcodeUrl: lc("network-delay-time") },
  { id: 96,  topic: "Advanced Graphs",           title: "Swim in Rising Water",                            difficulty: "Hard",   slug: "swim-in-rising-water",                            solved: false, leetcodeUrl: lc("swim-in-rising-water") },
  { id: 97,  topic: "Advanced Graphs",           title: "Alien Dictionary",                                difficulty: "Hard",   slug: "alien-dictionary",                                solved: false, leetcodeUrl: lc("alien-dictionary") },
  { id: 98,  topic: "Advanced Graphs",           title: "Cheapest Flights Within K Stops",                 difficulty: "Medium", slug: "cheapest-flights-within-k-stops",                 solved: false, leetcodeUrl: lc("cheapest-flights-within-k-stops") },

  // 1-D Dynamic Programming
  { id: 99,  topic: "1-D DP",                    title: "Climbing Stairs",                                 difficulty: "Easy",   slug: "climbing-stairs",                                 solved: false, leetcodeUrl: lc("climbing-stairs") },
  { id: 100, topic: "1-D DP",                    title: "Min Cost Climbing Stairs",                        difficulty: "Easy",   slug: "min-cost-climbing-stairs",                        solved: false, leetcodeUrl: lc("min-cost-climbing-stairs") },
  { id: 101, topic: "1-D DP",                    title: "House Robber",                                    difficulty: "Medium", slug: "house-robber",                                    solved: false, leetcodeUrl: lc("house-robber") },
  { id: 102, topic: "1-D DP",                    title: "House Robber II",                                 difficulty: "Medium", slug: "house-robber-ii",                                 solved: false, leetcodeUrl: lc("house-robber-ii") },
  { id: 103, topic: "1-D DP",                    title: "Longest Palindromic Substring",                   difficulty: "Medium", slug: "longest-palindromic-substring",                   solved: false, leetcodeUrl: lc("longest-palindromic-substring") },
  { id: 104, topic: "1-D DP",                    title: "Palindromic Substrings",                          difficulty: "Medium", slug: "palindromic-substrings",                          solved: false, leetcodeUrl: lc("palindromic-substrings") },
  { id: 105, topic: "1-D DP",                    title: "Decode Ways",                                     difficulty: "Medium", slug: "decode-ways",                                     solved: false, leetcodeUrl: lc("decode-ways") },
  { id: 106, topic: "1-D DP",                    title: "Coin Change",                                     difficulty: "Medium", slug: "coin-change",                                     solved: false, leetcodeUrl: lc("coin-change") },
  { id: 107, topic: "1-D DP",                    title: "Maximum Product Subarray",                        difficulty: "Medium", slug: "maximum-product-subarray",                        solved: false, leetcodeUrl: lc("maximum-product-subarray") },
  { id: 108, topic: "1-D DP",                    title: "Word Break",                                      difficulty: "Medium", slug: "word-break",                                      solved: false, leetcodeUrl: lc("word-break") },
  { id: 109, topic: "1-D DP",                    title: "Longest Increasing Subsequence",                  difficulty: "Medium", slug: "longest-increasing-subsequence",                  solved: false, leetcodeUrl: lc("longest-increasing-subsequence") },
  { id: 110, topic: "1-D DP",                    title: "Partition Equal Subset Sum",                      difficulty: "Medium", slug: "partition-equal-subset-sum",                      solved: false, leetcodeUrl: lc("partition-equal-subset-sum") },

  // 2-D Dynamic Programming
  { id: 111, topic: "2-D DP",                    title: "Unique Paths",                                    difficulty: "Medium", slug: "unique-paths",                                    solved: false, leetcodeUrl: lc("unique-paths") },
  { id: 112, topic: "2-D DP",                    title: "Longest Common Subsequence",                      difficulty: "Medium", slug: "longest-common-subsequence",                      solved: false, leetcodeUrl: lc("longest-common-subsequence") },
  { id: 113, topic: "2-D DP",                    title: "Best Time to Buy and Sell Stock with Cooldown",   difficulty: "Medium", slug: "best-time-to-buy-and-sell-stock-with-cooldown",   solved: false, leetcodeUrl: lc("best-time-to-buy-and-sell-stock-with-cooldown") },
  { id: 114, topic: "2-D DP",                    title: "Coin Change II",                                  difficulty: "Medium", slug: "coin-change-ii",                                  solved: false, leetcodeUrl: lc("coin-change-ii") },
  { id: 115, topic: "2-D DP",                    title: "Target Sum",                                      difficulty: "Medium", slug: "target-sum",                                      solved: false, leetcodeUrl: lc("target-sum") },
  { id: 116, topic: "2-D DP",                    title: "Interleaving String",                             difficulty: "Medium", slug: "interleaving-string",                             solved: false, leetcodeUrl: lc("interleaving-string") },
  { id: 117, topic: "2-D DP",                    title: "Longest Increasing Path in a Matrix",             difficulty: "Hard",   slug: "longest-increasing-path-in-a-matrix",             solved: false, leetcodeUrl: lc("longest-increasing-path-in-a-matrix") },
  { id: 118, topic: "2-D DP",                    title: "Distinct Subsequences",                           difficulty: "Hard",   slug: "distinct-subsequences",                           solved: false, leetcodeUrl: lc("distinct-subsequences") },
  { id: 119, topic: "2-D DP",                    title: "Edit Distance",                                   difficulty: "Medium", slug: "edit-distance",                                   solved: false, leetcodeUrl: lc("edit-distance") },
  { id: 120, topic: "2-D DP",                    title: "Burst Balloons",                                  difficulty: "Hard",   slug: "burst-balloons",                                  solved: false, leetcodeUrl: lc("burst-balloons") },
  { id: 121, topic: "2-D DP",                    title: "Regular Expression Matching",                     difficulty: "Hard",   slug: "regular-expression-matching",                     solved: false, leetcodeUrl: lc("regular-expression-matching") },

  // Greedy
  { id: 122, topic: "Greedy",                    title: "Maximum Subarray",                                difficulty: "Medium", slug: "maximum-subarray",                                solved: false, leetcodeUrl: lc("maximum-subarray") },
  { id: 123, topic: "Greedy",                    title: "Jump Game",                                       difficulty: "Medium", slug: "jump-game",                                       solved: false, leetcodeUrl: lc("jump-game") },
  { id: 124, topic: "Greedy",                    title: "Jump Game II",                                    difficulty: "Medium", slug: "jump-game-ii",                                    solved: false, leetcodeUrl: lc("jump-game-ii") },
  { id: 125, topic: "Greedy",                    title: "Gas Station",                                     difficulty: "Medium", slug: "gas-station",                                     solved: false, leetcodeUrl: lc("gas-station") },
  { id: 126, topic: "Greedy",                    title: "Hand of Straights",                               difficulty: "Medium", slug: "hand-of-straights",                               solved: false, leetcodeUrl: lc("hand-of-straights") },
  { id: 127, topic: "Greedy",                    title: "Merge Triplets to Form Target Triplet",           difficulty: "Medium", slug: "merge-triplets-to-form-target-triplet",           solved: false, leetcodeUrl: lc("merge-triplets-to-form-target-triplet") },
  { id: 128, topic: "Greedy",                    title: "Partition Labels",                                difficulty: "Medium", slug: "partition-labels",                                solved: false, leetcodeUrl: lc("partition-labels") },
  { id: 129, topic: "Greedy",                    title: "Valid Parenthesis String",                        difficulty: "Medium", slug: "valid-parenthesis-string",                        solved: false, leetcodeUrl: lc("valid-parenthesis-string") },

  // Intervals
  { id: 130, topic: "Intervals",                 title: "Insert Interval",                                 difficulty: "Medium", slug: "insert-interval",                                 solved: false, leetcodeUrl: lc("insert-interval") },
  { id: 131, topic: "Intervals",                 title: "Merge Intervals",                                 difficulty: "Medium", slug: "merge-intervals",                                 solved: false, leetcodeUrl: lc("merge-intervals") },
  { id: 132, topic: "Intervals",                 title: "Non-Overlapping Intervals",                       difficulty: "Medium", slug: "non-overlapping-intervals",                       solved: false, leetcodeUrl: lc("non-overlapping-intervals") },
  { id: 133, topic: "Intervals",                 title: "Meeting Rooms",                                   difficulty: "Easy",   slug: "meeting-rooms",                                   solved: false, leetcodeUrl: lc("meeting-rooms") },
  { id: 134, topic: "Intervals",                 title: "Meeting Rooms II",                                difficulty: "Medium", slug: "meeting-rooms-ii",                                solved: false, leetcodeUrl: lc("meeting-rooms-ii") },
  { id: 135, topic: "Intervals",                 title: "Minimum Interval to Include Each Query",          difficulty: "Hard",   slug: "minimum-interval-to-include-each-query",          solved: false, leetcodeUrl: lc("minimum-interval-to-include-each-query") },

  // Math & Geometry
  { id: 136, topic: "Math & Geometry",           title: "Rotate Image",                                    difficulty: "Medium", slug: "rotate-image",                                    solved: false, leetcodeUrl: lc("rotate-image") },
  { id: 137, topic: "Math & Geometry",           title: "Spiral Matrix",                                   difficulty: "Medium", slug: "spiral-matrix",                                   solved: false, leetcodeUrl: lc("spiral-matrix") },
  { id: 138, topic: "Math & Geometry",           title: "Set Matrix Zeroes",                               difficulty: "Medium", slug: "set-matrix-zeroes",                               solved: false, leetcodeUrl: lc("set-matrix-zeroes") },
  { id: 139, topic: "Math & Geometry",           title: "Happy Number",                                    difficulty: "Easy",   slug: "happy-number",                                    solved: false, leetcodeUrl: lc("happy-number") },
  { id: 140, topic: "Math & Geometry",           title: "Plus One",                                        difficulty: "Easy",   slug: "plus-one",                                        solved: false, leetcodeUrl: lc("plus-one") },
  { id: 141, topic: "Math & Geometry",           title: "Pow(x, n)",                                       difficulty: "Medium", slug: "powx-n",                                          solved: false, leetcodeUrl: lc("powx-n") },
  { id: 142, topic: "Math & Geometry",           title: "Multiply Strings",                                difficulty: "Medium", slug: "multiply-strings",                                solved: false, leetcodeUrl: lc("multiply-strings") },
  { id: 143, topic: "Math & Geometry",           title: "Detect Squares",                                  difficulty: "Medium", slug: "detect-squares",                                  solved: false, leetcodeUrl: lc("detect-squares") },

  // Bit Manipulation
  { id: 144, topic: "Bit Manipulation",          title: "Single Number",                                   difficulty: "Easy",   slug: "single-number",                                   solved: false, leetcodeUrl: lc("single-number") },
  { id: 145, topic: "Bit Manipulation",          title: "Number of 1 Bits",                                difficulty: "Easy",   slug: "number-of-1-bits",                                solved: false, leetcodeUrl: lc("number-of-1-bits") },
  { id: 146, topic: "Bit Manipulation",          title: "Counting Bits",                                   difficulty: "Easy",   slug: "counting-bits",                                   solved: false, leetcodeUrl: lc("counting-bits") },
  { id: 147, topic: "Bit Manipulation",          title: "Reverse Bits",                                    difficulty: "Easy",   slug: "reverse-bits",                                    solved: false, leetcodeUrl: lc("reverse-bits") },
  { id: 148, topic: "Bit Manipulation",          title: "Missing Number",                                  difficulty: "Easy",   slug: "missing-number",                                  solved: false, leetcodeUrl: lc("missing-number") },
  { id: 149, topic: "Bit Manipulation",          title: "Sum of Two Integers",                             difficulty: "Medium", slug: "sum-of-two-integers",                             solved: false, leetcodeUrl: lc("sum-of-two-integers") },
  { id: 150, topic: "Bit Manipulation",          title: "Reverse Integer",                                 difficulty: "Medium", slug: "reverse-integer",                                 solved: false, leetcodeUrl: lc("reverse-integer") },
];

export const TOPICS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Heap / Priority Queue",
  "Backtracking",
  "Tries",
  "Graphs",
  "Advanced Graphs",
  "1-D DP",
  "2-D DP",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
] as const;

export type Topic = (typeof TOPICS)[number];

export function getTopicGroups(): NeetCodeTopic[] {
  return TOPICS.map((topic) => ({
    name: topic,
    problems: neetcodeProblems.filter((p) => p.topic === topic),
  }));
}

export function getSolvedCount(): number {
  return neetcodeProblems.filter((p) => p.solved).length;
}
