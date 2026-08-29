"""Prim minimum spanning forest for an undirected weighted graph.

Input: {"nodes": [str, ...], "edges": [[node, node, weight], ...]} with
finite numeric weights. Output: {"edges": [[node, node, weight], ...],
"total_weight": number, "connected": bool}. Edge endpoints are normalized.
"""

import heapq
import math


def solve(data):
    nodes, edges = _graph(data)
    adjacency = {node: [] for node in nodes}
    for left, right, weight in edges:
        adjacency[left].append((weight, right))
        adjacency[right].append((weight, left))
    visited = set()
    forest = []
    total = 0
    for root in nodes:
        if root in visited:
            continue
        visited.add(root)
        heap = []
        for weight, neighbor in adjacency[root]:
            first, second = sorted((root, neighbor))
            heapq.heappush(heap, (weight, first, second, root, neighbor))
        while heap:
            weight, first, second, _, neighbor = heapq.heappop(heap)
            if neighbor in visited:
                continue
            visited.add(neighbor)
            forest.append([first, second, weight])
            total += weight
            for next_weight, next_node in adjacency[neighbor]:
                if next_node not in visited:
                    edge_left, edge_right = sorted((neighbor, next_node))
                    heapq.heappush(heap, (next_weight, edge_left, edge_right, neighbor, next_node))
    forest.sort(key=lambda edge: (edge[2], edge[0], edge[1]))
    return {"edges": forest, "total_weight": total, "connected": len(nodes) <= 1 or len(forest) == len(nodes) - 1}


def _graph(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    edges = data.get("edges", [])
    if not isinstance(edges, list):
        raise ValueError("edges must be a list")
    for edge in edges:
        if (not isinstance(edge, list) or len(edge) != 3 or edge[0] not in nodes or edge[1] not in nodes
                or isinstance(edge[2], bool) or not isinstance(edge[2], (int, float)) or not math.isfinite(edge[2])):
            raise ValueError("each edge must contain two declared nodes and a finite numeric weight")
    return nodes, edges
