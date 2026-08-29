def solve(data):
    """Decide equal-sum partitionability for {"values": [nonnegative integers]}."""
    if not isinstance(data, dict) or "values" not in data:
        raise TypeError("input must be an object containing values")
    values = data["values"]
    if not isinstance(values, list):
        raise TypeError("values must be an array")
    if any(not isinstance(value, int) or isinstance(value, bool) for value in values):
        raise TypeError("values must contain integers")
    if any(value < 0 for value in values):
        raise ValueError("values must be nonnegative")

    total = sum(values)
    if total % 2:
        return False
    target = total // 2
    reachable = [False] * (target + 1)
    reachable[0] = True
    for value in values:
        for subtotal in range(target, value - 1, -1):
            reachable[subtotal] = reachable[subtotal] or reachable[subtotal - value]
    return reachable[target]
