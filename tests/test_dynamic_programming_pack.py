import importlib.util
import json
import pathlib
import unittest


PYTHON_PATH = pathlib.Path(__file__).parents[1] / "src" / "algorithms" / "python"
PACK_PATH = pathlib.Path(__file__).parents[1] / "src" / "algorithms" / "packs" / "dynamic_programming.ts"

DEMOS = {
    "fibonacci_memoization": ({"n": 10}, 55),
    "fibonacci_tabulation": ({"n": 10}, 55),
    "zero_one_knapsack": ({"weights": [1, 3, 4, 5], "values": [1, 4, 5, 7], "capacity": 7}, 9),
    "unbounded_knapsack": ({"weights": [2, 3, 4], "values": [4, 5, 7], "capacity": 7}, 13),
    "coin_change_count": ({"coins": [1, 2, 5], "amount": 5}, 4),
    "coin_change_minimum": ({"coins": [1, 2, 5], "amount": 11}, 3),
    "longest_increasing_subsequence": ({"values": [10, 9, 2, 5, 3, 7, 101, 18]}, [2, 5, 7, 101]),
    "matrix_chain_multiplication": ({"dimensions": [40, 20, 30, 10, 30]}, 26000),
    "edit_distance": ({"source": "kitten", "target": "sitting"}, 3),
    "grid_paths": ({"rows": 3, "columns": 7}, 28),
    "minimum_path_sum": ({"grid": [[1, 3, 1], [1, 5, 1], [4, 2, 1]]}, 7),
    "rod_cutting": ({"prices": [1, 5, 8, 9, 10, 17, 17, 20], "length": 8}, 22),
    "partition_equal_subset_sum": ({"values": [1, 5, 11, 5]}, True),
}


