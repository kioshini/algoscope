def solve(data):
    """Return the minimum right/down path sum for {"grid": rectangular numeric array}."""
    if not isinstance(data, dict) or "grid" not in data:
        raise TypeError("input must be an object containing grid")
    grid = data["grid"]
    if not isinstance(grid, list):
        raise TypeError("grid must be an array")
    if not grid:
        return 0
    if any(not isinstance(row, list) for row in grid):
        raise TypeError("grid rows must be arrays")
    width = len(grid[0])
    if width == 0:
        if any(row for row in grid):
            raise ValueError("grid must be rectangular")
        return 0
    if any(len(row) != width for row in grid):
        raise ValueError("grid must be rectangular")
    if any(
        not isinstance(value, (int, float)) or isinstance(value, bool)
        for row in grid
        for value in row
    ):
        raise TypeError("grid must contain numbers")

    totals = [0] * width
    for row_index, row in enumerate(grid):
        for column, value in enumerate(row):
            if row_index == 0 and column == 0:
                totals[column] = value
            elif row_index == 0:
                totals[column] = totals[column - 1] + value
            elif column == 0:
                totals[column] += value
            else:
                totals[column] = min(totals[column], totals[column - 1]) + value
    return totals[-1]
