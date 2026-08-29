def sort(values):
    for index in range(1, len(values)):
        current = values[index]
        left = 0
        right = index

        while left < right:
            middle = (left + right) // 2
            if current < values[middle]:
                right = middle
            else:
                left = middle + 1

        position = index
        while position > left:
            values[position] = values[position - 1]
            position -= 1
        values[left] = current

    return values
