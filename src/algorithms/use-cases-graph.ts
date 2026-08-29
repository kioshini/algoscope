import type { AlgorithmUseCase } from './types';

export const GRAPH_USE_CASES: Record<string, AlgorithmUseCase[]> = {
  'breadth-first-search': [
    {
      title: 'Shortest number-of-stops flight routing',
      context:
        "A travel aggregator treats airports as nodes and direct routes as edges, then runs BFS from the origin to the destination. Every edge has equal cost (one flight), so BFS yields whichever route uses the fewest hops. Airlines use this to answer 'cheapest in connections' queries before pricing is layered in.",
      tags: ['unweighted', 'pathfinding', 'road-network'],
    },
    {
      title: 'Social graph friend recommendation at depth 2',
      context:
        "A platform expands a user's social network one layer at a time with BFS to find 'friends of friends' who are not yet connected. Bounds on level keep the expansion local, and the level property naturally deduplicates direct friends from distant connections.",
      tags: ['unweighted', 'graph-traversal'],
    },
    {
      title: 'Web crawler frontier seeded by URL breadth',
      context:
        'A crawler treats pages as nodes and hyperlinks as directed edges. BFS orders the crawl so pages close to the seed are fetched first, mimicking a growing ring of discovered URLs and keeping the frontier queue small and predictable.',
      tags: ['unweighted', 'graph-traversal'],
    },
  ],
  'depth-first-search': [
    {
      title: 'Flood-fill for interactive map region selection',
      context:
        'A GIS editor lets users click a connected region of identical terrain. DFS recursively expands to every reachable same-colour cell, and the recursion stack naturally backtracks when a boundary is hit, so irregular contiguous zones are captured in one pass.',
      tags: ['unweighted', 'connectivity'],
    },
    {
      title: 'Dead-end detection in a maze solver',
      context:
        'A robotics lab drones a maze graph. DFS commits to one corridor, goes as deep as possible, and backtracks on hitting a wall, recording the decision path. Because it walks a full branch before retreating, it reliably finds an exit if one exists, even in tight loops.',
      tags: ['unweighted', 'graph-traversal'],
    },
    {
      title: 'Discovering weakly connected islands in a file tree',
      context:
        'A backup tool models files as nodes and hardlink/symlink edges as directed arcs. DFS enumerates an entire reachable set from a seed file, revealing which files are merely linked rather than duplicated, which guides what gets stored as a by-reference blob.',
      tags: ['unweighted', 'connectivity'],
    },
  ],
  dijkstra: [
    {
      title: 'GPS shortest driving time between two locations',
      context:
        'A navigation engine weights road edges by predicted travel time. Since edge times are non-negative, Dijkstra greedily settles the nearest frontier node and produces the exact least-time route along a real street graph with millions of nodes.',
      tags: ['weighted', 'pathfinding', 'road-network', 'no-negative-weights'],
    },
    {
      title: 'Lowest-cost network packet forwarding plan',
      context:
        'A backend computes the cheapest way to dispatch a payload from one data centre to every other, weighting edges by per-byte transfer cost. The single-source distances get reused to pick routing tables, so the same non-negative edge weights only need one run.',
      tags: ['weighted', 'single-source', 'network'],
    },
    {
      title: 'Least-energy path for an autonomous warehouse bot',
      context:
        'A fleet manager assigns each floor segment a cost from battery drain. Because obstacle edges never carry negative drain, Dijkstra selects the energy-minimal path across the grid and the same graph is re-queried whenever the chosen robot changes.',
      tags: ['weighted', 'pathfinding', 'offline'],
    },
  ],
  'bellman-ford': [
    {
      title: 'Currency arbitrage across an exchange-rate graph',
      context:
        'A trading desk models currencies as nodes and log exchange rates as edge weights, which can be negative. Bellman-Ford runs V-1 relaxations to detect negative cycles, flagging whether a profitable cycle exists at all rather than just the cheapest unit-conversion path.',
      tags: ['negative-weights', 'cycles'],
    },
    {
      title: 'Cost floor detection in a cross-subsidised delivery network',
      context:
        'A courier bills some routes below marginal glass cost to win volume, so edges can be negative. Bellman-Ford tolerates these and finds the genuinely most economical origin-to-destination path, reporting a negative-cost cycle if the network has no sensible floor.',
      tags: ['negative-weights', 'weighted', 'single-source'],
    },
    {
      title: 'Detecting price-loops in a supply-chain graph',
      context:
        'A procurement team chains suppliers, and some contractual transfer prices are below cost, giving negative arcs. Bellman-Ford both computes reachable prices and raises an error when a negative cycle appears, which is exactly the signature of a self-cancelling loop that must be renegotiated.',
      tags: ['negative-weights', 'cycles', 'weighted'],
    },
  ],
  'floyd-warshall': [
    {
      title: 'All-pairs travel time for a transit fare matrix',
      context:
        'A city planner precomputes the least travel time between every pair of stops in one dense pass. Because re-planning the whole network is cheap enough ahead of time, the resulting matrix backs a route planner that answers from-to queries with O(1) lookups.',
      tags: ['weighted', 'all-pairs', 'road-network'],
    },
    {
      title: 'Shortest reconnection cost for a software component graph',
      context:
        'A refactoring tool measures the cost of a dependency hop between every pair of modules. Floyd-Warshall fills the entire transitive-cost table so a developer can immediately see the cheapest way to reach any module from any other before deciding to break a cycle.',
      tags: ['weighted', 'all-pairs', 'dependency'],
    },
    {
      title: 'Expected latency clusters in a microservice mesh',
      context:
        'An SRE team lets edge weights be measured p99 latency between services. A single all-pairs run exposes hot routes that are fast pairwise but slow end-to-end, guiding which links should be merged or which synthetic monitor probes to eliminate.',
      tags: ['weighted', 'all-pairs', 'network'],
    },
  ],
  'a-star': [
    {
      title: 'Turn-by-turn navigation with a geographical heuristic',
      context:
        'A GPS app bounds the search with straight-line distance to the destination. Because the true travel distance can never be less than the crow-flies estimate, A* returns an optimal path while expanding far fewer nodes than Dijkstra on a dense city grid.',
      tags: ['heuristic', 'pathfinding', 'road-network'],
    },
    {
      title: 'In-game character pathfinding across an obstacle grid',
      context:
        'A game engine keeps an octile-distance heuristic on a tile map. A* lets an AI unit pick a smooth route around walls in real time, and since the heuristic is admissible the path stays optimal while the search stays tight enough for a 60 FPS loop.',
      tags: ['heuristic', 'pathfinding', 'weighted'],
    },
    {
      title: 'Robot motion planning through a cost field',
      context:
        'A warehouse robot avoids accumulated risk on a cost grid, using Euclidean distance to the target as the heuristic. A* balances exploration and exploitation so the robot neither spirals around expensive cells nor clips through blocked ones.',
      tags: ['heuristic', 'pathfinding', 'offline'],
    },
  ],
  'dfs-topological-sort': [
    {
      title: 'Course prerequisite sequencing with detected cycles',
      context:
        'A university system models courses as nodes and prerequisites as directed edges. A DFS post-order visit emits courses only after all their dependencies, and a back edge mid-traversal signals a prerequisite cycle that would make an ordering impossible.',
      tags: ['dag', 'ordering', 'cycles'],
    },
    {
      title: 'Determining a valid build order for a compiled project',
      context:
        'A build orchestrator runs a DFS over source files that each depend on other files, producing a reverse post-order list. The result is a compilation order guaranteeing every header and library is ready before its consumers.',
      tags: ['dag', 'ordering', 'dependency'],
    },
    {
      title: 'Linearising a task DAG for a job scheduler',
      context:
        'A data pipeline lists tasks with directed dependencies. DFS topological sort produces a single linear schedule, so a stream worker can emit jobs in dependency order and detect that a self-dependent task must be split.',
      tags: ['dag', 'ordering', 'dependency'],
    },
  ],
  'kahn-topological-sort': [
    {
      title: 'Incrementally re-scheduling an assembly line',
      context:
        'A line manager keeps an indegree map per station. Across a fresh run, Kahn peels off zero-indegree stations, so the current order can be rebuilt quickly whenever a downstream prerequisite changes.',
      tags: ['dag', 'ordering'],
    },
    {
      title: 'Level-order package manager dependency resolution',
      context:
        'A package installer counts how many unresolved dependencies each package still has. Kahn releases packages whose indegree reaches zero, giving a level-by-level install sequence that naturally surfaces a dependency cycle as leftovers.',
      tags: ['dag', 'ordering', 'dependency', 'cycles'],
    },
    {
      title: 'Layering a spreadsheet formula recalculation',
      context:
        'A spreadsheet engine lets cells reference other cells as a directed acyclic graph. Kahn processes cells with no outstanding references first, so a user edit re-computes only the affected layer rather than recalculating the whole workbook.',
      tags: ['dag', 'ordering'],
    },
  ],
  'connected-components': [
    {
      title: 'Isolating disconnected landmasses in a satellite image',
      context:
        'An image-processing pipeline segments a raster into foreground pixels and runs connected-components to assign an id to each contiguous landmass. Each island gets a label, which feeds perimeter and area statistics with no overlap between regions.',
      tags: ['connectivity', 'unweighted'],
    },
    {
      title: 'Grouping roads into separate reachable networks after a flood',
      context:
        'A transportation authority splits a road graph into connected components. Roads that fall in a component with no way to a hospital reveal entire zones cut off, prioritising which bridges to reopen first.',
      tags: ['connectivity', 'road-network', 'offline'],
    },
    {
      title: "Segmenting a program's call graph into independent libraries",
      context:
        'A profiler treats functions as nodes and call edges as arcs, then (treating the graph as undirected) floods each connected component. This surfaces which libraries can be dropped in isolation during dead-code elimination.',
      tags: ['connectivity', 'unweighted'],
    },
  ],
  'cycle-detection': [
    {
      title: 'Guard against circular imports in a module bundler',
      context:
        'A bundler instruments each import as a directed edge and walks the graph looking for a node reachable from itself. A detected cycle names the exact file pair to break, preventing a load-time crash from mutually dependent modules.',
      tags: ['cycles', 'dependency'],
    },
    {
      title: 'Interrupting a feedback loop in a CI build pipeline',
      context:
        'A CI system treats jobs as nodes and triggers as edges. Detecting a cycle means a job could trigger itself or a closed chain, causing an infinite build. The check runs before any job is dispatched.',
      tags: ['cycles', 'ordering', 'dependency'],
    },
    {
      title: 'Finding a deadlock in a resource-allocation graph',
      context:
        'A database models transactions as nodes and held/requested locks as edges. A cycle-detection pass flags a circular wait, giving the lock manager a concrete set of participants to abort or roll back rather than stalling indefinitely.',
      tags: ['cycles', 'weighted'],
    },
  ],
  'kosaraju-scc': [
    {
      title: 'Collapsing a module graph into strongly coupled units',
      context:
        'A legacy codebase builds a directed graph of imports and splits it into strongly connected components. Each SCC becomes a single refactoring candidate, since classes inside an SCC must be migrated together or not at all.',
      tags: ['scc', 'dependency'],
    },
    {
      title: 'Grouping web pages that mutually reference each other',
      context:
        'A crawler discovers a set of pages that all link one another. Running Kosaraju over the link graph clusters those pages into one community, which demotes spam rings and isolates genuine interlinked site sections.',
      tags: ['scc', 'unweighted'],
    },
    {
      title: 'Enforcing ordered update steps over a dependency lattice',
      context:
        'A migration tool first condenses a dependency graph into SCCs, then treats each SCC as one atomic unit. Update steps are committed either entirely or not at all per SCC, so a partial dependency no longer leaves broken states behind.',
      tags: ['scc', 'ordering', 'dependency'],
    },
  ],
  'tarjan-scc': [
    {
      title: 'Single-pass SCC condensation for a call graph',
      context:
        'A profiler needs mutually recursive functions grouped for cycle-aware attribution. Tarjan runs in one DFS pass, letting the tool emit SCCs directly without the second traversal Kosaraju would require.',
      tags: ['scc', 'unweighted'],
    },
    {
      title: 'Real-time dependency clustering in an incremental build watch',
      context:
        "A dev server rebuilds on file changes and wants to know which modules form an inseparable group. Tarjan's lowlink tracking re-computes SCCs each change so the watcher can re-bundle tightly coupled units in one atomic write.",
      tags: ['scc', 'dependency'],
    },
    {
      title: 'Condensing a road map to reduce route search to its hubs',
      context:
        'A routing service collapses a directed road graph into its SCCs, treating each strongly connected district as a supernode. The condensed graph is drastically smaller, so upper layers can plan between districts and leave intra-district detail to local search.',
      tags: ['scc', 'road-network'],
    },
  ],
  'prim-mst': [
    {
      title: 'Lowest-cost distribution of power in a grid design',
      context:
        'A utility plans where to lay feeder lines so every substation gets power with the least total cable. Starting from one substation, Prim greedily attaches the cheapest edge to the growing tree, never forming a cycle.',
      tags: ['mst', 'weighted', 'offline'],
    },
    {
      title: 'Connecting server racks with minimal Ethernet cabling',
      context:
        'A data-centre engineer weights racks by cabling cost. Prim grows a spanning tree from the first rack, adding the nearest unseen rack each step, so every rack is reachable while cable spend stays minimal.',
      tags: ['mst', 'weighted', 'network'],
    },
    {
      title: 'Linking field sensor nodes into a minimal backbone',
      context:
        'A telemetry deployment lays radio links between sensors and a base station. Prim builds a tree that covers every sensor with the least total link cost, and since it expands from the base it is simple to add one new node late.',
      tags: ['mst', 'weighted', 'offline'],
    },
  ],
  'kruskal-mst': [
    {
      title: 'Optimising the fibre layout for a new district',
      context:
        'A fibre provider sorts all possible trench pairs by cost and accepts the cheapest link that does not close a loop. Because Kruskal never needs a root node, it suits a design where the operator has a full list of candidate segments to shortlist.',
      tags: ['mst', 'weighted', 'road-network', 'offline'],
    },
    {
      title: 'Grouping telecommunication towers into one connected grid',
      context:
        'A carrier has several towers and a fixed list of microwave hops. Kruskal orders hops by cost, unions endpoints, and stops once all towers share one component, giving the cheapest fully-connected backbone without a designated start.',
      tags: ['mst', 'weighted', 'network'],
    },
    {
      title: 'Spanning a road network with the least paved mileage',
      context:
        'A government ranks road segments by paving cost and adds them cheapest-first as long as they connect a new town. Kruskal delivers a minimum paved network across a full list of candidate segments in one sorted sweep.',
      tags: ['mst', 'weighted', 'road-network'],
    },
  ],
  'union-find-connectivity': [
    {
      title: 'Live answer to whether two routers are still connected',
      context:
        'A network monitor keeps a union-find structure that merges router pairs on each confirmed link. Connectivity queries after a link drop run in near-constant time via find, so the team answers reachability without re-scanning the mesh.',
      tags: ['offline', 'connectivity'],
    },
    {
      title: 'Dynamically grouting a caveman-cave entrance survey',
      context:
        'A cave survey maps chambers as points and passages as joins, unioning each verified passage. A quick find tells surveyors whether two chambers share a route before they risk a new excavation.',
      tags: ['connectivity', 'offline'],
    },
    {
      title: 'Merging friend groups across a social graph feed',
      context:
        'A feed service unions users as they become friends and, when two clusters collapse, immediately knows the combined cohort size. Union-find tracks component membership so moderation or recommendation queries can check group identity cheaply.',
      tags: ['connectivity'],
    },
  ],
};
