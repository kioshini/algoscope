def solve(data):
    """Return the first target index in sorted values by block jumps, or -1."""
    values = data["values"]
    target = data["target"]
    length = len(values)
    if length == 0:
        return -1

    step = max(1, int(length ** 0.5))
    block_start = 0
    block_end = min(step, length)

    while values[block_end - 1] < target:
        block_start = block_end
        if block_start >= length:
            return -1
        block_end = min(block_end + step, length)

    for index in range(block_start, block_end):
        if values[index] == target:
            return index
        if target < values[index]:
            break
    return -1
