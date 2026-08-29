def solve(data):
    """Return one deterministic strict LIS for {"values": [numbers]}."""
    if not isinstance(data, dict) or "values" not in data:
        raise TypeError("input must be an object containing values")
    values = data["values"]
    if not isinstance(values, list):
        raise TypeError("values must be an array")
    if any(not isinstance(value, (int, float)) or isinstance(value, bool) for value in values):
        raise TypeError("values must contain numbers")
    if not values:
        return []

    lengths = [1] * len(values)
    previous = [-1] * len(values)
    for end in range(len(values)):
        for start in range(end):
            candidate = lengths[start] + 1
            if values[start] < values[end] and candidate > lengths[end]:
                lengths[end] = candidate
                previous[end] = start

    endpoint = max(range(len(values)), key=lambda index: lengths[index])
    result = []
    while endpoint != -1:
        result.append(values[endpoint])
        endpoint = previous[endpoint]
    result.reverse()
    return result
