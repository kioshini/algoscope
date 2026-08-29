def sort(values):
    for end in range(len(values) - 1, 0, -1):
        changed = False
        for index in range(end):
            if values[index + 1] < values[index]:
                temporary = values[index]
                values[index] = values[index + 1]
                values[index + 1] = temporary
                changed = True
        if not changed:
            break
    return values
