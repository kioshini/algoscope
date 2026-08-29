def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    if pattern == "":
        return 0

    limit = len(text) - len(pattern) + 1
    for start in range(max(0, limit)):
        matched = True
        for offset in range(len(pattern)):
            if text[start + offset] != pattern[offset]:
                matched = False
                break
        if matched:
            return start
    return -1
