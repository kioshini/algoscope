"""Floyd-Warshall all-pairs shortest paths.

Input: {"nodes": [str, ...], "edges": [[from, to, weight], ...],
        "directed": bool}. Weights are finite numbers.
Output: {"distances": {from: {to: number|null}}, "negative_cycle": bool}.
"""

import math


def solve(data):
    nodes = _nodes(data)
    directed = data.get("directed", False)
    if not isinstance(directed, bool):
        raise ValueError("directed must be a boolean")
    distances = {left: {right: (0 if left == right else math.inf) for right in nodes} for left in nodes}
    edges = data.get("edges", [])
    if not isinstance(edges, list):
        raise ValueError("edges must be a list")
    for edge in edges:
        if (not isinstance(edge, list) or len(edge) != 3 or edge[0] not in distances or edge[1] not in distances
                or isinstance(edge[2], bool) or not isinstance(edge[2], (int, float)) or not math.isfinite(edge[2])):
            raise ValueError("each edge must contain two declared nodes and a finite numeric weight")
        left, right, weight = edge
        distances[left][right] = min(distances[left][right], weight)
        if not directed:
            distances[right][left] = min(distances[right][left], weight)
    for middle in nodes:
        for left in nodes:
            for right in nodes:
                candidate = distances[left][middle] + distances[middle][right]
                if candidate < distances[left][right]:
                    distances[left][right] = candidate
    negative_cycle = any(distances[node][node] < 0 for node in nodes)
    return {"distances": {left: {right: None if math.isinf(distances[left][right]) else distances[left][right] for right in nodes} for left in nodes}, "negative_cycle": negative_cycle}


def _nodes(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    return sorted(nodes)
