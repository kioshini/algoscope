def solve(data):
    """Return the first insertion index whose sorted value is greater than target."""
    values = data["values"]
    target = data["target"]
    left = 0
    right = len(values)

    while left < right:
        middle = (left + right) // 2
        if target < values[middle]:
            right = middle
        else:
            left = middle + 1
    return left
