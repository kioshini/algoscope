def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    if pattern == "":
        return 0

    separator = object()
    sequence = list(pattern) + [separator] + list(text)
    z_values = [0] * len(sequence)
    left = 0
    right = 0

    for index in range(1, len(sequence)):
        if index <= right:
            z_values[index] = min(right - index + 1, z_values[index - left])
        while (
            index + z_values[index] < len(sequence)
            and sequence[z_values[index]] == sequence[index + z_values[index]]
        ):
            z_values[index] += 1
        if index + z_values[index] - 1 > right:
            left = index
            right = index + z_values[index] - 1
        if index > len(pattern) and z_values[index] >= len(pattern):
            return index - len(pattern) - 1
    return -1
