import ast
import bisect
import importlib.util
import json
import pathlib
import unittest


ALGORITHM_PATH = pathlib.Path(__file__).parents[1] / "src" / "algorithms" / "python"
SEARCH_FILES = {
    "linear_search.py",
    "sentinel_search.py",
    "binary_search.py",
    "lower_bound.py",
    "upper_bound.py",
    "jump_search.py",
    "exponential_search.py",
    "interpolation_search.py",
    "fibonacci_search.py",
    "quickselect.py",
}
FIND_FILES = SEARCH_FILES - {"lower_bound.py", "upper_bound.py", "quickselect.py"}


def load_solve(filename):
    path = ALGORITHM_PATH / filename
    spec = importlib.util.spec_from_file_location(f"searching_{path.stem}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.solve


class SearchingPackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.solvers = {filename: load_solve(filename) for filename in SEARCH_FILES}

    def test_exact_files_have_one_solve_entry_point_and_json_safe_results(self):
        actual = {filename for filename in SEARCH_FILES if (ALGORITHM_PATH / filename).is_file()}
        self.assertEqual(actual, SEARCH_FILES)
        self.assertTrue(all(not filename.endswith("_sort.py") for filename in SEARCH_FILES))

        for filename in SEARCH_FILES:
            source = (ALGORITHM_PATH / filename).read_text(encoding="utf-8")
            functions = [node for node in ast.parse(source).body if isinstance(node, ast.FunctionDef)]
            with self.subTest(filename=filename):
                self.assertEqual([function.name for function in functions], ["solve"])
                self.assertEqual([argument.arg for argument in functions[0].args.args], ["data"])
                if filename == "quickselect.py":
                    result = self.solvers[filename]({"values": [3, 1, 2], "k": 1})
                else:
                    result = self.solvers[filename]({"values": [1, 2, 3], "target": 2})
                json.dumps(result, allow_nan=False)

    def test_find_algorithms_return_first_duplicate_and_minus_one_when_missing(self):
        cases = [
            ([], 4, -1),
            ([4], 4, 0),
            ([4], 3, -1),
            ([-5, -2, -2, -2, 0, 3, 8], -2, 1),
            ([1, 1, 1, 1, 1], 1, 0),
            ([1, 3, 5, 7, 9], 0, -1),
            ([1, 3, 5, 7, 9], 6, -1),
            ([1, 3, 5, 7, 9], 10, -1),
            ([0.5, 1.25, 1.25, 2.75, 9.5], 1.25, 1),
        ]
        for filename in FIND_FILES:
            solve = self.solvers[filename]
            for values, target, expected in cases:
                original = list(values)
                with self.subTest(filename=filename, values=values, target=target):
                    self.assertEqual(solve({"values": values, "target": target}), expected)
                    self.assertEqual(values, original)

    def test_sequential_searches_support_unsorted_values(self):
        for filename in ("linear_search.py", "sentinel_search.py"):
            solve = self.solvers[filename]
            values = [8, -1, 5, -1, 3, 8]
            with self.subTest(filename=filename):
                self.assertEqual(solve({"values": values, "target": -1}), 1)
                self.assertEqual(solve({"values": values, "target": 7}), -1)
                self.assertEqual(values, [8, -1, 5, -1, 3, 8])

    def test_sorted_find_algorithms_match_first_index_across_dense_cases(self):
        sorted_find = FIND_FILES - {"linear_search.py", "sentinel_search.py"}
        values = sorted([number // 3 for number in range(-24, 31)] + [-3, -3, 0, 0, 0, 10])
        targets = [number / 2 for number in range(-20, 25)]
        for filename in sorted_find:
            solve = self.solvers[filename]
            for target in targets:
                expected = values.index(target) if target in values else -1
                with self.subTest(filename=filename, target=target):
                    self.assertEqual(solve({"values": values, "target": target}), expected)

    def test_bounds_match_python_bisect_for_empty_duplicates_and_missing_targets(self):
        lower = self.solvers["lower_bound.py"]
        upper = self.solvers["upper_bound.py"]
        arrays = [[], [2], [2, 2, 2], [-4, -1, -1, 0, 3, 3, 8]]
        targets = [-10, -4, -1, 1, 2, 3, 8, 20]

        for values in arrays:
            for target in targets:
                with self.subTest(values=values, target=target):
                    self.assertEqual(lower({"values": values, "target": target}), bisect.bisect_left(values, target))
                    self.assertEqual(upper({"values": values, "target": target}), bisect.bisect_right(values, target))

    def test_quickselect_returns_every_rank_with_duplicates_and_preserves_input(self):
        solve = self.solvers["quickselect.py"]
        cases = [[5], [4, 1, 3, 2], [7, -2, 7, 4, -2, 9, 0], [3.5, 1.25, 2.0, 1.25]]
        for values in cases:
            expected = sorted(values)
            for k in range(len(values)):
                sample = list(values)
                with self.subTest(values=values, k=k):
                    self.assertEqual(solve({"values": sample, "k": k}), expected[k])
                    self.assertEqual(sample, values)

    def test_quickselect_rejects_empty_out_of_range_and_non_integer_k(self):
        solve = self.solvers["quickselect.py"]
        invalid = [
            ({"values": [], "k": 0}),
            ({"values": [1, 2, 3], "k": -1}),
            ({"values": [1, 2, 3], "k": 3}),
            ({"values": [1, 2, 3], "k": 1.0}),
            ({"values": [1, 2, 3], "k": True}),
        ]
        for data in invalid:
            with self.subTest(data=data):
                with self.assertRaises(ValueError):
                    solve(data)


if __name__ == "__main__":
    unittest.main()
