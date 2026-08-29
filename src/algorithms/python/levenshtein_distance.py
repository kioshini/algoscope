def solve(data):
    first = data["first"]
    second = data["second"]
    if len(first) < len(second):
        first, second = second, first

    previous = list(range(len(second) + 1))
    for first_index, first_character in enumerate(first, 1):
        current = [first_index]
        for second_index, second_character in enumerate(second, 1):
            insertion = current[-1] + 1
            deletion = previous[second_index] + 1
            substitution = previous[second_index - 1] + (first_character != second_character)
            current.append(min(insertion, deletion, substitution))
        previous = current
    return previous[-1]
