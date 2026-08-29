def solve(data):
    first = data["first"]
    second = data["second"]
    lengths = [[0] * (len(second) + 1) for _ in range(len(first) + 1)]

    for first_index in range(len(first) - 1, -1, -1):
        for second_index in range(len(second) - 1, -1, -1):
            if first[first_index] == second[second_index]:
                lengths[first_index][second_index] = lengths[first_index + 1][second_index + 1] + 1
            else:
                lengths[first_index][second_index] = max(
                    lengths[first_index + 1][second_index],
                    lengths[first_index][second_index + 1],
                )

    result = []
    first_index = 0
    second_index = 0
    while first_index < len(first) and second_index < len(second):
        if first[first_index] == second[second_index]:
            result.append(first[first_index])
            first_index += 1
            second_index += 1
        elif lengths[first_index + 1][second_index] >= lengths[first_index][second_index + 1]:
            first_index += 1
        else:
            second_index += 1
    return "".join(result)
