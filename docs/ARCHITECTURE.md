# Architecture

## Runtime boundary

`src/lib/worker-client.ts` creates `src/workers/algorithm.worker.ts`. The Worker loads a pinned Pyodide runtime and evaluates `src/python/tracer.py`. Error-line extraction and the counterexample reduction live in `src/lib/errors.ts` and `src/lib/counterexample.ts`, shared between the workspace and the Structures laboratory.

## Interface model

Localization is a `src/lib/i18n.tsx` context provider keyed by `en`/`ru`, with a persisted `localStorage` choice. Library, Benchmarks, Growth, Inspector, Playback, and the header consume the same `t(key)`/`format(key, params)` helpers, so translated labels do not drift between screens.

## Runtime boundary

`src/lib/worker-client.ts` creates `src/workers/algorithm.worker.ts`. The Worker loads a pinned Pyodide runtime and evaluates `src/python/tracer.py`. Browser data is serialized to JSON before it enters Python, and Python returns JSON text rather than a `PyProxy`.
The main thread owns a hard timeout. If synchronous Python cannot be interrupted, the client terminates the Worker and creates a fresh runtime.

## Trace model

`TrackedList` records indexed reads and writes. `TrackedValue` records comparisons while preserving normal Python comparison syntax. `sys.settrace` records source lines, calls, and returns.

Each captured event contains the array snapshot needed by the first MVP visualizer. Trace mode limits both input size and event count. A later format can replace snapshots with deltas and periodic checkpoints for larger traces.

## Analysis model

Complexity analysis runs the same source over controlled input families and sizes. Instrumented runs count semantic operations. Separate uninstrumented runs measure local elapsed time after a warm-up validation. Benchmark timing uses adaptive batches so sub-millisecond algorithms do not collapse to a zero-duration clock sample; the reported value remains the median time per run.

The client fits measured points to common growth functions using linear least squares. The UI labels this as an empirical estimate, never a proof of asymptotic complexity.

## Algorithm catalog

Each reference implementation is an actual `.py` file in `src/algorithms/python`. Vite imports the source with `?raw`, while Python tests execute the same file directly. `src/algorithms/catalog.ts` adds problem and contract identity, complexity, traits, explanations, and learning inputs. Library, Benchmarks, and Growth therefore cannot drift onto different implementations.

Benchmark selection is contract-gated. Algorithms enter the same board only when they consume and return the same data shape. All selected implementations receive the same input, runtime measurements are uninstrumented, and operation counts come from separate traces so instrumentation overhead does not contaminate timing.

Non-sorting catalog packs use a separate `solve(data)` execution lane. JSON input crosses the same Worker boundary, Python returns JSON-safe output, and the hard timeout can terminate the runtime. This lane deliberately does not enter sorting traces, references, Growth, or Benchmarks; those tools rely on the stronger mutable numeric-array contract.

Language source variants are modeled separately from execution. `language-sources.ts` keeps reviewed implementations keyed by catalog ID and language, while unavailable variants are rendered explicitly rather than silently falling back to Python. Browser execution for C#, Java, C++, C, and Go is a later WASM adapter concern; source display does not claim those runtimes are installed.

Library documents are separate from the persisted personal draft. Opening an example changes the active editor document but does not write to `algoscope:draft:v2`; the user must explicitly choose `Save copy` to replace the personal draft.

## Structure frames

`src/labs/lab-engine.ts` converts Stack, Min Heap, BFS, DFS, and weighted Dijkstra operations into immutable `LabFrame` records. Every frame contains a domain, action, explanation, and a complete visual state for deterministic backward and forward playback.

Renderers consume the same timeline but select different state fields: a vertical sequence for Stack, a tree plus indexed array for Heap, and visited/frontier/edge state for Graph. Guided operations create these frames in TypeScript.

Python mode sends a `visualize-lab` request through the existing Worker. `src/python/tracer.py` injects `TrackedStack`, `TrackedMinHeap`, or `TrackedGraph` into `run(...)`; wrappers return JSON-safe `LabFrame` records with user source lines. Stack and Heap methods emit state automatically. Graph traversal explicitly reports `visit(...)` and `frontier(...)`, avoiding assumptions about the learner's queue and visited variable names. The Worker and main-thread timeouts apply to these programs exactly as they do to sorting traces.

Sorting trace events also carry bounded JSON-safe locals, call depth, call stack, and aggregate source-line operation counts. The editor and inspector consume these fields without retaining Python proxies.

## Security boundary

Pyodide is an isolation mechanism for responsiveness, not a complete security sandbox. The MVP assumes users execute their own code. Time limits, event limits, Worker termination, and no backend reduce risk, but shared untrusted programs must not be treated as safe.
