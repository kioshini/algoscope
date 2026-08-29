"""Breadth-first search.

Input: {"nodes": [str, ...], "edges": [[from, to], ...],
        "directed": bool, "start": str}.
Output: {"order": [str, ...], "distances": {node: int|null}}.
Only nodes reachable from start occur in order; every declared node has a distance.
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
        adjacency[node] = sorted(set(adjacency[node]))
    distances = {node: None for node in nodes}
    distances[start] = 0
    order = []
    queue = [start]
    head = 0
    while head < len(queue):
        node = queue[head]
        head += 1
        order.append(node)
        for neighbor in adjacency[node]:
            if distances[neighbor] is None:
                distances[neighbor] = distances[node] + 1
                queue.append(neighbor)
    return {"order": order, "distances": distances}


def _nodes(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    return sorted(nodes)
