def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    pattern_length = len(pattern)
    if pattern_length == 0:
        return 0
    if pattern_length > len(text):
        return -1

    shifts = {}
    for index in range(pattern_length - 1):
        shifts[pattern[index]] = pattern_length - index - 1

    end = pattern_length - 1
    while end < len(text):
        offset = 0
        while offset < pattern_length and pattern[pattern_length - offset - 1] == text[end - offset]:
            offset += 1
        if offset == pattern_length:
            return end - pattern_length + 1
        end += shifts.get(text[end], pattern_length)
    return -1
