"""Topological sorting by depth-first search.

Input: {"nodes": [str, ...], "edges": [[from, to], ...]} for a directed graph.
Output: {"order": [str, ...]}. Raises ValueError when the graph contains a cycle.
"""


def solve(data):
    nodes, adjacency = _graph(data)
    state = {node: 0 for node in nodes}
    order = []

    def visit(node):
        if state[node] == 1:
            raise ValueError("topological sort requires an acyclic graph")
        if state[node] == 2:
            return
        state[node] = 1
        for neighbor in adjacency[node]:
            visit(neighbor)
        state[node] = 2
        order.append(node)

    for node in reversed(nodes):
        visit(node)
    return {"order": list(reversed(order))}


def _graph(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    adjacency = {node: [] for node in nodes}
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in adjacency or edge[1] not in adjacency:
            raise ValueError("each edge must contain two declared nodes")
        adjacency[edge[0]].append(edge[1])
    for node in nodes:
        adjacency[node] = sorted(set(adjacency[node]), reverse=True)
    return nodes, adjacency
