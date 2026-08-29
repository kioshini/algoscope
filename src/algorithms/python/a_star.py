"""A* shortest path with Euclidean coordinates.

Input: {"nodes": [str, ...], "edges": [[from, to, weight], ...],
        "directed": bool, "start": str, "goal": str,
        "coordinates": {node: [x, y]}}. Weights must be finite and non-negative.
Output: {"path": [str, ...], "distance": number|null}; no path yields [] and null.
"""

import heapq
import math


def solve(data):
    nodes = _nodes(data)
    start, goal = data.get("start"), data.get("goal")
    if start not in nodes or goal not in nodes:
        raise ValueError("start and goal must be declared nodes")
    coordinates = data.get("coordinates")
    if not isinstance(coordinates, dict) or set(coordinates) != set(nodes):
        raise ValueError("coordinates must map every node to [x, y]")
    for point in coordinates.values():
        if (not isinstance(point, list) or len(point) != 2 or any(isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) for value in point)):
            raise ValueError("coordinates must contain finite numeric [x, y] pairs")
    directed = data.get("directed", False)
    if not isinstance(directed, bool):
        raise ValueError("directed must be a boolean")
    adjacency = {node: [] for node in nodes}
    for edge in data.get("edges", []):
        if (not isinstance(edge, list) or len(edge) != 3 or edge[0] not in adjacency or edge[1] not in adjacency
                or isinstance(edge[2], bool) or not isinstance(edge[2], (int, float)) or not math.isfinite(edge[2])):
            raise ValueError("each edge must contain two declared nodes and a finite numeric weight")
        if edge[2] < 0:
            raise ValueError("A* requires non-negative weights")
        adjacency[edge[0]].append((edge[1], edge[2]))
        if not directed:
            adjacency[edge[1]].append((edge[0], edge[2]))
    for node in nodes:
        adjacency[node].sort(key=lambda item: (item[0], item[1]))
    def heuristic(node):
        return math.hypot(coordinates[node][0] - coordinates[goal][0], coordinates[node][1] - coordinates[goal][1])
    distances = {node: math.inf for node in nodes}
    previous = {node: None for node in nodes}
    distances[start] = 0
    heap = [(heuristic(start), 0, start)]
    while heap:
        _, distance, node = heapq.heappop(heap)
        if distance != distances[node]:
            continue
        for neighbor, weight in adjacency[node]:
            if neighbor == start:
                continue
            candidate = distance + weight
            if candidate < distances[neighbor] or (candidate == distances[neighbor] and node < (previous[neighbor] or node + "\0")):
                distances[neighbor] = candidate
                previous[neighbor] = node
                heapq.heappush(heap, (candidate + heuristic(neighbor), candidate, neighbor))
    if math.isinf(distances[goal]):
        return {"path": [], "distance": None}
    path = []
    node = goal
    while node is not None:
        path.append(node)
        node = previous[node]
    return {"path": list(reversed(path)), "distance": distances[goal]}


def _nodes(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    return sorted(nodes)
