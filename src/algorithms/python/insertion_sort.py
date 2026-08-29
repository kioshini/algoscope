def sort(values):
    for index in range(1, len(values)):
        item = values[index]
        position = index - 1
        while position >= 0 and item < values[position]:
            values[position + 1] = values[position]
            position -= 1
        values[position + 1] = item
    return values
