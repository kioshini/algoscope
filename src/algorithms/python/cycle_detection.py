"""Cycle detection for directed or undirected graphs.

Input: {"nodes": [str, ...], "edges": [[from, to], ...], "directed": bool}.
Output: {"has_cycle": bool}. Self-loops are cycles; parallel edges are coalesced.
"""


def solve(data):
    nodes = _nodes(data)
    directed = data.get("directed", False)
    if not isinstance(directed, bool):
        raise ValueError("directed must be a boolean")
    adjacency = {node: set() for node in nodes}
    for edge in data.get("edges", []):
        if not isinstance(edge, list) or len(edge) != 2 or edge[0] not in adjacency or edge[1] not in adjacency:
            raise ValueError("each edge must contain two declared nodes")
        adjacency[edge[0]].add(edge[1])
        if not directed:
            adjacency[edge[1]].add(edge[0])
    if directed:
        state = {node: 0 for node in nodes}
        def visit(node):
            state[node] = 1
            for neighbor in sorted(adjacency[node]):
                if state[neighbor] == 1 or (state[neighbor] == 0 and visit(neighbor)):
                    return True
            state[node] = 2
            return False
        has_cycle = any(state[node] == 0 and visit(node) for node in nodes)
    else:
        visited = set()
        def visit(node, parent):
            visited.add(node)
            for neighbor in sorted(adjacency[node]):
                if neighbor not in visited:
                    if visit(neighbor, node):
                        return True
                elif neighbor != parent:
                    return True
            return False
        has_cycle = any(node not in visited and visit(node, None) for node in nodes)
    return {"has_cycle": has_cycle}


def _nodes(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    return sorted(nodes)
