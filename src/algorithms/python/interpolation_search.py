def solve(data):
    """Return the first target index in sorted numeric values by interpolation, or -1."""
    values = data["values"]
    target = data["target"]
    low = 0
    high = len(values) - 1
    result = -1

    while low <= high and values[low] <= target <= values[high]:
        if values[low] == values[high]:
            return low if values[low] == target else result

        position = low + int(
            (target - values[low]) * (high - low)
            / (values[high] - values[low])
        )
        position = max(low, min(position, high))

        if values[position] < target:
            low = position + 1
        else:
            if values[position] == target:
                result = position
            high = position - 1
    return result
