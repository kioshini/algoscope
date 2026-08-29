def solve(data):
    """Maximize exact-cut revenue for {"prices": [numbers], "length": nonnegative int}."""
    if not isinstance(data, dict) or "prices" not in data or "length" not in data:
        raise TypeError("input must be an object containing prices and length")
    prices = data["prices"]
    length = data["length"]
    if not isinstance(prices, list):
        raise TypeError("prices must be an array")
    if not isinstance(length, int) or isinstance(length, bool):
        raise TypeError("length must be an integer")
    if length < 0:
        raise ValueError("length must be nonnegative")
    if any(not isinstance(price, (int, float)) or isinstance(price, bool) for price in prices):
        raise TypeError("prices must contain numbers")
    if length > 0 and not prices:
        raise ValueError("prices cannot be empty for a positive length")

    revenue = [0] * (length + 1)
    for current in range(1, length + 1):
        revenue[current] = max(
            prices[piece - 1] + revenue[current - piece]
            for piece in range(1, min(current, len(prices)) + 1)
        )
    return revenue[length]
