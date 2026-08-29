def solve(data):
    """Return F(n) for {"n": nonnegative integer} using bottom-up DP."""
    if not isinstance(data, dict) or "n" not in data:
        raise TypeError("input must be an object containing n")
    n = data["n"]
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n < 2:
        return n

    table = [0] * (n + 1)
    table[1] = 1
    for index in range(2, n + 1):
        table[index] = table[index - 1] + table[index - 2]
    return table[n]
