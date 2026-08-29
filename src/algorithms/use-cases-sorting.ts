import type { AlgorithmUseCase } from './types';

export const SORTING_USE_CASES: Record<string, AlgorithmUseCase[]> = {
  bubble: [
    {
      title: 'Teaching the intuition of exchanges',
      context:
        'Used in our intro CS lab to show how adjacent swaps drive a sort; the visual step count makes comparison and swap counts legible before students meet real algorithms.',
      tags: ['teaching', 'small-data'],
    },
    {
      title: 'Nearly-sorted update flows in a UI list',
      context:
        'A tiny settings list where only one row is toggled per render; a single bubble pass over a mostly-ordered array is fast enough and trivially safe to write inline.',
      tags: ['nearly-sorted', 'adaptive', 'small-data', 'no-deps', 'online'],
    },
    {
      title: 'Reference implementation for a visualizer',
      context:
        'As the canonical baseline in a sorting visualizer, bubble keeps every move as a single swap, so animators can map exchanges 1:1 to frames without special-casing.',
      tags: ['visualization', 'teaching', 'small-data'],
    },
  ],
  selection: [
    {
      title: 'Fewest-write scenarios',
      context:
        "We sort records on a slow EEPROM where writes are expensive; selection's min-per-pass guarantees the smallest possible number of writes for a given array length.",
      tags: ['memory', 'small-data', 'in-place'],
    },
    {
      title: 'Ranking leaderboard snapshots',
      context:
        'Computing a top-100 from a big array only needs partial selection, so we stop after the kth pass and skip the full sort entirely.',
      tags: ['large-data', 'in-place', 'randomized'],
    },
    {
      title: 'Storing a fixed-size deck by hand',
      context:
        'A card-arrangement routine in a board-game demo relies on the classic find-minimum loop; the code stays branch-light and easy to reason about during a jam.',
      tags: ['teaching', 'no-deps', 'small-data', 'in-place'],
    },
  ],
  insertion: [
    {
      title: 'Sorting appended live rows',
      context:
        'Our grid buffers new rows that arrive chronologically and only occasionally re-sorts; insertion shines because the existing data stays almost fully ordered between updates.',
      tags: ['online', 'adaptive', 'nearly-sorted', 'small-data'],
    },
    {
      title: 'Stable ordering in list UIs',
      context:
        "When a table lets users reorder then filter, insertion keeps prior relative order, so a filter that re-sorts doesn't scramble the user's manual arrangement.",
      tags: ['stable', 'order-preserving', 'small-data'],
    },
    {
      title: 'Internal small-array base case',
      context:
        'Serving as the base case inside timsort-style code, it avoids the recursion overhead on tiny slices and is the fastest known approach below ~16 elements on most CPUs.',
      tags: ['hybrid-base', 'small-data', 'adaptive', 'library'],
    },
  ],
  cocktail: [
    {
      title: 'Bidirectional passes over nearly-sorted rows',
      context:
        "A dashboard that tracks a mostly-ordered benchmark table benefits from cocktail's two-direction scan, which resolves a late-big-element problem bubble leaves behind.",
      tags: ['nearly-sorted', 'adaptive', 'small-data', 'visualization'],
    },
    {
      title: 'Bound-tracking on a fixed dataset',
      context:
        'Recomputing ranks for a reference dataset where only the extremes drift; the shrinking low/high bounds skip the interior and keep the re-sort sub-linear.',
      tags: ['small-data', 'in-place', 'adaptive'],
    },
    {
      title: 'Alternative teaching demo for exchange sorts',
      context:
        "We use it as a second exchange example so students see how symmetric passes compared to comb's gap scheduling without learning a new data structure.",
      tags: ['teaching', 'small-data', 'visualization'],
    },
  ],
  gnome: [
    {
      title: 'Hand-crafted sort without a loop counter',
      context:
        "A one-off sorting snippet in a gist where gnome's single walking index keeps the logic a few lines long, ideal when you want to avoid mutating bookkeeping.",
      tags: ['no-deps', 'small-data', 'teaching'],
    },
    {
      title: 'Nearly-sorted list repair in a REPL',
      context:
        "Pasting a tiny script that needs to reorder a small nearly-sorted array; gnome's adaptive backwards step fixes the few misplaced items in near-linear time.",
      tags: ['nearly-sorted', 'adaptive', 'small-data', 'no-deps'],
    },
    {
      title: 'Curiosity-driven code review example',
      context:
        'A junior dev writes gnome in a PR and we keep as a contrast to insertion, making the one-pass-with-backtracking tradeoff a concrete review discussion.',
      tags: ['teaching', 'small-data'],
    },
  ],
  shell: [
    {
      title: 'Battery of gap sequences',
      context:
        "Our benchmark harness tests a variety of gap schemes (Knuth, Sedgewick, Ciura) to pick the one that wins on the real split sizes of our product's payloads.",
      tags: ['visualization', 'library', 'randomized'],
    },
    {
      title: 'Medium in-place sort without call-recursion',
      context:
        "An embedded module that can't march the stack must sort a few thousand ints; shell gives real sub-quadratic time entirely in-place, no recursion, no allocation.",
      tags: ['in-place', 'memory', 'medium-data', 'no-deps'],
    },
    {
      title: 'Partial-order products in a legacy app',
      context:
        "A classic codebase sort that already moves values over a distance benefits from shell's gap pass, which handles the mixed sorting already baked into the files.",
      tags: ['nearly-sorted', 'adaptive', 'in-place'],
    },
  ],
  merge: [
    {
      title: 'Stable sort for linked structures',
      context:
        'We merge sorted runs across a large streamed report where stability matters; merge needs only forward links, so locking down the first occurrence of equal keys is natural.',
      tags: ['stable', 'order-preserving', 'large-data'],
    },
    {
      title: 'External / large-array setting',
      context:
        "Sorting a dataset too big for memory on a CAD project; merge's ability to distribute runs across files and merge them back is the reason it's the only safe choice here.",
      tags: ['large-data', 'memory', 'library', 'hybrid-base'],
    },
    {
      title: 'Parallel divide-and-conquer teaching',
      context:
        "We anchor the divide & conquer lesson on merge; the clean split/combine shape lets students see how work partitions across threads before tackling quick sort's partitions.",
      tags: ['teaching', 'visualization', 'hybrid-base'],
    },
  ],
  quick: [
    {
      title: 'In-place default for application data',
      context:
        'Sorting structs by first name in a CLI tool; the in-place random-pivot version handles a large workload using next to no extra memory and is the standard library choice.',
      tags: ['in-place', 'large-data', 'library', 'randomized'],
    },
    {
      title: 'low-memory embedded sorts',
      context:
        "A firmware routine for sensor buffering sorted by timestamp; quick's cache-friendly partition loop keeps pace without running merge's allocation cost on a tiny heap.",
      tags: ['memory', 'in-place', 'randomized', 'large-data'],
    },
    {
      title: 'Benchmarks against library sort',
      context:
        "Our perf comparisons use careful quick variants to measure worst-case avoidance, letting us demonstrate why real engines don't pick a naive first-element pivot.",
      tags: ['randomized', 'worst-case-safe', 'visualization', 'library'],
    },
  ],
  heap: [
    {
      title: 'Never blocks on worst-case input',
      context:
        "An analytics job that can't tolerate a bad-center pivot; heap's guaranteed n-log-n worst case means security-sensitive sorting stays predictable on adversarial data.",
      tags: ['worst-case-safe', 'large-data', 'in-place', 'randomized'],
    },
    {
      title: 'Partial top-k extraction',
      context:
        'A search feature that ranks only the top k results; building a heap lets us pop the maximum and stop early instead of fully ordering the whole candidate set.',
      tags: ['large-data', 'memory', 'online', 'no-deps'],
    },
    {
      title: 'Streaming priority queue',
      context:
        'We sort offline but feed events through the same heap structure at runtime, reusing the sift-down primitive for a live scheduler with no extra sort pass.',
      tags: ['online', 'large-data', 'in-place'],
    },
  ],
  cycle: [
    {
      title: 'Minimizing destructive writes',
      context:
        'A flash-backed config reorder that must reduce erase cycles; cycle sort guarantees the theoretical minimum number of writes, far fewer than any comparison sort.',
      tags: ['memory', 'in-place', 'small-data', 'no-deps'],
    },
    {
      title: 'Teaching the write-optimal bound',
      context:
        "Our algorithms lecture contrasts cycle sort's O(n) writes with selection/insertion, giving a concrete upper bound to compare against on whiteboards.",
      tags: ['teaching', 'small-data', 'visualization'],
    },
    {
      title: 'Reorder only, no temporary storage',
      context:
        'A license-key verification pipeline needs to reorder a fixed small set of records in place with no extra array; cycle sort fits that scratch-free contract exactly.',
      tags: ['in-place', 'memory', 'no-deps', 'small-data'],
    },
  ],
  comb: [
    {
      title: 'Turtle-element rescue on the cheap',
      context:
        "A legacy sorter on medium arrays had small values stuck at the end; comb's shrinking gap clears those turtles fast without adopting a whole new framework.",
      tags: ['nearly-sorted', 'adaptive', 'in-place', 'small-data'],
    },
    {
      title: 'Quick simple improvement over bubble',
      context:
        'We keep a comb fallback for a tiny helper utility where it visibly beats bubble but stays compact enough to review in a single visual code review comment.',
      tags: ['in-place', 'small-data', 'visualization', 'no-deps'],
    },
    {
      title: 'Spreadsheet-style ordering in a tool',
      context:
        "Reordering hundreds of rows in a metadata editor; comb's gap pass trades a small constant for a big win over insertion on data that isn't already sorted.",
      tags: ['in-place', 'small-data', 'randomized'],
    },
  ],
  'odd-even': [
    {
      title: 'Parallelism for GPU sorting',
      context:
        'A compute shader sorts a small spatial grid; the odd-even transposition network maps every compare to an independent lane, ideal for lock-step GPU warp execution.',
      tags: ['parallel', 'small-data', 'in-place', 'visualization'],
    },
    {
      title: 'Sorting networks teaching',
      context:
        'We hand-draw the odd-even transposition diagram in the sorting-networks lesson to show a fixed, data-oblivious set of compares, contrasting it with data-dependent sorts.',
      tags: ['teaching', 'visualization', 'small-data'],
    },
    {
      title: 'Hardware-friendly fixed-size buffer',
      context:
        "A small fixed array that must sort on an FPGA-style timer tick prefers odd-even's deterministic compare order, avoiding data-dependent branch divergence.",
      tags: ['in-place', 'small-data', 'no-deps', 'randomized'],
    },
  ],
  pancake: [
    {
      title: 'Sorting a reversible list',
      context:
        "We reorder a stack in a tile-based UI; the prefix-flip primitive maps naturally to a swipe gesture that flips the top of a deck, so pancake's model fits the interaction.",
      tags: ['small-data', 'visualization', 'no-deps', 'in-place'],
    },
    {
      title: 'Interesting worst-case for teaching',
      context:
        "A demonstration that uses pancake's 2n-3 flips as a concrete example of non-trivial, deterministic best case, which surprises students expecting n-log-n.",
      tags: ['teaching', 'small-data', 'visualization'],
    },
    {
      title: 'Bounded mutation cost',
      context:
        "An undo-history list reorder wants as few structural mutations as possible; pancake's flips rewrite a contiguous prefix, keeping the mutation diff tiny for logging.",
      tags: ['memory', 'small-data', 'in-place'],
    },
  ],
  'binary-insertion': [
    {
      title: 'Sorting a nearly-sorted sequence',
      context:
        'A log tail inbound in near-chronological order; binary search finds each insertion point in log n, so the total cost collapses on almost-ordered streams.',
      tags: ['adaptive', 'nearly-sorted', 'small-data', 'stable'],
    },
    {
      title: 'Selecting the right insertion position',
      context:
        'A partially populated table of records where a few rows move each refresh; binary insertion avoids the linear probe and keeps the shift cost dominated by movement, not search.',
      tags: ['stable', 'online', 'small-data', 'order-preserving'],
    },
    {
      title: 'Base case inside merge-like sorts',
      context:
        'Used as an internal hybrid base case for small runs, binary insertion turns the per-element downward search into a cheap log-n compare instead of a scan.',
      tags: ['hybrid-base', 'small-data', 'adaptive', 'library'],
    },
  ],
  'three-way-quick': [
    {
      title: 'Sorting keys with heavy duplicates',
      context:
        'A dashboard aggregating clicks by status column has thousands of identical category values; the three-way partition keeps the equal-value middle and avoids re-sorting it.',
      tags: ['duplicates', 'large-data', 'in-place', 'randomized'],
    },
    {
      title: 'Dutch national flag application',
      context:
        'A security checker groups certificates into allow/deny/unknown buckets; the three-way partition is the exact primitive that produces those three groups in one pass.',
      tags: ['integers', 'in-place', 'large-data', 'visualization'],
    },
    {
      title: 'Improving quick sort on repeated values',
      context:
        'Real business data is full of repeats, so we swap in three-way quick for those workloads to prevent the common n-2 case degeneration into quadratic behavior.',
      tags: ['duplicates', 'worst-case-safe', 'randomized', 'large-data'],
    },
  ],
  'natural-merge': [
    {
      title: 'Leveraging existing runs',
      context:
        'A file of already-bundled records is rarely truly random; natural merge detects and merges the existing runs, beating a blind n-log-n pass on real data.',
      tags: ['adaptive', 'nearly-sorted', 'large-data', 'stable'],
    },
    {
      title: 'Merging pre-sorted chunks',
      context:
        'Our ETL pipeline merges per-shard output that arrives as independently sorted slices; natural merge treats each file as a run and keeps the merge cost minimal.',
      tags: ['large-data', 'memory', 'stable', 'order-preserving'],
    },
    {
      title: 'Stable external sort',
      context:
        'A database-style sorter wants stability on large data; natural merge keeps runs stable and adapts its run detection to whatever order is actually present.',
      tags: ['stable', 'large-data', 'adaptive', 'memory'],
    },
  ],
  'hoare-quick': [
    {
      title: 'Engineering a real partition',
      context:
        "A high-quality map built for a benchmark; Hoare's two-pointer partition reduces the compare/swap count on average compared to a Lomuto-based naive quick sort.",
      tags: ['randomized', 'large-data', 'in-place', 'library'],
    },
    {
      title: 'Guarding against bad pivots',
      context:
        'We integrate Hoare partition with a median-of-three pivot to shut down degenerate sorted/equal cases, which our load-test data hits routinely.',
      tags: ['worst-case-safe', 'randomized', 'large-data', 'in-place'],
    },
    {
      title: 'Teaching the partition tradeoff',
      context:
        'Used in an algorithms lecture to compare Hoare vs. Lomuto; students run both on the same input and see the average-case difference in swap counts.',
      tags: ['teaching', 'visualization', 'small-data'],
    },
  ],
  'dual-pivot-quick': [
    {
      title: "Engine's default fast path",
      context:
        'Many runtime libraries use dual-pivot quick sort for primitive arrays because it performs fewer comparisons on random data than a single-pivot design.',
      tags: ['library', 'randomized', 'large-data', 'in-place'],
    },
    {
      title: 'Sorting primitive-heavy payloads',
      context:
        "A game's high-score table is filled with integers; dual pivot's 3-way-ish splitting speeds up the partition on contiguous numeric arrays.",
      tags: ['integers', 'in-place', 'large-data', 'randomized'],
    },
    {
      title: 'Benchmarking variant selection',
      context:
        'We run dual-pivot against our median-of-three local sort and let the winner drive the hot path, since even a 5% constant matters on a per-frame sort.',
      tags: ['visualization', 'large-data', 'library', 'in-place'],
    },
  ],
  'median-three-quick': [
    {
      title: 'Near-sorted input protection',
      context:
        'A report generator feeds partially sorted pages; taking the median of first, middle, last avoids the worst case a naive pivot triggers on ordered data.',
      tags: ['worst-case-safe', 'nearly-sorted', 'randomized', 'large-data'],
    },
    {
      title: 'Deterministic quality without randomness',
      context:
        'A reproducible simulation needs the same output every run; median-of-three keeps median pivot quality while being fully deterministic and reproducible.',
      tags: ['deterministic', 'in-place', 'visualization', 'library'],
    },
    {
      title: 'Broad production default',
      context:
        "The median-of-three pivot is our fallback for generic arrays where we want near-uniform partitions but can't spend the cost of an introspective sample.",
      tags: ['library', 'randomized', 'in-place', 'worst-case-safe'],
    },
  ],
  'bottom-up-merge': [
    {
      title: 'Iterative merge without recursion',
      context:
        'A console sorter with a constrained stack that still wants stable, guaranteed n-log-n behavior; the bottom-up doubling loop uses constant stack and no recursion.',
      tags: ['stable', 'memory', 'large-data', 'no-deps'],
    },
    {
      title: 'Predictable pass structure',
      context:
        'Our profiling harness likes the fixed, log-n pass count of bottom-up merge, making it easy to attribute cache-miss counts to each doubling width.',
      tags: ['visualization', 'large-data', 'stable'],
    },
    {
      title: 'Linked-list default merge',
      context:
        'Merging sorted linked sub-lists in a functional structure; the iterative merge is the natural fit and avoids the recursion depth that a recursive split would add.',
      tags: ['stable', 'large-data', 'memory', 'order-preserving'],
    },
  ],
  'in-place-merge': [
    {
      title: 'Merge stability without extra memory',
      context:
        'A memory-constrained device that must keep equal elements in order; in-place merge keeps stability yet avoids the length-proportional aux array a normal merge allocates.',
      tags: ['stable', 'memory', 'in-place', 'large-data'],
    },
    {
      title: 'Reordering with limited scratch',
      context:
        'An embedded config sort holding only tiny scratch; these merge routines use O(1) extra space for a stable sort of moderate arrays in a single allocation budget.',
      tags: ['in-place', 'stable', 'memory', 'small-data'],
    },
    {
      title: 'Teaching the space-time tradeoff',
      context:
        'We compare in-place merge to the standard version to show students the log-factor slowdown paid for avoiding extra space, making tradeoffs concrete.',
      tags: ['teaching', 'visualization', 'small-data'],
    },
  ],
  intro: [
    {
      title: 'Library default that never degrades',
      context:
        "STL-style sort relies on introspective sort because it is fast for typical data and falls back to heapsort if quick's recursion depth signals a problem.",
      tags: ['library', 'worst-case-safe', 'large-data', 'hybrid-base'],
    },
    {
      title: 'High-availability cluster sorting',
      context:
        "A distributed leader election sorts by priority on arbitrary input; intro's auto-escalation gives worst-case n log n without the instrumentation burden on hot paths.",
      tags: ['worst-case-safe', 'large-data', 'randomized', 'in-place'],
    },
    {
      title: 'Explaining the shipped default',
      context:
        "Our perf talks dissect the shipped array.sort defaults; introspective sort's hybrid switching is the reason real-world sorts stay fast and safe simultaneously.",
      tags: ['hybrid-base', 'teaching', 'library', 'large-data'],
    },
  ],
  tim: [
    {
      title: 'Product high-throughput sorts',
      context:
        'Python and JVM runtimes ship timsort because real objects are usually partly ordered; it reuses runs and gives near-linear behavior on real data.',
      tags: ['hybrid-base', 'adaptive', 'nearly-sorted', 'stable', 'library'],
    },
    {
      title: 'Stable sort for object payloads',
      context:
        "A search page sorts by relevance score but needs the prior order preserved for ties; timsort's stability and run-aware merging make it the right default.",
      tags: ['stable', 'order-preserving', 'large-data', 'library', 'adaptive'],
    },
    {
      title: 'Mixed data in production logs',
      context:
        "Sorting log lines that are mostly chronological; timsort's natural run detection nails almost-sorted mixtures that would waste work in a plain merge.",
      tags: ['nearly-sorted', 'adaptive', 'large-data', 'memory'],
    },
  ],
  tournament: [
    {
      title: 'Deterministic selection without swaps',
      context:
        "We pre-build a prize distribution from a round-robin tournament bracket; tournament sort's tree reuses comparisons to return the ordering with minimal extra work.",
      tags: ['small-data', 'visualization', 'deterministic', 'no-deps'],
    },
    {
      title: 'Teaching comparison minimization',
      context:
        'The lesson on lower bounds uses tournament sort to show how a winner tree compares every element O(n) times to build a sorted order, tying to information theory.',
      tags: ['teaching', 'visualization', 'small-data'],
    },
    {
      title: 'Predictable selection tree',
      context:
        'A ranking algorithm that prefers a clean tree structure to extract the maximum repeatedly, useful when the comparison is expensive or external.',
      tags: ['memory', 'small-data', 'visualization'],
    },
  ],
  patience: [
    {
      title: 'Longest increasing subsequence',
      context:
        "A scheduling tool finds the longest sequence of tasks that can run in order; patience sort's piles double as the classic LIS algorithm.",
      tags: ['online', 'small-data', 'no-deps', 'visualization'],
    },
    {
      title: 'Card-game style ordering demo',
      context:
        "An interactive card player sorts a hand into piles; patience sort's tableaux naturally model placing cards, so it doubles as a readable game mechanic demonstration.",
      tags: ['visualization', 'teaching', 'small-data'],
    },
    {
      title: 'Online / streaming minimum heaps',
      context:
        'A live feed of events that must be kept weakly ordered as they arrive uses patience piles to maintain the current minimum greedily in small memory.',
      tags: ['online', 'small-data', 'adaptive', 'memory'],
    },
  ],
  tree: [
    {
      title: 'Balanced BST-driven ordering',
      context:
        'A key/value cache that needs sorted range reads maintains a balanced BST; the in-order traversal gives sorted order incrementally without a separate sort step.',
      tags: ['online', 'large-data', 'visualization', 'no-deps', 'memory'],
    },
    {
      title: 'Insertion-heavy ordered store',
      context:
        'A dictionary of tokens where inserts dramatically outnumber bulk outputs; a tree sort keeps data sorted as it grows, avoiding re-sorting the whole set per edit.',
      tags: ['online', 'adaptive', 'large-data', 'visualization'],
    },
    {
      title: 'Teaching in-order traversal',
      context:
        'Our BST lecture shows in-order traversal yielding sorted output as a vivid way to connect tree structure to the sort of the same keys.',
      tags: ['teaching', 'visualization', 'small-data'],
    },
  ],
  strand: [
    {
      title: 'Extracting runs from a linked list',
      context:
        'An ORM sorts a chain of records you can only traverse via pointers; strand removes an increasing subsequence repeatedly, keeping the sort in-place on the links.',
      tags: ['memory', 'in-place', 'small-data', 'visualization'],
    },
    {
      title: 'Adaptive on mixed-order chains',
      context:
        "A stream of NTP-ready timestamps arrives partly ordered; strand's run extraction is naturally adaptive because it snatches whatever increasing subsequence exists.",
      tags: ['adaptive', 'nearly-sorted', 'small-data', 'no-deps'],
    },
    {
      title: 'Simple stable linked-list sorter',
      context:
        "A small graph module sorts adjacency based on weight; strand's merge of decreasing runs yields a stable order with a handful of easy-to-review pointer moves.",
      tags: ['stable', 'order-preserving', 'small-data', 'visualization'],
    },
  ],
  counting: [
    {
      title: 'Integer-keyed frequency buckets',
      context:
        'A histogram tool that already buckets counters by bin; counting sort fills the output directly from those counts so the bag values are grouped with one pass.',
      tags: ['integers', 'duplicates', 'small-data', 'large-data'],
    },
    {
      title: 'Grades and toggles',
      context:
        "Sorting a survey's numeric answer codes (0..N); counting sort maps each code to a slot, producing an ordered questionnaire export in O(n+k) with no comparisons.",
      tags: ['integers', 'small-data', 'no-deps', 'deterministic'],
    },
    {
      title: 'Stable sub-sort for radix',
      context:
        'Counting sort is the stable per-digit pass beneath radix sort; reusing its stability at each digit is exactly what keeps the LSD passes order-preserving.',
      tags: ['integers', 'stable', 'order-preserving', 'hybrid-base', 'large-data'],
    },
  ],
  'radix-lsd': [
    {
      title: 'Sorting numeric IDs at scale',
      context:
        'An analytics pipeline that sorts millions of integer keys by timestamp; LSD radix processes each digit place, so it runs in O(d·(n+k)) with no comparisons.',
      tags: ['integers', 'large-data', 'memory', 'duplicates'],
    },
    {
      title: 'Fixed-width fixed-alphabet data',
      context:
        'Sorting UUID strings or fixed-width codes; radix-LSD works on chunks of sorted digits from least to most significant, ideal for crypto and hashing tools.',
      tags: ['integers', 'large-data', 'stable', 'order-preserving'],
    },
    {
      title: 'LSD for consistent stable buckets',
      context:
        'We place radix-LSD in the stable shortlist because its least-significant-first passes are stable, giving a deterministic order for equal heavy-ish keys.',
      tags: ['stable', 'integers', 'large-data', 'deterministic', 'large-data'],
    },
  ],
  bucket: [
    {
      title: 'Uniform distribution fast path',
      context:
        'A scoreboard of nearly uniformly distributed float scores; bucket sort scatters them into ranges then inserts, which shines when the data genuinely spreads evenly.',
      tags: ['randomized', 'large-data', 'no-deps', 'nearly-sorted'],
    },
    {
      title: 'Bucketting then per-bucket sort',
      context:
        'A log aggregator groups events into coarse buckets first and only then sorts each one; combining bucket with a small insertion sort keeps the work linear on average.',
      tags: ['hybrid-base', 'large-data', 'randomized', 'visualization'],
    },
    {
      title: "Unstable when you don't care",
      context:
        "A deduplication pass that only needs distinct groups, not relative order; bucket sort's fine since stability isn't required and the range distribution is known.",
      tags: ['randomized', 'duplicates', 'large-data', 'memory'],
    },
  ],
};
