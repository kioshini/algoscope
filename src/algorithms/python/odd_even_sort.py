def sort(values):
    changed = True

    while changed:
        changed = False
        for start in (1, 0):
            for index in range(start, len(values) - 1, 2):
                if values[index] > values[index + 1]:
                    temporary = values[index]
                    values[index] = values[index + 1]
                    values[index + 1] = temporary
                    changed = True

    return values
