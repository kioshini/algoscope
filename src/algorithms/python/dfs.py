"""Depth-first search.

Input: {"nodes": [str, ...], "edges": [[from, to], ...],
        "directed": bool, "start": str}.
Output: {"order": [str, ...], "parents": {node: str|null}}.
The output contains reachable nodes only; roots and undiscovered nodes have null parents.
"""


def solve(data):
    nodes = _nodes(data)
    start = data.get("start")
    if start not in nodes:
        raise ValueError("start must be a declared node")
    adjacency = {node: [] for node in nodes}
    directed = data.get("directed", False)
    if not isinstance(directed, bool):
        raise ValueError("directed must be a boolean")
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in adjacency or edge[1] not in adjacency:
            raise ValueError("each edge must contain two declared nodes")
        adjacency[edge[0]].append(edge[1])
        if not directed:
            adjacency[edge[1]].append(edge[0])
    for node in nodes:
        adjacency[node] = sorted(set(adjacency[node]), reverse=True)
    parents = {node: None for node in nodes}
    visited = set()
    order = []
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        for neighbor in adjacency[node]:
            if neighbor not in visited:
                if parents[neighbor] is None and neighbor != start:
                    parents[neighbor] = node
                stack.append(neighbor)
    return {"order": order, "parents": parents}


def _nodes(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    return sorted(nodes)
