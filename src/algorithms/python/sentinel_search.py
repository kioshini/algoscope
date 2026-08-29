def solve(data):
    """Return the first matching index using a temporary sentinel, or -1."""
    values = data["values"]
    target = data["target"]
    original_length = len(values)

    values.append(target)
    index = 0
    try:
        while values[index] != target:
            index += 1
    finally:
        values.pop()

    return index if index < original_length else -1
