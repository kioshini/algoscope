def solve(data):
    """Return minimum scalar multiplications for {"dimensions": [positive ints]}."""
    if not isinstance(data, dict) or "dimensions" not in data:
        raise TypeError("input must be an object containing dimensions")
    dimensions = data["dimensions"]
    if not isinstance(dimensions, list):
        raise TypeError("dimensions must be an array")
    if any(not isinstance(size, int) or isinstance(size, bool) for size in dimensions):
        raise TypeError("dimensions must contain integers")
    if any(size <= 0 for size in dimensions):
        raise ValueError("dimensions must be positive")

    matrix_count = max(0, len(dimensions) - 1)
    if matrix_count < 2:
        return 0
    costs = [[0] * matrix_count for _ in range(matrix_count)]
    for chain_length in range(2, matrix_count + 1):
        for left in range(matrix_count - chain_length + 1):
            right = left + chain_length - 1
            costs[left][right] = min(
                costs[left][split]
                + costs[split + 1][right]
                + dimensions[left] * dimensions[split + 1] * dimensions[right + 1]
                for split in range(left, right)
            )
    return costs[0][matrix_count - 1]
