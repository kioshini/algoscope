def solve(data):
    text = data["text"]
    length = len(text)
    if length == 0:
        return ""

    best_start = 0
    best_length = 1

    odd = [0] * length
    left = 0
    right = -1
    for center in range(length):
        radius = 1 if center > right else min(odd[left + right - center], right - center + 1)
        while center - radius >= 0 and center + radius < length and text[center - radius] == text[center + radius]:
            radius += 1
        odd[center] = radius
        start = center - radius + 1
        palindrome_length = radius * 2 - 1
        if palindrome_length > best_length or (palindrome_length == best_length and start < best_start):
            best_start = start
            best_length = palindrome_length
        if center + radius - 1 > right:
            left = center - radius + 1
            right = center + radius - 1

    even = [0] * length
    left = 0
    right = -1
    for center in range(length):
        radius = 0 if center > right else min(even[left + right - center + 1], right - center + 1)
        while center - radius - 1 >= 0 and center + radius < length and text[center - radius - 1] == text[center + radius]:
            radius += 1
        even[center] = radius
        start = center - radius
        palindrome_length = radius * 2
        if palindrome_length > best_length or (palindrome_length == best_length and start < best_start):
            best_start = start
            best_length = palindrome_length
        if center + radius - 1 > right:
            left = center - radius
            right = center + radius - 1

    return text[best_start:best_start + best_length]
