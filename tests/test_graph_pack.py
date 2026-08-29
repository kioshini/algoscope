import importlib.util
import json
import unittest
from pathlib import Path


PYTHON_DIR = Path(__file__).parents[1] / "src" / "algorithms" / "python"
PACK_PATH = Path(__file__).parents[1] / "src" / "algorithms" / "packs" / "graphs.ts"


def load_solver(filename):
    path = PYTHON_DIR / filename
    assert path.is_file(), "missing graph solver: %s" % filename
    spec = importlib.util.spec_from_file_location("graph_%s" % path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.solve


DEMOS = {
    "bfs.py": (
        {"nodes": ["A", "B", "C", "D", "E"], "edges": [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]], "directed": False, "start": "A"},
        {"order": ["A", "B", "C", "D"], "distances": {"A": 0, "B": 1, "C": 1, "D": 2, "E": None}},
    ),
    "dfs.py": (
        {"nodes": ["A", "B", "C", "D", "E"], "edges": [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]], "directed": False, "start": "A"},
        {"order": ["A", "B", "D", "C"], "parents": {"A": None, "B": "A", "C": "A", "D": "B", "E": None}},
    ),
    "dijkstra.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "B", 4], ["A", "C", 1], ["C", "B", 2], ["B", "D", 1], ["C", "D", 5]], "directed": True, "start": "A"},
        {"distances": {"A": 0, "B": 3, "C": 1, "D": 4}, "previous": {"A": None, "B": "C", "C": "A", "D": "B"}},
    ),
    "bellman_ford.py": (
        {"nodes": ["A", "B", "C", "S"], "edges": [["S", "A", 4], ["S", "B", 5], ["A", "B", -2], ["B", "C", 3]], "directed": True, "start": "S"},
        {"distances": {"A": 4, "B": 2, "C": 5, "S": 0}, "previous": {"A": "S", "B": "A", "C": "B", "S": None}, "negative_cycle": False},
    ),
    "floyd_warshall.py": (
        {"nodes": ["A", "B", "C"], "edges": [["A", "B", 3], ["B", "C", 2], ["A", "C", 10]], "directed": True},
        {"distances": {"A": {"A": 0, "B": 3, "C": 5}, "B": {"A": None, "B": 0, "C": 2}, "C": {"A": None, "B": None, "C": 0}}, "negative_cycle": False},
    ),
    "a_star.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "B", 1], ["A", "C", 1], ["B", "D", 1], ["C", "D", 1]], "directed": False, "start": "A", "goal": "D", "coordinates": {"A": [0, 0], "B": [1, 0], "C": [0, 1], "D": [1, 1]}},
        {"path": ["A", "B", "D"], "distance": 2},
    ),
    "dfs_topological.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "C"], ["B", "C"], ["C", "D"]]},
        {"order": ["A", "B", "C", "D"]},
    ),
    "kahn_topological.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "C"], ["B", "C"], ["C", "D"]]},
        {"order": ["A", "B", "C", "D"]},
    ),
    "connected_components.py": (
        {"nodes": ["A", "B", "C", "D", "E"], "edges": [["A", "B"], ["C", "D"]]},
        {"components": [["A", "B"], ["C", "D"], ["E"]], "count": 3},
    ),
    "cycle_detection.py": (
        {"nodes": ["A", "B", "C"], "edges": [["A", "B"], ["B", "C"], ["C", "A"]], "directed": True},
        {"has_cycle": True},
    ),
    "kosaraju_scc.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "B"], ["B", "A"], ["B", "C"], ["C", "D"], ["D", "C"]]},
        {"components": [["A", "B"], ["C", "D"]], "count": 2},
    ),
    "tarjan_scc.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "B"], ["B", "A"], ["B", "C"], ["C", "D"], ["D", "C"]]},
        {"components": [["A", "B"], ["C", "D"]], "count": 2},
    ),
    "prim_mst.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "B", 1], ["A", "C", 4], ["B", "C", 2], ["B", "D", 5], ["C", "D", 3]]},
        {"edges": [["A", "B", 1], ["B", "C", 2], ["C", "D", 3]], "total_weight": 6, "connected": True},
    ),
    "kruskal_mst.py": (
        {"nodes": ["A", "B", "C", "D"], "edges": [["A", "B", 1], ["A", "C", 4], ["B", "C", 2], ["B", "D", 5], ["C", "D", 3]]},
        {"edges": [["A", "B", 1], ["B", "C", 2], ["C", "D", 3]], "total_weight": 6, "connected": True},
    ),
    "union_find_connectivity.py": (
        {"nodes": ["A", "B", "C", "D", "E"], "edges": [["A", "B"], ["B", "C"], ["D", "E"]], "queries": [["A", "C"], ["A", "D"], ["D", "E"]]},
        {"connected": [True, False, True], "components": [["A", "B", "C"], ["D", "E"]]},
    ),
}


