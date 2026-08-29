import importlib.util
import json
import pathlib
import unittest


MODULE_PATH = pathlib.Path(__file__).parents[1] / "src" / "python" / "tracer.py"
ALGORITHM_PATH = pathlib.Path(__file__).parents[1] / "src" / "algorithms" / "python"
SPEC = importlib.util.spec_from_file_location("algoscope_tracer", MODULE_PATH)
tracer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(tracer)


BUBBLE_SORT = """def sort(values):
    for end in range(len(values) - 1, 0, -1):
        for index in range(end):
            if values[index] > values[index + 1]:
                values[index], values[index + 1] = values[index + 1], values[index]
    return values
"""


class TracerTests(unittest.TestCase):
    def test_trace_records_operations_and_correct_result(self):
        request = json.dumps({
            "source": BUBBLE_SORT,
            "values": [3, 1, 2],
            "timeoutMs": 1000,
            "maxEvents": 1000,
        })

        result = json.loads(getattr(tracer, "__algoscope_trace")(request))

        self.assertTrue(result["correct"])
        self.assertEqual(result["result"], [1, 2, 3])
        self.assertGreater(result["metrics"]["comparisons"], 0)
        self.assertGreater(result["metrics"]["writes"], 0)
        self.assertTrue(any(event["type"] == "line" for event in result["events"]))
        self.assertEqual(result["events"][-1]["type"], "done")

    def test_trace_records_json_safe_locals_call_stack_and_line_counts(self):
        source = """def sort(values):
    marker = float("nan")
    recursive = []
    recursive.append(recursive)
    label = "x" * 500
    helper(values, 2)
    return values

def helper(values, depth):
    if depth:
        helper(values, depth - 1)
    values.sort()
"""

        result = json.loads(getattr(tracer, "__algoscope_trace")(json.dumps({
            "source": source,
            "values": [3, 1, 2],
            "timeoutMs": 1000,
            "maxEvents": 1000,
        })))

        recursive_call = next(
            event for event in result["events"]
            if event["type"] == "call" and event.get("function") == "helper" and event["callDepth"] == 3
        )
        self.assertEqual(recursive_call["callStack"], ["sort", "helper", "helper"])
        self.assertEqual(recursive_call["locals"]["depth"], 1)
        self.assertEqual(recursive_call["locals"]["values"], [3, 1, 2])

        sort_return = next(
            event for event in result["events"]
            if event["type"] == "return" and event.get("function") == "sort"
        )
        self.assertEqual(sort_return["callDepth"], 1)
        self.assertEqual(sort_return["callStack"], ["sort"])
        self.assertEqual(sort_return["locals"]["marker"], "nan")
        self.assertEqual(sort_return["locals"]["recursive"], ["<recursive list>"])
        self.assertLessEqual(len(sort_return["locals"]["label"]), tracer.MAX_LOCAL_STRING_LENGTH + 3)

        line_events = [event for event in result["events"] if event["type"] == "line"]
        expected_counts = {}
        for event in line_events:
            key = str(event["line"])
            expected_counts[key] = expected_counts.get(key, 0) + 1
        self.assertEqual(result["lineOperationCounts"], expected_counts)
        self.assertTrue(all("callDepth" in event and "callStack" in event for event in result["events"]))

    def test_locals_snapshot_is_bounded_and_survives_broken_repr(self):
        class BrokenRepr:
            def __repr__(self):
                raise RuntimeError("no repr")

        class Frame:
            f_locals = {
                "broken": BrokenRepr(),
                **{f"item_{index}": index for index in range(tracer.MAX_LOCAL_VARIABLES + 5)},
            }

        snapshot = tracer.snapshot_locals(Frame())

        self.assertEqual(len(snapshot), tracer.MAX_LOCAL_VARIABLES + 1)
        self.assertIs(snapshot["<truncated>"], True)
        self.assertEqual(snapshot["broken"], "<BrokenRepr>")
        json.dumps(snapshot, allow_nan=False)

    def test_incorrect_algorithm_is_reported(self):
        result = tracer.run_instrumented("def sort(values):\n    return values", [2, 1])

        self.assertFalse(result["correct"])
        self.assertEqual(result["expected"], [1, 2])

    def test_analysis_returns_each_requested_size(self):
        request = json.dumps({
            "source": BUBBLE_SORT,
            "sizes": [4, 8, 12],
            "patterns": ["random", "reversed"],
            "timeoutMs": 4000,
        })

        result = json.loads(getattr(tracer, "__algoscope_analyze")(request))

        self.assertEqual(len(result["cases"]), 2)
        self.assertEqual([point["n"] for point in result["cases"][0]["points"]], [4, 8, 12])

    def test_measure_returns_untraced_median_samples(self):
        result = json.loads(getattr(tracer, "__algoscope_measure")(json.dumps({
            "source": BUBBLE_SORT,
            "values": [4, 1, 3, 2],
            "repeats": 5,
        })))

        self.assertEqual(result["type"], "measure-result")
        self.assertEqual(len(result["samples"]), 5)
        self.assertGreaterEqual(result["elapsedMs"], 0)

    def test_execute_runs_json_solution_and_validates_entrypoint(self):
        response = json.loads(getattr(tracer, "__algoscope_execute")(json.dumps({
            "source": "def solve(data):\n    return {'total': sum(data['values']), 'label': data['label']}\n",
            "data": {"values": [2, 3, 5], "label": "sample"},
            "timeoutMs": 1000,
        })))
        self.assertEqual(response, {
            "type": "execute-result",
            "result": {"total": 10, "label": "sample"},
        })

        with self.assertRaisesRegex(TypeError, "solve"):
            getattr(tracer, "__algoscope_execute")(json.dumps({
                "source": "def sort(values):\n    return values\n",
                "data": None,
            }))

    def test_stack_and_heap_python_wrappers_emit_frames(self):
        stack = json.loads(getattr(tracer, "__algoscope_visualize_lab")(json.dumps({
            "lab": "stack",
            "source": "def run(stack):\n    stack.push(5)\n    stack.peek()\n    stack.pop()\n",
            "initial": [2],
            "timeoutMs": 1000,
        })))
        heap = json.loads(getattr(tracer, "__algoscope_visualize_lab")(json.dumps({
            "lab": "heap",
            "source": "def run(heap):\n    heap.insert(1)\n    heap.extract_min()\n",
            "initial": [2, 4, 3],
            "timeoutMs": 1000,
        })))

        self.assertEqual([frame["action"] for frame in stack["frames"]], ["initial", "push", "peek", "pop"])
        self.assertEqual(stack["frames"][-1]["stack"], [2])
        final_heap = heap["frames"][-1]["heap"]
        self.assertTrue(all(final_heap[(index - 1) // 2] <= final_heap[index] for index in range(1, len(final_heap))))
        self.assertTrue(all(frame.get("line") is not None for frame in stack["frames"][1:]))

    def test_graph_python_wrapper_exposes_neighbors_and_state(self):
        source = """def run(graph, start):
    queue = [start]
    seen = {start}
    graph.frontier(queue, "enqueue", start)
    while queue:
        node = queue.pop(0)
        graph.visit(node, queue)
        for neighbor in graph.neighbors(node):
            if neighbor not in seen:
                seen.add(neighbor)
                queue.append(neighbor)
                graph.frontier(queue, "enqueue", neighbor, node)
"""
        result = json.loads(getattr(tracer, "__algoscope_visualize_lab")(json.dumps({
            "lab": "graph",
            "source": source,
            "graph": {
                "nodes": [{"id": "A"}, {"id": "B"}, {"id": "C"}],
                "edges": [{"from": "A", "to": "B"}, {"from": "B", "to": "C"}],
                "start": "A",
                "directed": True,
            },
            "timeoutMs": 1000,
        })))

        visits = [frame["graph"]["current"] for frame in result["frames"] if frame["action"] == "visit"]
        self.assertEqual(visits, ["A", "B", "C"])
        self.assertEqual(result["frames"][-1]["graph"]["visited"], ["A", "B", "C"])


class AlgorithmCatalogTests(unittest.TestCase):
    CASES = [
        [],
        [1],
        [3, 1, 2],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [3, 1, 2, 1, 3, 2],
        [0, -4, 7, -1, 7, 2],
    ]
    INTEGER_ONLY = {"counting_sort", "radix_lsd_sort"}

    def test_all_catalog_algorithms_are_correct_and_traceable(self):
        paths = sorted(ALGORITHM_PATH.glob("*_sort.py"))
        self.assertEqual(len(paths), 30)

        for path in paths:
            source = path.read_text(encoding="utf-8")
            with self.subTest(algorithm=path.stem):
                for values in self.CASES:
                    namespace = {}
                    exec(compile(source, "user_code.py", "exec"), namespace)
                    sample = list(values)
                    result = namespace["sort"](sample)
                    self.assertEqual(sample if result is None else result, sorted(values))

                if path.stem not in self.INTEGER_ONLY:
                    values = [2.5, -1.25, 2.5, 0.0, 7.75]
                    namespace = {}
                    exec(compile(source, "user_code.py", "exec"), namespace)
                    sample = list(values)
                    result = namespace["sort"](sample)
                    self.assertEqual(sample if result is None else result, sorted(values))
                else:
                    namespace = {}
                    exec(compile(source, "user_code.py", "exec"), namespace)
                    with self.assertRaises(TypeError):
                        namespace["sort"]([1, 2.5, 0])

                traced = tracer.run_instrumented(source, [4, 1, 3, 2, 1], timeout_ms=2000, max_events=20000)
                self.assertTrue(traced["correct"])
                self.assertGreater(len(traced["events"]), 0)


if __name__ == "__main__":
    unittest.main()
