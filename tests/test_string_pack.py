import importlib.util
import pathlib
import unittest


ALGORITHM_PATH = pathlib.Path(__file__).parents[1] / "src" / "algorithms" / "python"

STRING_MODULES = {
    "naive-search": "naive_search",
    "kmp": "kmp",
    "z-algorithm": "z_algorithm",
    "rabin-karp": "rabin_karp",
    "boyer-moore": "boyer_moore",
    "horspool": "horspool",
    "aho-corasick": "aho_corasick",
    "trie-lookup": "trie_lookup",
    "longest-common-prefix": "longest_common_prefix",
    "manacher": "manacher",
    "levenshtein-distance": "levenshtein_distance",
    "longest-common-subsequence": "longest_common_subsequence",
}


def load_solve(module_name):
    path = ALGORITHM_PATH / f"{module_name}.py"
    spec = importlib.util.spec_from_file_location(f"string_pack_{module_name}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.solve


SOLVERS = {algorithm_id: load_solve(module) for algorithm_id, module in STRING_MODULES.items()}
SEARCH_IDS = ["naive-search", "kmp", "z-algorithm", "rabin-karp", "boyer-moore", "horspool"]


class StringPackTests(unittest.TestCase):
    def test_pack_has_exactly_twelve_genuine_solve_files_without_sort_suffixes(self):
        self.assertEqual(len(STRING_MODULES), 12)
        self.assertEqual(len(set(STRING_MODULES.values())), 12)
        for module_name in STRING_MODULES.values():
            path = ALGORITHM_PATH / f"{module_name}.py"
            self.assertTrue(path.is_file())
            self.assertFalse(path.name.endswith("_sort.py"))
            self.assertTrue(callable(load_solve(module_name)))

    def test_all_single_pattern_searches_share_first_index_contract(self):
        cases = [
            ({"text": "", "pattern": ""}, 0),
            ({"text": "abc", "pattern": ""}, 0),
            ({"text": "", "pattern": "a"}, -1),
            ({"text": "short", "pattern": "longer"}, -1),
            ({"text": "aaaaa", "pattern": "aaa"}, 0),
            ({"text": "zzababab", "pattern": "abab"}, 2),
            ({"text": "café ☕ café", "pattern": "☕"}, 5),
            ({"text": "🙂🙃🙂🙃", "pattern": "🙂🙃"}, 0),
            ({"text": "naïve", "pattern": "ive"}, -1),
        ]
        for algorithm_id in SEARCH_IDS:
            for data, expected in cases:
                with self.subTest(algorithm=algorithm_id, data=data):
                    self.assertEqual(SOLVERS[algorithm_id](data), expected)

    def test_aho_corasick_is_ordered_and_preserves_repeated_patterns(self):
        solve = SOLVERS["aho-corasick"]
        self.assertEqual(solve({"text": "", "patterns": []}), [])
        self.assertEqual(
            solve({"text": "ushers", "patterns": ["he", "she", "hers", "his", "she", ""]}),
            [
                {"index": 0, "pattern": ""},
                {"index": 1, "pattern": "she"},
                {"index": 1, "pattern": "she"},
                {"index": 2, "pattern": "he"},
                {"index": 2, "pattern": "hers"},
            ],
        )
        self.assertEqual(
            solve({"text": "aaaa", "patterns": ["a", "aa", "a"]}),
            [
                {"index": 0, "pattern": "a"}, {"index": 0, "pattern": "aa"}, {"index": 0, "pattern": "a"},
                {"index": 1, "pattern": "a"}, {"index": 1, "pattern": "aa"}, {"index": 1, "pattern": "a"},
                {"index": 2, "pattern": "a"}, {"index": 2, "pattern": "aa"}, {"index": 2, "pattern": "a"},
                {"index": 3, "pattern": "a"}, {"index": 3, "pattern": "a"},
            ],
        )
        self.assertEqual(
            solve({"text": "猫と猫", "patterns": ["猫", "と猫"]}),
            [{"index": 0, "pattern": "猫"}, {"index": 1, "pattern": "と猫"}, {"index": 2, "pattern": "猫"}],
        )

    def test_trie_lookup_requires_complete_words(self):
        solve = SOLVERS["trie-lookup"]
        words = ["", "car", "cart", "café", "猫", "car"]
        for query, expected in [("", True), ("car", True), ("ca", False), ("cars", False), ("café", True), ("猫", True), ("犬", False)]:
            with self.subTest(query=query):
                self.assertIs(solve({"words": words, "query": query}), expected)
        self.assertFalse(solve({"words": [], "query": ""}))

    def test_longest_common_prefix_handles_empty_and_unicode_inputs(self):
        solve = SOLVERS["longest-common-prefix"]
        self.assertEqual(solve({"strings": []}), "")
        self.assertEqual(solve({"strings": [""]}), "")
        self.assertEqual(solve({"strings": ["same", "same", "same"]}), "same")
        self.assertEqual(solve({"strings": ["flower", "flow", "flight"]}), "fl")
        self.assertEqual(solve({"strings": ["🙂alpha", "🙂alpine", "🙂"]}), "🙂")
        self.assertEqual(solve({"strings": ["dog", "racecar", "car"]}), "")

    def test_manacher_returns_earliest_longest_palindrome(self):
        solve = SOLVERS["manacher"]
        cases = [
            ("", ""),
            ("a", "a"),
            ("babad", "bab"),
            ("cbbd", "bb"),
            ("abacdfgdcaba", "aba"),
            ("aaaa", "aaaa"),
            ("abccbaXYZracecar", "racecar"),
            ("🙂a🙂x🙃b🙃", "🙂a🙂"),
        ]
        for text, expected in cases:
            with self.subTest(text=text):
                self.assertEqual(solve({"text": text}), expected)

    def test_levenshtein_distance_handles_empty_unicode_and_repetition(self):
        solve = SOLVERS["levenshtein-distance"]
        for first, second, expected in [
            ("", "", 0), ("abc", "", 3), ("", "猫", 1), ("kitten", "sitting", 3),
            ("aaaa", "aa", 2), ("café", "cafe", 1), ("🙂🙃", "🙂🙂", 1), ("same", "same", 0),
        ]:
            with self.subTest(first=first, second=second):
                self.assertEqual(solve({"first": first, "second": second}), expected)
                self.assertEqual(solve({"first": second, "second": first}), expected)

    def test_lcs_uses_documented_deterministic_tie_rule(self):
        solve = SOLVERS["longest-common-subsequence"]
        cases = [
            ("", "abc", ""),
            ("abc", "", ""),
            ("ABCBDAB", "BDCABA", "BDAB"),
            ("abc", "bac", "bc"),
            ("aaaa", "aa", "aa"),
            ("A🙂B猫C", "🙂X猫", "🙂猫"),
            ("same", "same", "same"),
        ]
        for first, second, expected in cases:
            with self.subTest(first=first, second=second):
                self.assertEqual(solve({"first": first, "second": second}), expected)

    def test_every_metadata_demo_result(self):
        demos = {
            "naive-search": ({"text": "abracadabra", "pattern": "cada"}, 4),
            "kmp": ({"text": "ababcabcabababd", "pattern": "ababd"}, 10),
            "z-algorithm": ({"text": "mississippi", "pattern": "issi"}, 1),
            "rabin-karp": ({"text": "the quick brown fox", "pattern": "brown"}, 10),
            "boyer-moore": ({"text": "HERE IS A SIMPLE EXAMPLE", "pattern": "EXAMPLE"}, 17),
            "horspool": ({"text": "trusthardtoothbrushes", "pattern": "tooth"}, 9),
            "aho-corasick": ({"text": "ushers", "patterns": ["he", "she", "hers", "his"]}, [{"index": 1, "pattern": "she"}, {"index": 2, "pattern": "he"}, {"index": 2, "pattern": "hers"}]),
            "trie-lookup": ({"words": ["cat", "car", "dog"], "query": "car"}, True),
            "longest-common-prefix": ({"strings": ["flower", "flow", "flight"]}, "fl"),
            "manacher": ({"text": "babad"}, "bab"),
            "levenshtein-distance": ({"first": "kitten", "second": "sitting"}, 3),
            "longest-common-subsequence": ({"first": "ABCBDAB", "second": "BDCABA"}, "BDAB"),
        }
        self.assertEqual(set(demos), set(SOLVERS))
        for algorithm_id, (data, expected) in demos.items():
            with self.subTest(algorithm=algorithm_id):
                self.assertEqual(SOLVERS[algorithm_id](data), expected)


if __name__ == "__main__":
    unittest.main()
