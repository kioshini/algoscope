def solve(data):
    strings = data["strings"]
    if not strings:
        return ""

    prefix_length = len(strings[0])
    for value in strings[1:]:
        prefix_length = min(prefix_length, len(value))
        index = 0
        while index < prefix_length and strings[0][index] == value[index]:
            index += 1
        prefix_length = index
        if prefix_length == 0:
            break
    return strings[0][:prefix_length]
