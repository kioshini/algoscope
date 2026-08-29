"""Dijkstra single-source shortest paths.

Input: {"nodes": [str, ...], "edges": [[from, to, weight], ...],
        "directed": bool, "start": str}. Weights must be finite non-negative numbers.
Output: {"distances": {node: number|null}, "previous": {node: str|null}}.
"""

import heapq
import math


def solve(data):
    nodes, edges, directed, start = _weighted_graph(data)
    adjacency = {node: [] for node in nodes}
    for left, right, weight in edges:
        if weight < 0:
            raise ValueError("Dijkstra requires non-negative weights")
        adjacency[left].append((right, weight))
        if not directed:
            adjacency[right].append((left, weight))
    for node in nodes:
        adjacency[node].sort(key=lambda item: (item[0], item[1]))
    distances = {node: math.inf for node in nodes}
    previous = {node: None for node in nodes}
    distances[start] = 0
    heap = [(0, start)]
    while heap:
        distance, node = heapq.heappop(heap)
        if distance != distances[node]:
            continue
        for neighbor, weight in adjacency[node]:
            if neighbor == start:
                continue
            candidate = distance + weight
            if candidate < distances[neighbor] or (candidate == distances[neighbor] and node < (previous[neighbor] or node + "\0")):
                distances[neighbor] = candidate
                previous[neighbor] = node
                heapq.heappush(heap, (candidate, neighbor))
    return {"distances": {node: None if math.isinf(distances[node]) else distances[node] for node in nodes}, "previous": previous}


def _weighted_graph(data):
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
