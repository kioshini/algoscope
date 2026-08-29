"""Connected components of an undirected graph.

Input: {"nodes": [str, ...], "edges": [[node, node], ...]}.
Output: {"components": [[str, ...], ...], "count": int}.
Members and components (by first member) are lexically sorted.
"""


def solve(data):
    nodes = _nodes(data)
    adjacency = {node: [] for node in nodes}
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in adjacency or edge[1] not in adjacency:
            raise ValueError("each edge must contain two declared nodes")
        adjacency[edge[0]].append(edge[1])
        adjacency[edge[1]].append(edge[0])
    visited = set()
    components = []
    for start in nodes:
        if start in visited:
            continue
        component = []
        stack = [start]
        visited.add(start)
        while stack:
            node = stack.pop()
            component.append(node)
            for neighbor in sorted(set(adjacency[node]), reverse=True):
                if neighbor not in visited:
                    visited.add(neighbor)
                    stack.append(neighbor)
        components.append(sorted(component))
    return {"components": components, "count": len(components)}


def _nodes(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    return sorted(nodes)
