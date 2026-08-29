def solve(data):
    """Return the first target index in sorted values after exponential bracketing, or -1."""
    values = data["values"]
    target = data["target"]
    length = len(values)
    if length == 0 or target < values[0]:
        return -1
    if values[0] == target:
        return 0

    bound = 1
    while bound < length and values[bound] < target:
        bound *= 2

    left = bound // 2
    right = min(bound, length - 1)
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
