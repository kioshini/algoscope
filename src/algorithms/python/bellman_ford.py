"""Bellman-Ford single-source shortest paths.

Input: {"nodes": [str, ...], "edges": [[from, to, weight], ...],
        "directed": bool, "start": str}. Weights are finite numbers.
Output: {"distances": {node: number|null}, "previous": {node: str|null},
         "negative_cycle": bool}. Only reachable negative cycles are reported.
"""

import math


def solve(data):
    nodes, edges, directed, start = _graph(data)
    arcs = list(edges)
    if not directed:
        arcs += [[right, left, weight] for left, right, weight in edges]
    arcs.sort(key=lambda edge: (edge[0], edge[1], edge[2]))
    distances = {node: math.inf for node in nodes}
    previous = {node: None for node in nodes}
    distances[start] = 0
    for _ in range(max(0, len(nodes) - 1)):
        changed = False
        for left, right, weight in arcs:
            if not math.isinf(distances[left]) and distances[left] + weight < distances[right]:
                distances[right] = distances[left] + weight
                previous[right] = left
                changed = True
        if not changed:
            break
    negative_cycle = any(not math.isinf(distances[left]) and distances[left] + weight < distances[right] for left, right, weight in arcs)
    return {"distances": {node: None if math.isinf(distances[node]) else distances[node] for node in nodes}, "previous": previous, "negative_cycle": negative_cycle}


def _graph(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    directed = data.get("directed", False)
    if not isinstance(directed, bool):
        raise ValueError("directed must be a boolean")
    start = data.get("start")
    if start not in nodes:
        raise ValueError("start must be a declared node")
    edges = data.get("edges", [])
    if not isinstance(edges, list):
        raise ValueError("edges must be a list")
    for edge in edges:
        if (not isinstance(edge, list) or len(edge) != 3 or edge[0] not in nodes or edge[1] not in nodes
                or isinstance(edge[2], bool) or not isinstance(edge[2], (int, float)) or not math.isfinite(edge[2])):
            raise ValueError("each edge must contain two declared nodes and a finite numeric weight")
    return nodes, edges, directed, start
