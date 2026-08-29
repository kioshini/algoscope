import type { SolveAlgorithmDefinition } from '../types';

import aStarSource from '../python/a_star.py?raw';
import bellmanFordSource from '../python/bellman_ford.py?raw';
import bfsSource from '../python/bfs.py?raw';
import connectedComponentsSource from '../python/connected_components.py?raw';
import cycleDetectionSource from '../python/cycle_detection.py?raw';
import dfsSource from '../python/dfs.py?raw';
import dfsTopologicalSource from '../python/dfs_topological.py?raw';
import dijkstraSource from '../python/dijkstra.py?raw';
import floydWarshallSource from '../python/floyd_warshall.py?raw';
import kahnTopologicalSource from '../python/kahn_topological.py?raw';
import kosarajuSccSource from '../python/kosaraju_scc.py?raw';
import kruskalMstSource from '../python/kruskal_mst.py?raw';
import primMstSource from '../python/prim_mst.py?raw';
import tarjanSccSource from '../python/tarjan_scc.py?raw';
import unionFindConnectivitySource from '../python/union_find_connectivity.py?raw';

export const GRAPH_ALGORITHMS: SolveAlgorithmDefinition[] = [
  {
    kind: 'solve',
    id: 'breadth-first-search',
    problem: 'Graph',
    contract: 'graph-traversal',
    name: 'Breadth-First Search',
    family: 'Traversal',
    level: 'Beginner',
    summary: 'Visits a graph layer by layer and computes unweighted distances from a start node.',
    explanation: [
      'Build an adjacency list from the declared nodes and edges.',
      'Expand the lexically smallest neighbors of each queued node.',
      'Return discovery order and null for unreachable distances.',
    ],
    limitation: 'Distances count edges, so weighted shortest paths require another algorithm.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: bfsSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'D'],
          ['C', 'D'],
        ],
        directed: false,
        start: 'A',
      },
      expected: { order: ['A', 'B', 'C', 'D'], distances: { A: 0, B: 1, C: 1, D: 2, E: null } },
    },
    tags: ['graph', 'traversal', 'queue', 'unweighted'],
  },
  {
    kind: 'solve',
    id: 'depth-first-search',
    problem: 'Graph',
    contract: 'graph-traversal',
    name: 'Depth-First Search',
    family: 'Traversal',
    level: 'Beginner',
    summary: 'Explores one graph branch at a time with an explicit stack.',
    explanation: [
      'Build deterministic adjacency lists.',
      'Push undiscovered neighbors while recording their parent.',
      'Return the reachable preorder and the parent map.',
    ],
    limitation: 'Traversal order is not a shortest-path guarantee.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: dfsSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'D'],
          ['C', 'D'],
        ],
        directed: false,
        start: 'A',
      },
      expected: { order: ['A', 'B', 'D', 'C'], parents: { A: null, B: 'A', C: 'A', D: 'B', E: null } },
    },
    tags: ['graph', 'traversal', 'stack'],
  },
  {
    kind: 'solve',
    id: 'dijkstra',
    problem: 'Graph',
    contract: 'weighted-single-source-shortest-path',
    name: "Dijkstra's Algorithm",
    family: 'Shortest Path',
    level: 'Intermediate',
    summary: 'Computes single-source shortest paths in a non-negative weighted graph.',
    explanation: [
      'Initialize the start distance to zero.',
      'Repeatedly settle the closest queued node and relax its edges.',
      'Use lexical predecessor tie-breaking for equal distances.',
    ],
    limitation: 'Rejects negative edge weights because greedy settlement is invalid for them.',
    complexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)',
      memory: 'O(V + E)',
    },
    source: dijkstraSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'B', 4],
          ['A', 'C', 1],
          ['C', 'B', 2],
          ['B', 'D', 1],
          ['C', 'D', 5],
        ],
        directed: true,
        start: 'A',
      },
      expected: { distances: { A: 0, B: 3, C: 1, D: 4 }, previous: { A: null, B: 'C', C: 'A', D: 'B' } },
    },
    tags: ['graph', 'shortest-path', 'weighted', 'heap'],
  },
  {
    kind: 'solve',
    id: 'bellman-ford',
    problem: 'Graph',
    contract: 'weighted-single-source-shortest-path',
    name: 'Bellman-Ford Algorithm',
    family: 'Shortest Path',
    level: 'Intermediate',
    summary: 'Computes shortest paths with negative edges and detects reachable negative cycles.',
    explanation: [
      'Set all distances except the source to infinity.',
      'Relax every directed arc up to V minus one times.',
      'Run one more check for a reachable improving edge.',
    ],
    limitation: 'Distances are not meaningful shortest paths when negative_cycle is true.',
    complexity: { best: 'O(E)', average: 'O(VE)', worst: 'O(VE)', memory: 'O(V)' },
    source: bellmanFordSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'S'],
        edges: [
          ['S', 'A', 4],
          ['S', 'B', 5],
          ['A', 'B', -2],
          ['B', 'C', 3],
        ],
        directed: true,
        start: 'S',
      },
      expected: {
        distances: { A: 4, B: 2, C: 5, S: 0 },
        previous: { A: 'S', B: 'A', C: 'B', S: null },
        negative_cycle: false,
      },
    },
    tags: ['graph', 'shortest-path', 'negative-weights', 'cycle-detection'],
  },
  {
    kind: 'solve',
    id: 'floyd-warshall',
    problem: 'Graph',
    contract: 'weighted-all-pairs-shortest-path',
    name: 'Floyd-Warshall Algorithm',
    family: 'Shortest Path',
    level: 'Advanced',
    summary: 'Computes shortest distances between every ordered pair of nodes.',
    explanation: [
      'Initialize direct edge costs and zero diagonals.',
      'Allow each node in turn as an intermediate.',
      'Inspect the diagonal to detect a negative cycle.',
    ],
    limitation: 'Cubic time and quadratic storage make it unsuitable for large sparse graphs.',
    complexity: { best: 'O(V^3)', average: 'O(V^3)', worst: 'O(V^3)', memory: 'O(V^2)' },
    source: floydWarshallSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          ['A', 'B', 3],
          ['B', 'C', 2],
          ['A', 'C', 10],
        ],
        directed: true,
      },
      expected: {
        distances: { A: { A: 0, B: 3, C: 5 }, B: { A: null, B: 0, C: 2 }, C: { A: null, B: null, C: 0 } },
        negative_cycle: false,
      },
    },
    tags: ['graph', 'shortest-path', 'all-pairs', 'dynamic-programming'],
  },
  {
    kind: 'solve',
    id: 'a-star',
    problem: 'Graph',
    contract: 'coordinate-weighted-point-to-point-path',
    name: 'A* Search',
    family: 'Heuristic Search',
    level: 'Advanced',
    summary: 'Uses Euclidean coordinates to prioritize a weighted route from start to goal.',
    explanation: [
      'Track best-known path costs from the start.',
      'Prioritize candidates by path cost plus Euclidean goal distance.',
      'Reconstruct the selected route from predecessor links.',
    ],
    limitation: 'A non-admissible coordinate heuristic can increase work; negative weights are rejected.',
    complexity: {
      best: 'O(E)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)',
      memory: 'O(V + E)',
      note: 'Bounds reflect the heap implementation with node reopening.',
    },
    source: aStarSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'B', 1],
          ['A', 'C', 1],
          ['B', 'D', 1],
          ['C', 'D', 1],
        ],
        directed: false,
        start: 'A',
        goal: 'D',
        coordinates: { A: [0, 0], B: [1, 0], C: [0, 1], D: [1, 1] },
      },
      expected: { path: ['A', 'B', 'D'], distance: 2 },
    },
    tags: ['graph', 'shortest-path', 'heuristic', 'coordinates'],
  },
  {
    kind: 'solve',
    id: 'dfs-topological-sort',
    problem: 'Graph',
    contract: 'directed-acyclic-ordering',
    name: 'DFS Topological Sort',
    family: 'DAG Ordering',
    level: 'Intermediate',
    summary: 'Produces a dependency order by reverse DFS finish time.',
    explanation: [
      'Visit every node in the directed graph.',
      'Append nodes after all outgoing neighbors finish.',
      'Reject a back edge as a directed cycle.',
    ],
    limitation: 'Only directed acyclic graphs have a topological ordering.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: dfsTopologicalSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'C'],
          ['B', 'C'],
          ['C', 'D'],
        ],
      },
      expected: { order: ['A', 'B', 'C', 'D'] },
    },
    tags: ['graph', 'dag', 'topological-sort', 'dfs'],
  },
  {
    kind: 'solve',
    id: 'kahn-topological-sort',
    problem: 'Graph',
    contract: 'directed-acyclic-ordering',
    name: 'Kahn Topological Sort',
    family: 'DAG Ordering',
    level: 'Intermediate',
    summary: 'Produces a dependency order by repeatedly removing zero-indegree nodes.',
    explanation: [
      "Count each node's incoming edges.",
      'Select the lexically smallest zero-indegree node.',
      'Reject the graph if any nodes remain after processing.',
    ],
    limitation: 'Only directed acyclic graphs have a topological ordering.',
    complexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)',
      memory: 'O(V + E)',
    },
    source: kahnTopologicalSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'C'],
          ['B', 'C'],
          ['C', 'D'],
        ],
      },
      expected: { order: ['A', 'B', 'C', 'D'] },
    },
    tags: ['graph', 'dag', 'topological-sort', 'indegree'],
  },
  {
    kind: 'solve',
    id: 'connected-components',
    problem: 'Graph',
    contract: 'undirected-components',
    name: 'Connected Components',
    family: 'Connectivity',
    level: 'Beginner',
    summary: 'Partitions an undirected graph into maximal connected groups.',
    explanation: [
      'Start a traversal at each unvisited node.',
      'Collect every node reachable through undirected edges.',
      'Sort members and groups for stable output.',
    ],
    limitation: 'For directed mutual reachability, use a strongly connected components algorithm.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: connectedComponentsSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          ['A', 'B'],
          ['C', 'D'],
        ],
      },
      expected: { components: [['A', 'B'], ['C', 'D'], ['E']], count: 3 },
    },
    tags: ['graph', 'connectivity', 'undirected', 'components'],
  },
  {
    kind: 'solve',
    id: 'cycle-detection',
    problem: 'Graph',
    contract: 'graph-cycle-detection',
    name: 'Cycle Detection',
    family: 'Connectivity',
    level: 'Intermediate',
    summary: 'Detects a cycle using recursion-state or parent-aware DFS.',
    explanation: [
      'Build directed or undirected adjacency sets.',
      'Track active ancestors for directed graphs or parents for undirected graphs.',
      'Stop when an edge closes a cycle.',
    ],
    limitation: 'Parallel undirected edges are coalesced and therefore do not form a two-edge multigraph cycle.',
    complexity: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: cycleDetectionSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          ['A', 'B'],
          ['B', 'C'],
          ['C', 'A'],
        ],
        directed: true,
      },
      expected: { has_cycle: true },
    },
    tags: ['graph', 'cycle', 'dfs', 'directed', 'undirected'],
  },
  {
    kind: 'solve',
    id: 'kosaraju-scc',
    problem: 'Graph',
    contract: 'directed-strongly-connected-components',
    name: 'Kosaraju SCC',
    family: 'Strong Connectivity',
    level: 'Advanced',
    summary: 'Finds strongly connected components with two DFS passes.',
    explanation: [
      'Record nodes in first-pass finish order.',
      'Traverse the transposed graph in reverse finish order.',
      'Collect each traversal tree as one SCC.',
    ],
    limitation: 'Requires storing both the graph and its transpose.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: kosarajuSccSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'B'],
          ['B', 'A'],
          ['B', 'C'],
          ['C', 'D'],
          ['D', 'C'],
        ],
      },
      expected: {
        components: [
          ['A', 'B'],
          ['C', 'D'],
        ],
        count: 2,
      },
    },
    tags: ['graph', 'scc', 'dfs', 'transpose'],
  },
  {
    kind: 'solve',
    id: 'tarjan-scc',
    problem: 'Graph',
    contract: 'directed-strongly-connected-components',
    name: 'Tarjan SCC',
    family: 'Strong Connectivity',
    level: 'Advanced',
    summary: 'Finds strongly connected components in one DFS using low-link values.',
    explanation: [
      'Assign each newly visited node a discovery index.',
      'Propagate the lowest reachable active index.',
      'Pop one component when a low-link root is found.',
    ],
    limitation: 'Recursive depth can approach the node count on a long chain.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', memory: 'O(V + E)' },
    source: tarjanSccSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'B'],
          ['B', 'A'],
          ['B', 'C'],
          ['C', 'D'],
          ['D', 'C'],
        ],
      },
      expected: {
        components: [
          ['A', 'B'],
          ['C', 'D'],
        ],
        count: 2,
      },
    },
    tags: ['graph', 'scc', 'dfs', 'low-link'],
  },
  {
    kind: 'solve',
    id: 'prim-mst',
    problem: 'Graph',
    contract: 'undirected-weighted-minimum-spanning-forest',
    name: "Prim's MST",
    family: 'Minimum Spanning Tree',
    level: 'Intermediate',
    summary: 'Grows a minimum spanning tree, or one tree per disconnected component.',
    explanation: [
      'Start at the smallest unvisited node.',
      'Select the lightest boundary edge with lexical tie-breaking.',
      'Repeat for remaining components to return a forest.',
    ],
    limitation: 'The input contract is undirected; disconnected input yields connected false.',
    complexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', memory: 'O(V + E)' },
    source: primMstSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'B', 1],
          ['A', 'C', 4],
          ['B', 'C', 2],
          ['B', 'D', 5],
          ['C', 'D', 3],
        ],
      },
      expected: {
        edges: [
          ['A', 'B', 1],
          ['B', 'C', 2],
          ['C', 'D', 3],
        ],
        total_weight: 6,
        connected: true,
      },
    },
    tags: ['graph', 'mst', 'weighted', 'greedy', 'heap'],
  },
  {
    kind: 'solve',
    id: 'kruskal-mst',
    problem: 'Graph',
    contract: 'undirected-weighted-minimum-spanning-forest',
    name: "Kruskal's MST",
    family: 'Minimum Spanning Tree',
    level: 'Intermediate',
    summary: 'Builds a minimum spanning forest by accepting light edges that join components.',
    explanation: [
      'Sort normalized edges by weight and endpoints.',
      'Use disjoint sets to reject cycle-forming edges.',
      'Accumulate accepted edges and total weight.',
    ],
    limitation: 'The input contract is undirected; disconnected input yields connected false.',
    complexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', memory: 'O(V)' },
    source: kruskalMstSource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          ['A', 'B', 1],
          ['A', 'C', 4],
          ['B', 'C', 2],
          ['B', 'D', 5],
          ['C', 'D', 3],
        ],
      },
      expected: {
        edges: [
          ['A', 'B', 1],
          ['B', 'C', 2],
          ['C', 'D', 3],
        ],
        total_weight: 6,
        connected: true,
      },
    },
    tags: ['graph', 'mst', 'weighted', 'greedy', 'union-find'],
  },
  {
    kind: 'solve',
    id: 'union-find-connectivity',
    problem: 'Graph',
    contract: 'undirected-connectivity-queries',
    name: 'Union-Find Connectivity',
    family: 'Disjoint Sets',
    level: 'Intermediate',
    summary: 'Answers connectivity queries after unioning all supplied undirected edges.',
    explanation: [
      'Initialize one disjoint set per node.',
      'Union edge endpoints by rank with path compression.',
      'Compare query roots and emit the final component partition.',
    ],
    limitation: 'Queries are a read-only batch after all edges, not interleaved updates.',
    complexity: {
      best: 'O(V + E + Q)',
      average: 'O((V + E + Q) alpha(V))',
      worst: 'O((V + E + Q) alpha(V))',
      memory: 'O(V)',
    },
    source: unionFindConnectivitySource,
    demo: {
      input: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          ['A', 'B'],
          ['B', 'C'],
          ['D', 'E'],
        ],
        queries: [
          ['A', 'C'],
          ['A', 'D'],
          ['D', 'E'],
        ],
      },
      expected: {
        connected: [true, false, true],
        components: [
          ['A', 'B', 'C'],
          ['D', 'E'],
        ],
      },
    },
    tags: ['graph', 'connectivity', 'union-find', 'queries'],
  },
];
