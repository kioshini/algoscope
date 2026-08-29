def sort(values):
    index = 1
    while index < len(values):
        if index == 0 or not values[index] < values[index - 1]:
            index += 1
        else:
            temporary = values[index]
            values[index] = values[index - 1]
            values[index - 1] = temporary
            index -= 1
    return values
