"""Kosaraju strongly connected components.

Input: {"nodes": [str, ...], "edges": [[from, to], ...]} for a directed graph.
Output: {"components": [[str, ...], ...], "count": int}.
Members and the final component list are lexically sorted.
"""


def solve(data):
    nodes, graph, reverse = _graph(data)
    visited = set()
    finish = []
    def first(node):
        visited.add(node)
        for neighbor in sorted(graph[node]):
            if neighbor not in visited:
                first(neighbor)
        finish.append(node)
    for node in nodes:
        if node not in visited:
            first(node)
    visited.clear()
    components = []
    def second(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in sorted(reverse[node]):
            if neighbor not in visited:
                second(neighbor, component)
    for node in reversed(finish):
        if node not in visited:
            component = []
            second(node, component)
            components.append(sorted(component))
    components.sort()
    return {"components": components, "count": len(components)}


def _graph(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    graph = {node: set() for node in nodes}
    reverse = {node: set() for node in nodes}
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in graph or edge[1] not in graph:
            raise ValueError("each edge must contain two declared nodes")
        graph[edge[0]].add(edge[1])
        reverse[edge[1]].add(edge[0])
    return nodes, graph, reverse
