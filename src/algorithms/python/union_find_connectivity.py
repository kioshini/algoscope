"""Union-find connectivity queries on an undirected graph.

Input: {"nodes": [str, ...], "edges": [[node, node], ...],
        "queries": [[node, node], ...]}.
Output: {"connected": [bool, ...], "components": [[str, ...], ...]}.
Queries are answered after all edges have been unioned.
"""


def solve(data):
    nodes = data.get("nodes")
    if not isinstance(nodes, list) or any(not isinstance(node, str) for node in nodes) or len(set(nodes)) != len(nodes):
        raise ValueError("nodes must be a list of unique strings")
    nodes = sorted(nodes)
    parent = {node: node for node in nodes}
    rank = {node: 0 for node in nodes}
    def find(node):
        if parent[node] != node:
            parent[node] = find(parent[node])
        return parent[node]
    def union(left, right):
        left_root, right_root = find(left), find(right)
        if left_root == right_root:
            return
        if rank[left_root] < rank[right_root] or (rank[left_root] == rank[right_root] and left_root > right_root):
            left_root, right_root = right_root, left_root
        parent[right_root] = left_root
        if rank[left_root] == rank[right_root]:
            rank[left_root] += 1
    edges = data.get("edges", [])
    queries = data.get("queries", [])
    if not isinstance(edges, list) or not isinstance(queries, list):
        raise ValueError("edges and queries must be lists")
    for pair in edges:
        _check_pair(pair, parent, "edge")
        union(pair[0], pair[1])
    connected = []
    for pair in queries:
        _check_pair(pair, parent, "query")
        connected.append(find(pair[0]) == find(pair[1]))
    groups = {}
    for node in nodes:
        groups.setdefault(find(node), []).append(node)
    components = sorted((sorted(component) for component in groups.values()))
    return {"connected": connected, "components": components}


def _check_pair(pair, nodes, label):
    if not isinstance(pair, list) or len(pair) != 2 or pair[0] not in nodes or pair[1] not in nodes:
        raise ValueError("each %s must contain two declared nodes" % label)
