def solve(data):
    """Maximize reusable-item value for a weighted-capacity input object."""
    if not isinstance(data, dict):
        raise TypeError("input must be an object")
    if not all(key in data for key in ("weights", "values", "capacity")):
        raise TypeError("input must contain weights, values, and capacity")
    weights = data["weights"]
    values = data["values"]
    capacity = data["capacity"]
    if not isinstance(weights, list) or not isinstance(values, list):
        raise TypeError("weights and values must be arrays")
    if len(weights) != len(values):
        raise ValueError("weights and values must have equal length")
    if not isinstance(capacity, int) or isinstance(capacity, bool):
        raise TypeError("capacity must be an integer")
    if capacity < 0:
        raise ValueError("capacity must be nonnegative")
    if any(not isinstance(weight, int) or isinstance(weight, bool) for weight in weights):
        raise TypeError("weights must contain integers")
    if any(weight <= 0 for weight in weights):
        raise ValueError("weights must be positive")
    if any(not isinstance(value, (int, float)) or isinstance(value, bool) for value in values):
        raise TypeError("values must contain numbers")

    best = [0] * (capacity + 1)
    for current in range(1, capacity + 1):
        for weight, value in zip(weights, values):
            if weight <= current:
                best[current] = max(best[current], best[current - weight] + value)
    return best[capacity]
