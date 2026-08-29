def sort(values):
    for start in range(len(values) - 1):
        minimum = start
        for index in range(start + 1, len(values)):
            if values[index] < values[minimum]:
                minimum = index
        if minimum != start:
            temporary = values[start]
            values[start] = values[minimum]
            values[minimum] = temporary
    return values
