def sort(values):
    gap = len(values) // 2
    while gap > 0:
        for index in range(gap, len(values)):
            item = values[index]
            position = index
            while position >= gap and item < values[position - gap]:
                values[position] = values[position - gap]
                position -= gap
            values[position] = item
        gap //= 2
    return values
