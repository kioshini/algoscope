def solve(data):
    """Return Levenshtein distance for {"source": str, "target": str}."""
    if not isinstance(data, dict) or "source" not in data or "target" not in data:
        raise TypeError("input must be an object containing source and target")
    source = data["source"]
    target = data["target"]
    if not isinstance(source, str) or not isinstance(target, str):
        raise TypeError("source and target must be strings")

    previous = list(range(len(target) + 1))
    for source_index, source_character in enumerate(source, 1):
        current = [source_index] + [0] * len(target)
        for target_index, target_character in enumerate(target, 1):
            substitution = previous[target_index - 1] + (source_character != target_character)
            current[target_index] = min(
                previous[target_index] + 1,
                current[target_index - 1] + 1,
                substitution,
            )
        previous = current
    return previous[-1]
