def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    if pattern == "":
        return 0

    prefix = [0] * len(pattern)
    border = 0
    for index in range(1, len(pattern)):
        while border and pattern[index] != pattern[border]:
            border = prefix[border - 1]
        if pattern[index] == pattern[border]:
            border += 1
        prefix[index] = border

    matched = 0
    for index, character in enumerate(text):
        while matched and character != pattern[matched]:
            matched = prefix[matched - 1]
        if character == pattern[matched]:
            matched += 1
            if matched == len(pattern):
                return index - len(pattern) + 1
    return -1
