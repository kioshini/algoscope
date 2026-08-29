"""Kahn topological sorting.

Input: {"nodes": [str, ...], "edges": [[from, to], ...]} for a directed graph.
Output: {"order": [str, ...]}. Raises ValueError when the graph contains a cycle.
"""

import heapq


def solve(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    adjacency = {node: set() for node in nodes}
    indegree = {node: 0 for node in nodes}
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in adjacency or edge[1] not in adjacency:
            raise ValueError("each edge must contain two declared nodes")
        if edge[1] not in adjacency[edge[0]]:
            adjacency[edge[0]].add(edge[1])
            indegree[edge[1]] += 1
    ready = [node for node in nodes if indegree[node] == 0]
    heapq.heapify(ready)
    order = []
    while ready:
        node = heapq.heappop(ready)
        order.append(node)
        for neighbor in sorted(adjacency[node]):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                heapq.heappush(ready, neighbor)
    if len(order) != len(nodes):
        raise ValueError("topological sort requires an acyclic graph")
    return {"order": order}
