import type { AlgorithmUseCase } from './types';

export const DP_USE_CASES: Record<string, AlgorithmUseCase[]> = {
  'fibonacci-memoization': [
    {
      title: 'Recursive cost model for a heavily re-entrant e-commerce discount ladder',
      context:
        'A pricing platform models the total number of ways a shopper can stack tiered discounts, where each tier references the two tiers below it. A naive recursive call re-solves the same tier thousands of times, so the team wraps the function with a memo dict to cache each tier once. The result is an O(n) discount profile instead of O(branches) recomputation.',
      tags: ['memoization', 'recursion', 'sequence'],
    },
    {
      title: 'Single-knob simulation of a population growth series in a biology tool',
      context:
        'A lab tool simulates a rabbit population that reproduces only after two time steps, giving a Fibonacci recurrence. Because the same month index is queried by many downstream plots, researchers memoize the growth function, and the run turns from exponential recomputation into a near-linear scan across months.',
      tags: ['memoization', 'recursion', 'sequence'],
    },
    {
      title: 'Warm-start cache for repeated subproblem lookups in a divide-and-conquer audit',
      context:
        'An audit script decomposes a large polygonal polygon into triangles and repeatedly needs certain intermediate counts that follow the Fibonacci sequence. Each count is stored in a mutable cache keyed by polygon size, so converging subproblems are solved once and then reused by every crossing branch.',
      tags: ['memoization', 'recursion', 'sequence', 'cache'],
    },
  ],
  'fibonacci-tabulation': [
    {
      title: 'Sizing an amortised payment plan whose installments follow a Fibonacci schedule',
      context:
        "A lender builds a payment schedule where each month's principal component is the sum of the two prior months, then fills a bottom-up table from month zero to the term. Nothing is recomputed and the loop is trivially parallelisable, so the whole amortisation curve is produced in one forward pass.",
      tags: ['tabulation', 'iteration', 'sequence', 'bottom-up'],
    },
    {
      title: 'Coding-challenge baseline for the independent-set counting problem on a strip',
      context:
        'A platform lesson derives the number of independent sets of a path of n vertices, which satisfies the same recurrence as the Fibonacci sequence. The reference solution fills a table in ascending order so learners can see that the answer at index i depends only on i-1 and i-2, and the expensive table is just a pair of rolling registers in code.',
      tags: ['tabulation', 'iteration', 'sequence', 'rolling'],
    },
    {
      title: 'Step-wise reserve projection for a seasonal inventory restock model',
      context:
        'A retailer projects inventory levels over many weeks where the replenishment at each week mirrors the two weeks prior. Rather than recursion, the analyst computes the series bottom-up and keeps only the last two reservoir levels in memory, producing a compact projection with no risk of deep call stacks.',
      tags: ['tabulation', 'iteration', 'sequence', 'rolling'],
    },
  ],
  'zero-one-knapsack': [
    {
      title: 'Maximising shipped cargo value in a freight container with a weight ceiling',
      context:
        'A logistics company packs a fixed container of capacity C with crates, each crate has a weight and a margin, and every crate is loaded at most once. A 0/1 knapsack table measures the best profit at every load limit, scanning capacities backward so a chosen crate is never double-counted.',
      tags: ['capacity', 'optimization', '0/1', 'pseudo-polynomial'],
    },
    {
      title: 'Selecting which software modules to keep in a de-bloated firmware image',
      context:
        'An embedded engineer has a fixed ROM budget and a list of optional features, each with a byte cost and a user-impact score. Since every feature ships once at most, the solver treats the ROM as a capacity and the features as 0/1 items, yielding the highest-impact feature set that fits on the chip.',
      tags: ['capacity', 'optimization', '0/1', 'budget'],
    },
    {
      title: 'Deciding which ad campaigns to run under a shared marketing budget',
      context:
        'A media planner is given a fixed spend a portfolio of campaigns, each with a cost and a projected reach, and each campaign runs at most once. The knapsack table picks a set of campaigns that maximises reach without exceeding the spend cap, and the backward capacity scan enforces the single-run constraint.',
      tags: ['capacity', 'optimization', '0/1', 'budget'],
    },
  ],
  'unbounded-knapsack': [
    {
      title: "Allocating a warehouse's floor space to repeated product pallets",
      context:
        'A logistics operator fills a storage area of W square meters with pallets, each product has a footprint and a profit, and any product may be stacked as many times as space allows. An unbounded knapsack table scans capacities forward so the same pallet type can be selected repeatedly, reflecting that a product can be stocked in multiple copies.',
      tags: ['unbounded', 'capacity', 'optimization', 'item-reuse'],
    },
    {
      title: 'Investment of a fixed budget into repeatable renewable-energy units',
      context:
        'An energy planner has a capital budget and a menu of solar, wind, and storage units, each with a cost and a capacity contribution, and each may be bought any number of times. The forward-scan table allows the same unit type to appear many times, yielding an optimal fleet mix under the budget.',
      tags: ['unbounded', 'capacity', 'optimization', 'budget'],
    },
    {
      title: 'Coins-and-bars roll-up of change held by a retail cash drawer',
      context:
        'A store composes a set of product bundles where bundle packs can be chosen multiple times and each stock-keeping unit costs a given amount. Treating the drawer as an unbounded capacity lets the same bundle be picked repeatedly, which is exactly how a cashier allocates notes when exact change matters.',
      tags: ['unbounded', 'capacity', 'optimization'],
    },
  ],
  'coin-change-count': [
    {
      title: 'Counting distinct ways to tender an amount from a fixed set of notes',
      context:
        'A cash register tables the number of order-independent ways a total can be formed from UNIQUE denominations. The solver processes each denomination once and accumulates counts forward, so 1 plus 2 is not double-counted as 2 plus 1, giving a true combination count rather than a permutation count.',
      tags: ['counting', 'combinations', 'coins', 'unbounded'],
    },
    {
      title: 'Enumerating valid word fragments for an auto-complete dictionary',
      context:
        'A text engine wants to know how many ways a target string partitions into known dictionary roots where every root may be reused. This is the coin-change-count recurrence on a token set, and because roots are reusable the solver counts distinct token multisets rather than orderings.',
      tags: ['counting', 'combinations', 'sequence', 'unbounded'],
    },
    {
      title: "Counting distinct change-sequences in a vending machine's coin mechanism",
      context:
        'A vending firmware reports how many coin combinations hit a target price so it can decide whether a route is reachable at all. Each denomination may be inserted several times, and the count is order-independent, matching the coin-combination table rather than the min-coin problem.',
      tags: ['counting', 'combinations', 'coins', 'unbounded'],
    },
  ],
  'coin-change-minimum': [
    {
      title: 'Fewest banknotes to make a delivery fee, returning -1 when infeasible',
      context:
        'A payment gateway needs to remit an exact amount using a fixed list of note denominations, and it also must fail cleanly when no combination is possible. The min-coin table grows by amount and picks the cheapest reachable predecessor, returning -1 precisely when the amount is left at infinity.',
      tags: ['minimum', 'coins', 'unbounded', 'optimization'],
    },
    {
      title: 'Employee reimbursement picker minimising the number of vouchers used',
      context:
        'An HR system remits a reimbursement amount using printable voucher values, and wants the smallest count so fewer physical documents are issued. Unbounded reuse of each voucher value is allowed, and the DP selects the reachable predecessor with the lowest voucher count.',
      tags: ['minimum', 'coins', 'unbounded', 'optimization'],
    },
    {
      title: 'Step-minimising elevator route over a floor schedule',
      context:
        'A facility models reachable floors as amounts and allowable per-stop floors as denominations, minimising the total number of stops. Because a floor step may be repeated, the DP is the unbounded min-coin variant, and an unreachable floor reports -1 so the dispatcher proposes an alternative.',
      tags: ['minimum', 'sequence', 'unbounded', 'optimization'],
    },
  ],
  'longest-increasing-subsequence': [
    {
      title: 'Detecting the longest strictly rising trend in a stock price series',
      context:
        'An analyst feeds daily closing prices into a sequence DP that records the longest strictly increasing subsequence. Because the algorithm tracks the full chain (not just its length), the team can name the exact days of the rally, not merely report that a rally exists.',
      tags: ['subsequence', 'strictly-increasing', 'reconstruction', 'sequence'],
    },
    {
      title: 'Reconstructing the longest strictly ascending merge order in a diff review',
      context:
        'A reviewer compares two lists of commit labels and wants the longest run of commits that appear in strictly ascending order in both. The DP preserves item order and strict inequality, so the resulting chain is a valid common subsequence while avoiding equal-valued duplicates that would break strictness.',
      tags: ['subsequence', 'strictly-increasing', 'reconstruction', 'sequence'],
    },
    {
      title: 'Ordering test cases least to most expensive while keeping strict escalation',
      context:
        'A QA tool sorts flaky test costs and wants the longest subset that rises strictly in runtime so each step is a genuine escalation. Using strict increasing instead of nondecreasing avoids grouping equal-cost tests, which would otherwise produce a false sense of tightening.',
      tags: ['subsequence', 'strictly-increasing', 'sequence'],
    },
  ],
  'matrix-chain-multiplication': [
    {
      title: 'Choosing the cheapest parenthesisation for a chain of trained tensors',
      context:
        'An ML compiler multiplies a chain of matrices whose shapes are known ahead of time. The interval DP tries every split and records the least scalar-multiplication cost, so the code generator inserts the grouping that minimises FLOPs instead of doing a naive left-to-right product.',
      tags: ['intervals', 'parenthesization', 'compiler', 'optimization'],
    },
    {
      title: 'Ordering a batch of geometric transforms to minimise accumulated work',
      context:
        'A 3D pipeline chains scaling and rotation matrices on objects. The chain DP finds the multiplication order with the least total matrix multiply cost, so the renderer caches an optimal associativity for a given object list rather than recomputing from scratch each frame.',
      tags: ['intervals', 'parenthesization', 'matrices', 'optimization'],
    },
    {
      title: 'Planning a sequence of database joins so intermediate results stay small',
      context:
        'A query planner models each join as a matrix operation where the cost depends on the cardinality of the joined relation. Assigning the optimal grouping to a chain of joins is the matrix-chain problem, and the DP picks the split that keeps intermediate rows as small as possible.',
      tags: ['intervals', 'parenthesization', 'optimization', 'database'],
    },
  ],
  'edit-distance': [
    {
      title: 'Ranking typo suggestions against a dictionary of product names',
      context:
        'A storefront measures how many insertions, deletions, and substitutions turn a raw query into a known product name. The DP builds a distance matrix, so the search backend scores every candidate string and surfaces the closest matches before fuzzy matching or a keyboard-handler layer runs.',
      tags: ['Levenshtein', 'strings', 'prefixes', 'fuzzy-match'],
    },
    {
      title: 'Measuring similarity between two source snapshots in a revision tool',
      context:
        "A version-control tool computes the edit distance between a file's old and new text to gauge how much changed before generating an incremental diff. Because it only needs the distance, the implementation keeps a rolling row and derives a rough change magnitude without building a full edit script.",
      tags: ['Levenshtein', 'strings', 'prefixes', 'rolling-rows'],
    },
    {
      title: 'Normalising address fields across a customer migration',
      context:
        'A data-quality job compares a legacy address with a canonical form and treats each character change as one edit. The distance table flags near-duplicates that would otherwise be split across two customer records, so the dedupe step can propose a single merged entry.',
      tags: ['Levenshtein', 'strings', 'prefixes', 'dedup'],
    },
  ],
  'grid-paths': [
    {
      title: 'Counting the number of monotone routes across a city street lattice',
      context:
        "A transport planner counts the distinct ways to walk from a city's north-west corner to its south-east corner using only east and south blocks. The grid DP adds paths arriving from above and from the left, and the count at the far corner is the total monotone trips over the whole block grid.",
      tags: ['grid', 'counting', 'right-and-down', 'paths'],
    },
    {
      title: 'Enumerating short sequences in a language lattice parser',
      context:
        'A grammar tool wants to know how many ways a two-symbol interval can be produced from repeated rightward tokens. The same monotone grid recursion applied to a token grid yields the number of valid parsings, and it is straightforward to extend once blockers are added later.',
      tags: ['grid', 'counting', 'right-and-down', 'paths'],
    },
    {
      title: 'Planning the number of downward delivery drops across a shelf matrix',
      context:
        'A warehouse warehouse system models stock picking as a grid where a worker only moves right or down between bays. Counting those paths lets the scheduler size the number of feasible pick sequences before it filters by actual stock availability.',
      tags: ['grid', 'counting', 'right-and-down', 'paths'],
    },
  ],
  'minimum-path-sum': [
    {
      title: 'Least-cost route through a grid of per-cell handling charges',
      context:
        'A courier grades each warehouse floor cell with a handling cost and wants the cheapest top-left to bottom-right path that moves only right and down. The DP accumulates the twin forced first row and first column, then adds each cell to whichever incoming edge is cheaper, so the corner total is the minimal toll.',
      tags: ['grid', 'minimum', 'right-and-down', 'optimization'],
    },
    {
      title: 'Cheapest route in a spreadsheet-style dependency cost surface',
      context:
        'A financial model lays out step costs in a grid, and a downstream consumer must run a path that only moves right and down. Reusing the forced edges as the base, the minimum-path-sum table yields the lowest cumulative cost across the workflow without ever evaluating upward or leftward moves.',
      tags: ['grid', 'minimum', 'right-and-down', 'optimization'],
    },
    {
      title: 'Sequence of machine states with minimal cumulative wear',
      context:
        'An operations team maps a matrix of wear incurred when a tool transitions between states and seeks a right-down diagonal of least total wear. The DP finds the minimal accumulation, and because it only relaxes right and down, it makes no unsafe backward-state assumptions.',
      tags: ['grid', 'minimum', 'right-and-down', 'rolling-row'],
    },
  ],
  'rod-cutting': [
    {
      title: 'Maximising revenue by cutting stock steel beams into shorter sold pieces',
      context:
        'A steel distributor knows the price of each integer beam length from 1 to L and wants the best revenue for cutting a full L-unit beam. The DP builds the best value for every prefix length by trying each priced first cut, and the answer equals the sum of prices of the chosen pieces, potentially leaving part of the rod unsold when it is cheaper.',
      tags: ['cuts', 'revenue', 'unbounded', 'optimization'],
    },
    {
      title: 'Cutting a roll of fabric into garments to maximise order fill.',
      context:
        'A textile plant has a roll of R meters and a price list per pattern size. Rod-cutting chooses a combination of lengths whose total revenue is highest, and the unbounded nature of the recurrence models that the same pattern can be cut from the roll many times without an ordering constraint.',
      tags: ['cuts', 'revenue', 'unbounded', 'optimization'],
    },
    {
      title: 'Slicing a reserved time block into billable segments',
      context:
        'A consultancy books a contiguous block of hours and publishes a per-segment price table. The DP splits the block into priced segments to maximise revenue, and because the recurrence reuses an optimised remainder each time, it effectively operates as an unbounded piece selection problem.',
      tags: ['cuts', 'revenue', 'unbounded', 'optimization'],
    },
  ],
  'partition-equal-subset-sum': [
    {
      title: 'Splitting a dataset into two balanced halves for a fair train/val split',
      context:
        'A data scientist has a set of weighted files and wants to decide if they can be split into two groups with identical total weights. The solver rejects an odd total immediately, then scans a reachability table backward so each item is used at most once, returning true only if half the total is reachable.',
      tags: ['partition', 'subset-sum', 'decision', '0/1'],
    },
    {
      title: 'Balancing workloads across two server pools of equal capacity',
      context:
        'A cluster scheduler is given a list of job runtimes and asks whether they can be split so each pool handles exactly the same total runtime. Since each job is assigned to exactly one pool, the 0/1 reachability table with a target of half the total answers the feasibility question.',
      tags: ['partition', 'subset-sum', 'decision', '0/1'],
    },
    {
      title: 'Dividing a shipment into two equal-weight pallets',
      context:
        'A warehousing supervisor needs to know whether a set of packages can be loaded into two pallets of exactly equal weight. An odd total is rejected instantly, then the backward-scan DP decisions whether the half-weight target is reachable using each package once.',
      tags: ['partition', 'subset-sum', 'decision', '0/1'],
    },
  ],
};
