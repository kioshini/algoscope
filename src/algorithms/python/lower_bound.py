def solve(data):
    """Return the first insertion index whose sorted value is at least target."""
    values = data["values"]
    target = data["target"]
    left = 0
    right = len(values)

    while left < right:
        middle = (left + right) // 2
        if values[middle] < target:
            left = middle + 1
        else:
            right = middle
    return left
