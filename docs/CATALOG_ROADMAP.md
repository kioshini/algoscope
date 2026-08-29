# Catalog roadmap

AlgoScope targets 80 tested implementations grouped by problem and executable contract. Rankings are valid only inside one contract with identical inputs and runtime conditions.

## Sorting: 30 (current)

Bubble, Selection, Insertion, Cocktail, Gnome, Shell, Merge, Quick, Heap, Cycle, Comb, Odd-Even, Pancake, Binary Insertion, Three-Way Quick, Natural Merge, Hoare Quick, Dual-Pivot Quick, Median-of-Three Quick, Bottom-Up Merge, In-Place Merge, Intro Sort, Tim Sort, Tournament Sort, Patience Sort, Tree Sort, Strand Sort, Counting Sort, Radix LSD Sort, Bucket Sort.

Contracts: `sort-numeric-array`; `sort-integer-array` for Counting Sort and Radix LSD Sort.

## Searching: 10 (current)

Linear Search, Sentinel Search, Binary Search, Lower Bound, Upper Bound, Jump Search, Exponential Search, Interpolation Search, Fibonacci Search, Quickselect.

Contracts: `find-in-array`, `select-kth`.

## Graphs: 15 (current)

BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, A*, Topological Sort, Kahn Topological Sort, Connected Components, Cycle Detection, Kosaraju SCC, Tarjan SCC, Prim MST, Kruskal MST, Union-Find Connectivity.

Contracts: `graph-traversal`, `single-source-shortest-path`, `all-pairs-shortest-path`, `minimum-spanning-tree`, `graph-ordering`.

## Strings: 12 (current)

Naive Search, KMP, Z Algorithm, Rabin-Karp, Boyer-Moore, Horspool, Aho-Corasick, Trie Lookup, Longest Common Prefix, Manacher, Levenshtein Distance, Longest Common Subsequence.

Contracts: `substring-search`, `multi-pattern-search`, `string-distance`, `string-sequence`.

## Dynamic programming: 13 (current)

Fibonacci Memoization, Fibonacci Tabulation, 0/1 Knapsack, Unbounded Knapsack, Coin Change Count, Coin Change Minimum, Longest Increasing Subsequence, Matrix Chain Multiplication, Edit Distance, Grid Paths, Minimum Path Sum, Rod Cutting, Partition Equal Subset Sum.

Contracts: `sequence-dp`, `capacity-dp`, `grid-dp`, `partition-dp`.

## Admission rules

Every catalog algorithm must provide:

- an executable implementation;
- deterministic examples and edge cases;
- correctness tests;
- complexity and memory metadata;
- an explicit input/output contract;
- benchmark eligibility only against compatible implementations;
- a useful visualization or state explanation.

Algorithms are added by problem pack instead of inflating the catalog with near-identical variants.
