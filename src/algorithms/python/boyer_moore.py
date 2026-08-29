def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    pattern_length = len(pattern)
    if pattern_length == 0:
        return 0
    if pattern_length > len(text):
        return -1

    last_position = {}
    for index, character in enumerate(pattern):
        last_position[character] = index

    shift = [0] * (pattern_length + 1)
    border = [0] * (pattern_length + 1)
    left = pattern_length
    right = pattern_length + 1
    border[left] = right
    while left > 0:
        while right <= pattern_length and pattern[left - 1] != pattern[right - 1]:
            if shift[right] == 0:
                shift[right] = right - left
            right = border[right]
        left -= 1
        right -= 1
        border[left] = right

    right = border[0]
    for index in range(pattern_length + 1):
        if shift[index] == 0:
            shift[index] = right
        if index == right:
            right = border[right]

    start = 0
    while start <= len(text) - pattern_length:
        index = pattern_length - 1
        while index >= 0 and pattern[index] == text[start + index]:
            index -= 1
        if index < 0:
            return start
        bad_character = index - last_position.get(text[start + index], -1)
        start += max(1, bad_character, shift[index + 1])
    return -1
