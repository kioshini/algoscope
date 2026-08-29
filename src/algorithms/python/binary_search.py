def solve(data):
    """Return the first target index in sorted values, or -1 when absent."""
    values = data["values"]
    target = data["target"]
    left = 0
    right = len(values) - 1
    result = -1

    while left <= right:
        middle = (left + right) // 2
        if values[middle] < target:
            left = middle + 1
        else:
            if values[middle] == target:
                result = middle
            right = middle - 1
    return result
