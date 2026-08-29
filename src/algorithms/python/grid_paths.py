def solve(data):
    """Count right/down paths for {"rows": nonnegative int, "columns": nonnegative int}."""
    if not isinstance(data, dict) or "rows" not in data or "columns" not in data:
        raise TypeError("input must be an object containing rows and columns")
    rows = data["rows"]
    columns = data["columns"]
    if any(not isinstance(size, int) or isinstance(size, bool) for size in (rows, columns)):
        raise TypeError("rows and columns must be integers")
    if rows < 0 or columns < 0:
        raise ValueError("rows and columns must be nonnegative")
    if rows == 0 or columns == 0:
        return 0

    paths = [1] * columns
    for _ in range(1, rows):
        for column in range(1, columns):
            paths[column] += paths[column - 1]
    return paths[-1]
