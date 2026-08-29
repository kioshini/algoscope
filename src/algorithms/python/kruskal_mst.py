"""Kruskal minimum spanning forest for an undirected weighted graph.

Input: {"nodes": [str, ...], "edges": [[node, node, weight], ...]} with
finite numeric weights. Output: {"edges": [[node, node, weight], ...],
"total_weight": number, "connected": bool}. Edge endpoints are normalized.
"""

import math


def solve(data):
    nodes, edges = _graph(data)
    parent = {node: node for node in nodes}
    rank = {node: 0 for node in nodes}
    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node
    def union(left, right):
        left_root, right_root = find(left), find(right)
        if left_root == right_root:
            return False
        if rank[left_root] < rank[right_root] or (rank[left_root] == rank[right_root] and left_root > right_root):
            left_root, right_root = right_root, left_root
        parent[right_root] = left_root
        if rank[left_root] == rank[right_root]:
            rank[left_root] += 1
        return True
    normalized = [(weight, min(left, right), max(left, right)) for left, right, weight in edges]
    forest = []
    total = 0
    for weight, left, right in sorted(normalized):
        if union(left, right):
            forest.append([left, right, weight])
            total += weight
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
