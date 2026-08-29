def sort(values):
    lower = 0
    upper = len(values) - 1
    changed = True
    while changed and lower < upper:
        changed = False
        for index in range(lower, upper):
            if values[index + 1] < values[index]:
                temporary = values[index]
                values[index] = values[index + 1]
                values[index + 1] = temporary
                changed = True
        upper -= 1
        if not changed:
            break
        changed = False
        for index in range(upper, lower, -1):
            if values[index] < values[index - 1]:
                temporary = values[index]
                values[index] = values[index - 1]
                values[index - 1] = temporary
                changed = True
        lower += 1
    return values
