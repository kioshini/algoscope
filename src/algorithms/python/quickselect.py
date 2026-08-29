def solve(data):
    """Return the zero-based kth-smallest value without changing the input list."""
    values = list(data["values"])
    k = data["k"]
    if not isinstance(k, int) or isinstance(k, bool) or k < 0 or k >= len(values):
        raise ValueError("k must be an integer index between 0 and len(values) - 1")

    left = 0
    right = len(values) - 1
    while left <= right:
        pivot = values[right]
        destination = left
        for index in range(left, right):
            if values[index] <= pivot:
                values[destination], values[index] = values[index], values[destination]
                destination += 1
        values[destination], values[right] = values[right], values[destination]

        if destination == k:
            return values[destination]
        if destination < k:
            left = destination + 1
        else:
            right = destination - 1
