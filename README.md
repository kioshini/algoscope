# AlgoScope

**See algorithms think.** AlgoScope is a browser-based library of executable algorithms with step-by-step visualization, fair benchmarks, and empirical complexity analysis. A separate My Lab workspace lets learners run their own Python implementation.

## What it solves

Traditional debuggers show variable values one line at a time. Prebuilt algorithm visualizers rarely connect behavior to trustworthy measurements. AlgoScope lets a learner choose a tested implementation or paste their own `sort(values)` function and answer three questions in one workspace:

- What is my code doing right now?
- Which operations make it expensive?
- On which inputs does it lose to a standard algorithm?

## Current MVP

- Browser-only Python execution with Pyodide
- Step-by-step array visualization
- Source-line, read, comparison, write, call, and return events
- Correctness validation against the expected sorted output
- Benchmark board for two to five compatible algorithms on identical input
- Empirical growth charts over random, sorted, reversed, and nearly sorted inputs
- Searchable library of 80 executable algorithms across five problem domains
- Visualize, benchmark, analyze, and worst-case actions from library entries
- Separate personal draft that is never overwritten by a library example
- Interactive Stack operations with a reversible event history
- Min Heap shown simultaneously as a tree and indexed array
- Editable Python `run(...)` programs for Stack, Min Heap, BFS, and DFS
- Weighted graph editor with drag, delete, undo, BFS, DFS, and Dijkstra
- Shareable URL state, local run history, challenges, and counterexample search
- Variable, call-stack, and per-line operation inspection
- Hard cancellation by terminating and recreating the Web Worker
- Responsive light and dark interface
- Cross-language source workspace for Python, C#, Java, C++, C, and Go

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite. The first load downloads the pinned Pyodide runtime.

## Checks

```bash
npm run check
```

## Supported function contract

```python
def sort(values):
    # Mutate values in place, return it or return None.
    return values
```

The MVP supports numeric lists up to 40 items in trace mode. Slice assignment, arbitrary package imports, and opaque C-level operations such as `list.sort()` are outside the supported visualization contract.

## Algorithm library

The completed catalog contains 80 implementations: Sorting 30, Searching 10, Graph 15, String 12, and Dynamic Programming 13. Every entry links metadata to executable Python under `src/algorithms/python/`. Sorting entries use the instrumented `sort(values)` workspace; other domains run editable JSON examples through an isolated `solve(data)` contract directly in Library.

Catalog entries declare their problem and executable contract. A benchmark accepts only algorithms with the same contract, preventing misleading cross-problem rankings. Counting Sort and Radix LSD Sort require integer arrays; the other sorting implementations use the numeric-array contract. The 80-algorithm target and remaining packs are documented in [`docs/CATALOG_ROADMAP.md`](docs/CATALOG_ROADMAP.md).

Library also links to seven interactive labs: Stack Operations, Min Heap Insert, Min Heap Extract, Bottom-up Heapify, BFS, DFS, and Dijkstra.

## Structure laboratory

The `Structures` mode uses one frame timeline for three visual models:

- Stack: push, pop, peek, underflow, and LIFO state
- Min Heap: insert, extract-min, heapify, comparisons, and sift paths
- Graph: weighted edge editing, draggable nodes, undo, directed mode, frontier state, BFS, DFS, and Dijkstra

Guided operations run through a deterministic TypeScript frame engine. Python mode injects `TrackedStack`, `TrackedMinHeap`, or `TrackedGraph` into a user-defined `run(...)` function and converts operations into the same `LabFrame` timeline. Structure execution remains isolated from the established sorting `sort(values)` contract.

Stack and Heap wrappers emit frames automatically from methods such as `push`, `pop`, `insert`, and `extract_min`. Graph programs use `neighbors(...)` for adjacency and explicitly call `visit(...)` and `frontier(...)` so the visual state does not depend on guessed variable names.

## Architecture

React owns the workspace and SVG visualizations. A dedicated module Worker owns one Pyodide runtime. Requests and responses cross the JS/Python boundary as JSON strings, avoiding leaked `PyProxy` objects. Tracing and timing are separate runs so instrumentation overhead does not contaminate the local benchmark.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for details.

## Status

AlgoScope now ships the complete 80-algorithm catalog. Sorting algorithms support trace visualization, Benchmarks, and Growth; Searching, Graph, String, and Dynamic Programming entries provide executable contract-bound examples in Library.

The language tabs currently provide reviewed source implementations for the core Bubble, Quick, Merge, Binary Search, BFS, KMP, and Fibonacci examples in C#, Java, C++, C, and Go. Other entries clearly show when a language source is not available yet. Python remains the only browser-executable language until the corresponding WASM runtimes are added.

## License

MIT
