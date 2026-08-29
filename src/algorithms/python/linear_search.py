def solve(data):
    """Return the first index equal to target, or -1 when target is absent."""
    values = data["values"]
    target = data["target"]

    for index in range(len(values)):
        if values[index] == target:
            return index
    return -1