def test_pack_demos():
    for filename, (data, expected) in DEMOS.items():
        result = load_solver(filename)(data)
        assert result == expected, filename
        json.dumps(result, allow_nan=False)


def test_exact_graph_file_set_and_names():
    assert len(DEMOS) == 15
    assert all(not filename.endswith("_sort.py") for filename in DEMOS)
    assert {path.name for path in PYTHON_DIR.glob("*.py") if path.name in DEMOS} == set(DEMOS)
    pack_source = PACK_PATH.read_text(encoding="utf-8")
    assert pack_source.count("kind: 'solve'") == 15
    assert pack_source.count("problem: 'Graph'") == 15
    for filename in DEMOS:
        assert "../python/%s?raw" % filename in pack_source


def test_disconnected_graph_outputs_are_explicit():
    bfs = load_solver("bfs.py")
    dijkstra = load_solver("dijkstra.py")
    graph = {"nodes": ["A", "B", "C"], "edges": [["A", "B"]], "directed": False, "start": "A"}
    assert bfs(graph)["distances"] == {"A": 0, "B": 1, "C": None}
    weighted = {**graph, "edges": [["A", "B", 2]]}
    assert dijkstra(weighted)["distances"] == {"A": 0, "B": 2, "C": None}


def test_dijkstra_rejects_negative_weight():
    solve = load_solver("dijkstra.py")
    with unittest.TestCase().assertRaisesRegex(ValueError, "non-negative"):
        solve({"nodes": ["A", "B"], "edges": [["A", "B", -1]], "directed": True, "start": "A"})


def test_topological_sorts_reject_cycles_and_detector_handles_both_kinds():
    cycle = {"nodes": ["A", "B", "C"], "edges": [["A", "B"], ["B", "C"], ["C", "A"]]}
    for filename in ("dfs_topological.py", "kahn_topological.py"):
        with unittest.TestCase().assertRaisesRegex(ValueError, "acyclic"):
            load_solver(filename)(cycle)
    detector = load_solver("cycle_detection.py")
    assert detector({**cycle, "directed": True}) == {"has_cycle": True}
    assert detector({"nodes": ["A", "B", "C"], "edges": [["A", "B"], ["B", "C"]], "directed": False}) == {"has_cycle": False}


def test_bellman_ford_negative_edges_and_reachable_negative_cycle():
    solve = load_solver("bellman_ford.py")
    result = solve({"nodes": ["A", "B", "S"], "edges": [["S", "A", 2], ["A", "B", -5]], "directed": True, "start": "S"})
    assert result["distances"] == {"A": 2, "B": -3, "S": 0}
    assert result["negative_cycle"] is False
    cycle = solve({"nodes": ["A", "B", "S"], "edges": [["S", "A", 0], ["A", "B", -2], ["B", "A", 1]], "directed": True, "start": "S"})
    assert cycle["negative_cycle"] is True


def test_scc_algorithms_agree_with_isolated_node():
    data = {"nodes": ["A", "B", "C", "D", "E"], "edges": [["A", "B"], ["B", "A"], ["B", "C"], ["C", "D"], ["D", "C"]]}
    expected = {"components": [["A", "B"], ["C", "D"], ["E"]], "count": 3}
    assert load_solver("kosaraju_scc.py")(data) == expected
    assert load_solver("tarjan_scc.py")(data) == expected


def test_mst_algorithms_return_same_disconnected_minimum_forest():
    data = {"nodes": ["A", "B", "C", "D", "E"], "edges": [["A", "B", 3], ["A", "C", 1], ["B", "C", 2], ["D", "E", -4]]}
    expected = {"edges": [["D", "E", -4], ["A", "C", 1], ["B", "C", 2]], "total_weight": -1, "connected": False}
    assert load_solver("prim_mst.py")(data) == expected
    assert load_solver("kruskal_mst.py")(data) == expected


def test_union_find_connectivity_with_isolated_node():
    result = load_solver("union_find_connectivity.py")({"nodes": ["A", "B", "C", "D"], "edges": [["A", "B"]], "queries": [["A", "B"], ["A", "C"], ["C", "C"]]})
    assert result == {"connected": [True, False, True], "components": [["A", "B"], ["C"], ["D"]]}


def load_tests(loader, tests, pattern):
    suite = unittest.TestSuite()
    for name, value in sorted(globals().items()):
        if name.startswith("test_") and callable(value):
            suite.addTest(unittest.FunctionTestCase(value))
    return suite
