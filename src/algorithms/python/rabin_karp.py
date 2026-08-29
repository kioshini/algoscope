def solve(data):
    text = data["text"]
    pattern = data["pattern"]
    pattern_length = len(pattern)
    if pattern_length == 0:
        return 0
    if pattern_length > len(text):
        return -1

    base = 257
    modulus = 1000000007
    high_place = pow(base, pattern_length - 1, modulus)
    pattern_hash = 0
    window_hash = 0
    for index in range(pattern_length):
        pattern_hash = (pattern_hash * base + ord(pattern[index])) % modulus
        window_hash = (window_hash * base + ord(text[index])) % modulus

    for start in range(len(text) - pattern_length + 1):
        if pattern_hash == window_hash and text[start:start + pattern_length] == pattern:
            return start
        if start + pattern_length < len(text):
            window_hash = (window_hash - ord(text[start]) * high_place) % modulus
            window_hash = (window_hash * base + ord(text[start + pattern_length])) % modulus
    return -1
