def sort(values):
    gap = len(values)
    swapped = True

    while gap > 1 or swapped:
        gap = max(1, (gap * 10) // 13)
        swapped = False
        for index in range(len(values) - gap):
            other = index + gap
            if values[index] > values[other]:
                temporary = values[index]
                values[index] = values[other]
                values[other] = temporary
                swapped = True

    return values
