def solve(data):
    """Return F(n) for {"n": nonnegative integer} using top-down DP."""
    if not isinstance(data, dict) or "n" not in data:
        raise TypeError("input must be an object containing n")
    n = data["n"]
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be nonnegative")

    memo = {0: 0, 1: 1}

    def fibonacci(index):
        if index not in memo:
            memo[index] = fibonacci(index - 1) + fibonacci(index - 2)
        return memo[index]

    return fibonacci(n)
