"""Tarjan strongly connected components.

Input: {"nodes": [str, ...], "edges": [[from, to], ...]} for a directed graph.
Output: {"components": [[str, ...], ...], "count": int}.
Members and the final component list are lexically sorted.
"""


def solve(data):
    nodes, graph = _graph(data)
    index = 0
    indices = {}
    low = {}
    stack = []
    on_stack = set()
    components = []
    def visit(node):
        nonlocal index
        indices[node] = index
        low[node] = index
        index += 1
        stack.append(node)
        on_stack.add(node)
        for neighbor in sorted(graph[node]):
            if neighbor not in indices:
                visit(neighbor)
                low[node] = min(low[node], low[neighbor])
            elif neighbor in on_stack:
                low[node] = min(low[node], indices[neighbor])
        if low[node] == indices[node]:
            component = []
            while True:
                member = stack.pop()
                on_stack.remove(member)
                component.append(member)
                if member == node:
                    break
            components.append(sorted(component))
    for node in nodes:
        if node not in indices:
            visit(node)
    components.sort()
    return {"components": components, "count": len(components)}


def _graph(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    graph = {node: set() for node in nodes}
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in graph or edge[1] not in graph:
            raise ValueError("each edge must contain two declared nodes")
        graph[edge[0]].add(edge[1])
    return nodes, graph
