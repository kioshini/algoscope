import type { AlgorithmUseCase } from './types';

export const SEARCHING_USE_CASES: Record<string, AlgorithmUseCase[]> = {
  'search-linear-first': [
    {
      title: 'Config-file key check',
      context:
        'A parser scans a small ini-style config to confirm a key exists before reading it. The key is almost never at the end, and the file grows line by line, so a plain forward scan is the cheapest correct option and returns the first match as the file is read top to bottom.',
      tags: ['unsorted', 'lookup', 'first-occurrence'],
    },
    {
      title: 'Detect a feature flag in a list',
      context:
        'A list of enabled feature names is checked at startup. The list is short and unordered and the same check runs for every request, so iterating once and stopping at the first hit avoids the cost of sorting and keeps the check predictable.',
      tags: ['unsorted', 'lookup', 'early-exit'],
    },
    {
      title: 'Scan a small validation queue',
      context:
        'A job router tracks a handful of pending workers and asks whether a given worker id is already queued. The queue is tiny and mostly changed by appends, so the first-match scan is simpler than maintaining an index and gives an accurate dup-check.',
      tags: ['unsorted', 'lookup', 'duplicate-first'],
    },
  ],
  'search-sentinel-first': [
    {
      title: 'Streaming telemetry filter',
      context:
        'A high-throughput telemetry sink appends a sentinel value to each small packet buffer before scanning it, letting the loop drop the both-ends bound check on every iteration. This shaves repeated comparisons at the hot path of an event meter.',
      tags: ['unsorted', 'lookup', 'first-occurrence', 'no-bounds-check'],
    },
    {
      title: 'Realtime search box autocomplete',
      context:
        'An autocomplete list is searched on every keystroke. Placing the query at the end of a reusable scratch array means the scan never needs a length check per item, which keeps each keystroke responsive even though the list is unsorted.',
      tags: ['unsorted', 'lookup', 'incremental'],
    },
    {
      title: 'Interactive list highlight',
      context:
        'A component scans a recently viewed item list to decide which row to highlight, treating the item as a sentinel at the end of the array so the comparison loop is a single tight condition. The list is small and reordered frequently, so sorting would cost more than it saves.',
      tags: ['unsorted', 'lookup', 'first-occurrence'],
    },
  ],
  'search-binary-first': [
    {
      title: 'Index lookup in an ordered table',
      context:
        'A dashboard resolves a user id against a list sorted by id. With tens of thousands of rows and a log-n lookup, clicking around the table stays fast, and binary search gives the exact row or a clean miss for an id that never existed.',
      tags: ['sorted', 'lookup', 'log-n'],
    },
    {
      title: 'Version pin resolution',
      context:
        'A package manager keeps a sorted array of published versions and locates the best one for a range requirement. Binary search pins down the candidate without scanning the whole array, which keeps resolution O(log n) on big registry caches.',
      tags: ['sorted', 'lookup', 'bounds', 'log-n'],
    },
    {
      title: 'Time-series tick lookup',
      context:
        'A charting client stores timestamps in ascending order and needs to fetch the data point for a specific millisecond. A binary search finds the exact index so the next frame reads the same slice again with O(1) access.',
      tags: ['sorted', 'lookup', 'log-n'],
    },
  ],
  'search-lower-bound': [
    {
      title: 'Paginated table start page',
      context:
        'A UI shows records sorted by price and must return the first row where price is at least a filter threshold. The lower-bound index becomes the pagination start, so the backend jumps straight to the correct page instead of filtering the whole result set.',
      tags: ['sorted', 'bounds', 'insertion-point', 'log-n'],
    },
    {
      title: 'Insert position for sorted prepend',
      context:
        'A leaderboard maintains a sorted score list and inserts a new entry. The lower-bound search returns the position where the new score belongs, preserving ordering and producing a stable insertion point before the first equal score.',
      tags: ['sorted', 'insertion-point', 'duplicate-first', 'log-n'],
    },
    {
      title: 'Cross-reference interval start',
      context:
        'A meeting scheduler holds a sorted array of free-slot starts and uses lower-bound to find the earliest slot at or after a requested minute. It returns a candidate index even when no exact minute exists, which is exactly what interval matching needs.',
      tags: ['sorted', 'bounds', 'log-n'],
    },
  ],
  'search-upper-bound': [
    {
      title: 'Bound a numeric range for a filter',
      context:
        'A stats panel groups records into buckets and needs the first index strictly greater than a max value. Upper-bound gives the exclusive end of a range, so a pair of lower/upper calls defines any slice without scanning the whole array.',
      tags: ['sorted', 'bounds', 'log-n'],
    },
    {
      title: 'Count duplicates in a sorted column',
      context:
        'An analytics tool counts how many scores equal a target by subtracting upper-bound from lower-bound. Computing both bounds returns the size of a repeated run in O(log n) without a linear pass.',
      tags: ['sorted', 'bounds', 'duplicate-first', 'log-n'],
    },
    {
      title: 'Date-range window boundaries',
      context:
        'A calendar feed needs all events strictly before an exclusive end timestamp. The upper-bound search calculates that exclusive boundary, letting the query pull a clean week window from an already-sorted list.',
      tags: ['sorted', 'bounds', 'database-index', 'log-n'],
    },
  ],
  'search-jump-first': [
    {
      title: 'Chunked seek in a large ordered feed',
      context:
        'A feed reader jumps in blocks of a few hundred to narrow toward a target item in a huge sorted log, where each row is fetched from disk. Jump search reduces the number of reads versus a linear pass and skips enough to beat a plain scan.',
      tags: ['sorted', 'lookup', 'block-seek', 'log-n'],
    },
    {
      title: 'Sparse pagination cursor',
      context:
        'An API uses keyset pagination over an ordered table and needs to detect an offset quickly. Jump search moves in page-sized steps to reach the cursor index, so the cursor resolves without loading every earlier row.',
      tags: ['sorted', 'bounds', 'database-index'],
    },
    {
      title: 'In-memory large sorted array probe',
      context:
        'A batch job holds a big sorted buffer in memory and needs a few lookups. Jump search is an easy middle ground when the array is large enough that linear is slow but binary search overhead is unnecessary, especially with cache-friendly block reading.',
      tags: ['sorted', 'lookup', 'log-n'],
    },
  ],
  'search-exponential-first': [
    {
      title: 'Find a boundary in a growing log',
      context:
        'An unbounded log is appended over time and a job wants the newest entry at or after a given timestamp. Exponential search doubles outward from the start until it crosses the target, then binary-searches the found range, so it costs nothing when the target is near the top.',
      tags: ['sorted', 'bounds', 'incremental'],
    },
    {
      title: 'Unknown-length remote dataset',
      context:
        'A client queries a paginated list without knowing the total row count and wants to locate a specific id. Exponential search doubles the page size until it finds a range containing the id, so it locates data without ever fetching the whole set.',
      tags: ['sorted', 'lookup', 'incremental', 'database-index'],
    },
    {
      title: 'Range check on a sparse array',
      context:
        'A sparse array of time buckets only allocates buckets that actually contain data. Exponential search finds the first allocated bucket at or after a target, skipping long empty stretches cheaply and then narrowing with binary search.',
      tags: ['sorted', 'bounds', 'incremental', 'log-n'],
    },
  ],
  'search-interpolation-first': [
    {
      title: 'Search a uniformly-sized phone directory',
      context:
        'A name resolver over a dense, evenly distributed phone-book array is a perfect candidate for interpolation search, which guesses the position near the target and beats binary search on this near-uniform distribution.',
      tags: ['sorted', 'lookup', 'distribution', 'log-n'],
    },
    {
      title: 'Locate a bank of sensor readings',
      context:
        'A sensor array records readings at a steady rate, so values are roughly linear. Interpolation search uses that distribution to jump close to the expected position, giving fewer comparisons than binary search for this kind of numeric data.',
      tags: ['sorted', 'lookup', 'distribution'],
    },
    {
      title: 'Score lookup over a numeric scale',
      context:
        'A grading engine maps a numeric score to a band across a sorted cut-off list that is nearly evenly spaced. The interpolation estimate lands the search inside the right region almost immediately, making lookups cheap for a target-heavy load.',
      tags: ['sorted', 'bounds', 'distribution', 'log-n'],
    },
  ],
  'search-fibonacci-first': [
    {
      title: 'Cache-friendly lookup on a hot array',
      context:
        'A frequently accessed sorted array benefits from Fibonacci search, which uses only addition to split and produces fewer jumps than binary search, keeping cache lines warm in a tight real-time loop.',
      tags: ['sorted', 'lookup', 'cache-friendly', 'log-n'],
    },
    {
      title: 'Disk-index range probe',
      context:
        'A metadata index lives on disk and each access is a page read. Fibonacci search reduces the number of probes versus binary search by moving in golden-ratio-sized steps, so it is softer on storage I/O for a sparse index.',
      tags: ['sorted', 'lookup', 'database-index', 'log-n'],
    },
    {
      title: 'Find the start of a run in a sorted column',
      context:
        'A column store receives a value and wants the first occurrence in an ordered block. Fibonacci search homes in on the run start with fewer memory accesses, which matters when the block is large and repeated lookups are common.',
      tags: ['sorted', 'first-occurrence', 'log-n'],
    },
  ],
  'search-quickselect-kth': [
    {
      title: 'Find the median of a metric',
      context:
        'A monitoring pipeline wants the median latency without sorting the whole log. Quickselect partitions around a pivot and narrows to the middle percentile in expected O(n), giving a robust outlier-median for the dashboard.',
      tags: ['unsorted', 'kth-order', 'partition'],
    },
    {
      title: 'Top-N item ranking',
      context:
        'A storefront needs the most expensive N products to fill a promo carousel. Quickselect finds the Nth ranked item in place and leaves the top-N in position, so it avoids the cost of a full sort when only the cut-off matters.',
      tags: ['unsorted', 'kth-order', 'partition'],
    },
    {
      title: 'Percentile cutoff for thresholds',
      context:
        'An anomaly detector computes the 95th percentile of request durations to set an alert threshold. Quickselect returns the exact kth value in expected linear time, so thresholds update on live traffic without sorting the entire window.',
      tags: ['unsorted', 'kth-order', 'partition'],
    },
  ],
};