def load_solve(name):
    path = PYTHON_PATH / f"{name}.py"
    spec = importlib.util.spec_from_file_location(f"dp_{name}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.solve


class DynamicProgrammingPackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.solvers = {name: load_solve(name) for name in DEMOS}

    def test_pack_contains_exactly_thirteen_non_sort_solvers(self):
        self.assertEqual(len(DEMOS), 13)
        self.assertTrue(PACK_PATH.is_file())
        pack_source = PACK_PATH.read_text(encoding="utf-8")
        self.assertEqual(pack_source.count("kind: 'solve'"), 13)
        self.assertEqual(pack_source.count("problem: 'Dynamic Programming'"), 13)
        for name in DEMOS:
            path = PYTHON_PATH / f"{name}.py"
            self.assertTrue(path.is_file())
            self.assertFalse(path.name.endswith("_sort.py"))
            self.assertIn(f"../python/{name}.py?raw", pack_source)

    def test_all_metadata_demos(self):
        for name, (data, expected) in DEMOS.items():
            with self.subTest(algorithm=name):
                result = self.solvers[name](data)
                self.assertEqual(result, expected)
                json.dumps(result, allow_nan=False)

    def test_fibonacci_base_and_known_values(self):
        for name in ("fibonacci_memoization", "fibonacci_tabulation"):
            solve = self.solvers[name]
            with self.subTest(algorithm=name):
                self.assertEqual(solve({"n": 0}), 0)
                self.assertEqual(solve({"n": 1}), 1)
                self.assertEqual(solve({"n": 20}), 6765)

    def test_knapsack_empty_zero_and_reuse_behavior(self):
        zero_one = self.solvers["zero_one_knapsack"]
        unbounded = self.solvers["unbounded_knapsack"]
        self.assertEqual(zero_one({"weights": [], "values": [], "capacity": 10}), 0)
        self.assertEqual(zero_one({"weights": [0, 2], "values": [3, 4], "capacity": 2}), 7)
        self.assertEqual(zero_one({"weights": [2, 3], "values": [10, 14], "capacity": 6}), 24)
        self.assertEqual(unbounded({"weights": [], "values": [], "capacity": 10}), 0)
        self.assertEqual(unbounded({"weights": [3, 4], "values": [4, 5], "capacity": 2}), 0)
        self.assertEqual(unbounded({"weights": [2, 3], "values": [5, 7], "capacity": 7}), 17)

    def test_coin_change_base_impossible_and_known_values(self):
        count = self.solvers["coin_change_count"]
        minimum = self.solvers["coin_change_minimum"]
        self.assertEqual(count({"coins": [], "amount": 0}), 1)
        self.assertEqual(count({"coins": [], "amount": 4}), 0)
        self.assertEqual(count({"coins": [2, 3, 7], "amount": 12}), 4)
        self.assertEqual(minimum({"coins": [], "amount": 0}), 0)
        self.assertEqual(minimum({"coins": [], "amount": 4}), -1)
        self.assertEqual(minimum({"coins": [2], "amount": 3}), -1)
        self.assertEqual(minimum({"coins": [2, 3, 7], "amount": 12}), 3)

    def test_lis_is_strict_actual_and_deterministic(self):
        solve = self.solvers["longest_increasing_subsequence"]
        self.assertEqual(solve({"values": []}), [])
        self.assertEqual(solve({"values": [4, 4, 4]}), [4])
        self.assertEqual(solve({"values": [3, 1, 2, 5, 4]}), [1, 2, 5])
        self.assertEqual(solve({"values": [3, 1, 2, 5, 4]}), [1, 2, 5])

    def test_matrix_chain_base_and_known_results(self):
        solve = self.solvers["matrix_chain_multiplication"]
        self.assertEqual(solve({"dimensions": []}), 0)
        self.assertEqual(solve({"dimensions": [10]}), 0)
        self.assertEqual(solve({"dimensions": [10, 20]}), 0)
        self.assertEqual(solve({"dimensions": [10, 30, 5, 60]}), 4500)

    def test_edit_distance_empty_equal_and_known_results(self):
        solve = self.solvers["edit_distance"]
        self.assertEqual(solve({"source": "", "target": ""}), 0)
        self.assertEqual(solve({"source": "", "target": "abc"}), 3)
        self.assertEqual(solve({"source": "algorithm", "target": "algorithm"}), 0)
        self.assertEqual(solve({"source": "flaw", "target": "lawn"}), 2)

    def test_grid_paths_zero_single_and_known_results(self):
        solve = self.solvers["grid_paths"]
        self.assertEqual(solve({"rows": 0, "columns": 5}), 0)
        self.assertEqual(solve({"rows": 5, "columns": 0}), 0)
        self.assertEqual(solve({"rows": 1, "columns": 1}), 1)
        self.assertEqual(solve({"rows": 3, "columns": 3}), 6)

    def test_minimum_path_sum_empty_negative_and_known_results(self):
        solve = self.solvers["minimum_path_sum"]
        self.assertEqual(solve({"grid": []}), 0)
        self.assertEqual(solve({"grid": [[]]}), 0)
        self.assertEqual(solve({"grid": [[6]]}), 6)
        self.assertEqual(solve({"grid": [[1, -3, 2], [2, -5, 1]]}), -6)

    def test_rod_cutting_base_negative_prices_and_known_results(self):
        solve = self.solvers["rod_cutting"]
        self.assertEqual(solve({"prices": [], "length": 0}), 0)
        self.assertEqual(solve({"prices": [2], "length": 4}), 8)
        self.assertEqual(solve({"prices": [-1, -3], "length": 2}), -2)
        self.assertEqual(solve({"prices": [2, 5, 7, 8], "length": 5}), 12)

    def test_partition_empty_false_and_known_results(self):
        solve = self.solvers["partition_equal_subset_sum"]
        self.assertIs(solve({"values": []}), True)
        self.assertIs(solve({"values": [1, 2, 3, 5]}), False)
        self.assertIs(solve({"values": [0, 0]}), True)
        self.assertIs(solve({"values": [2, 2, 3, 5]}), False)

    def test_negative_dimensions_amounts_and_capacities_are_rejected(self):
        invalid_cases = [
            ("fibonacci_memoization", {"n": -1}),
            ("fibonacci_tabulation", {"n": -1}),
            ("zero_one_knapsack", {"weights": [1], "values": [1], "capacity": -1}),
            ("zero_one_knapsack", {"weights": [-1], "values": [1], "capacity": 1}),
            ("unbounded_knapsack", {"weights": [0], "values": [1], "capacity": 1}),
            ("unbounded_knapsack", {"weights": [1], "values": [1], "capacity": -1}),
            ("coin_change_count", {"coins": [1], "amount": -1}),
            ("coin_change_minimum", {"coins": [-1], "amount": 2}),
            ("matrix_chain_multiplication", {"dimensions": [10, 0, 5]}),
            ("matrix_chain_multiplication", {"dimensions": [10, -2, 5]}),
            ("grid_paths", {"rows": -1, "columns": 2}),
            ("grid_paths", {"rows": 2, "columns": -1}),
            ("rod_cutting", {"prices": [1], "length": -1}),
            ("partition_equal_subset_sum", {"values": [1, -1]}),
        ]
        for name, data in invalid_cases:
            with self.subTest(algorithm=name, data=data):
                with self.assertRaises(ValueError):
                    self.solvers[name](data)

    def test_invalid_object_shapes_and_value_types_are_rejected(self):
        for name, solve in self.solvers.items():
            with self.subTest(algorithm=name, case="not-object"):
                with self.assertRaises(TypeError):
                    solve([])

        invalid_cases = [
            ("fibonacci_tabulation", {"n": True}),
            ("zero_one_knapsack", {"weights": [1], "values": [], "capacity": 1}),
            ("unbounded_knapsack", {"weights": [1.5], "values": [2], "capacity": 2}),
            ("coin_change_count", {"coins": [1, 1], "amount": 2}),
            ("coin_change_minimum", {"coins": [1.5], "amount": 2}),
            ("longest_increasing_subsequence", {"values": [1, "2"]}),
            ("matrix_chain_multiplication", {"dimensions": [2, 3.5]}),
            ("edit_distance", {"source": [], "target": "a"}),
            ("grid_paths", {"rows": 2.5, "columns": 3}),
            ("minimum_path_sum", {"grid": [[1], [2, 3]]}),
            ("minimum_path_sum", {"grid": [[1, "2"]]}),
            ("rod_cutting", {"prices": [], "length": 1}),
            ("partition_equal_subset_sum", {"values": [1.5, 1.5]}),
        ]
        for name, data in invalid_cases:
            with self.subTest(algorithm=name, data=data):
                with self.assertRaises((TypeError, ValueError)):
                    self.solvers[name](data)


if __name__ == "__main__":
    unittest.main()
