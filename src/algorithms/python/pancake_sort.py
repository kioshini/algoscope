def sort(values):
    def flip(end):
        left = 0
        while left < end:
            temporary = values[left]
            values[left] = values[end]
            values[end] = temporary
            left += 1
            end -= 1

    for size in range(len(values), 1, -1):
        maximum = 0
        for index in range(1, size):
            if values[index] > values[maximum]:
                maximum = index
        if maximum == size - 1:
            continue
        if maximum != 0:
            flip(maximum)
        flip(size - 1)

    return values
