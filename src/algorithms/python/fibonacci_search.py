def solve(data):
    """Return the first target index in sorted values using Fibonacci offsets, or -1."""
    values = data["values"]
    target = data["target"]
    length = len(values)

    smaller = 0
    larger = 1
    fibonacci = smaller + larger
    while fibonacci < length:
        smaller = larger
        larger = fibonacci
        fibonacci = smaller + larger

    offset = -1
    result = -1
    while fibonacci > 1:
        index = min(offset + smaller, length - 1)
        if values[index] < target:
            fibonacci = larger
            larger = smaller
            smaller = fibonacci - larger
            offset = index
        else:
            if values[index] == target:
                result = index
            fibonacci = smaller
            larger = larger - smaller
            smaller = fibonacci - larger

    candidate = offset + 1
    if candidate < length and values[candidate] == target:
        result = candidate
    return result
