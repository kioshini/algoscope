def solve(data):
    """Count order-independent combinations for {"coins": [...], "amount": int}."""
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
    if len(set(coins)) != len(coins):
        raise ValueError("coins must be unique")

    combinations = [0] * (amount + 1)
    combinations[0] = 1
    for coin in coins:
        for current in range(coin, amount + 1):
            combinations[current] += combinations[current - coin]
    return combinations[amount]
