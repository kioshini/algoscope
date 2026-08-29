# Product brief

## Problem

Learners encounter source code, execution diagrams, and Big O notation as separate representations. Debuggers expose state but not behavior at scale. Existing visualizers usually demonstrate fixed reference implementations, while benchmark tools provide numbers without explaining where the cost comes from.

## Promise

AlgoScope makes a large tested algorithm catalog explorable: users can see an implementation execute, compare compatible alternatives under identical conditions, and connect operations to a measured growth curve.

## Primary job

When I need to understand or choose an algorithm, let me find a tested implementation, see what it does, and compare it fairly with alternatives. When I need to experiment, let me bring my own Python code into the same observatory.

## MVP boundary

The first release provides eighty executable Python algorithms across Sorting, Searching, Graph, String, and Dynamic Programming. Sorting connects to trace visualization, multi-algorithm Benchmarks, worst-case inputs, and Growth. Other domains expose editable JSON examples through a generic `solve(data)` runtime inside Library. My Lab remains an optional custom sorting workspace. The app does not infer a formal complexity proof or rank algorithms with incompatible contracts.

Cross-language source tabs now cover reviewed core examples in C#, Java, C++, C, and Go. Runtime execution for those languages is intentionally not implied: Python is the current browser runtime, while WASM adapters are the next implementation milestone.

The Structures laboratory adds interactive Stack, Min Heap, BFS, DFS, and weighted Dijkstra lessons. It connects each operation to a reversible timeline and exposes invariants, frontier state, shortest-path distances, tree relationships, and indexed storage instead of presenting structures as static diagrams. Learners can switch from guided controls to editable Python `run(...)` programs backed by instrumented structure wrappers; code is retained locally per laboratory.
