def solve(data):
    """Return the fewest coins for a coin-change object, or -1 if impossible."""
    if not isinstance(data, dict) or "coins" not in data or "amount" not in data:
        raise TypeError("input must be an object containing coins and amount")
    coins = data["coins"]
    amount = data["amount"]
    if not isinstance(coins, list):
        raise TypeError("coins must be an array")
    if not isinstance(amount, int) or isinstance(amount, bool):
        raise TypeError("amount must be an integer")
    if amount < 0:
        raise ValueError("amount must be nonnegative")
    if any(not isinstance(coin, int) or isinstance(coin, bool) for coin in coins):
        raise TypeError("coins must contain integers")
    if any(coin <= 0 for coin in coins):
        raise ValueError("coins must be positive")

    unreachable = amount + 1
    minimum = [0] + [unreachable] * amount
    for current in range(1, amount + 1):
        for coin in coins:
            if coin <= current:
                minimum[current] = min(minimum[current], minimum[current - coin] + 1)
    return -1 if minimum[amount] == unreachable else minimum[amount]
