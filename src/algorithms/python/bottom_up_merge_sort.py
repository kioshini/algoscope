def sort(values):
    length = len(values)
    auxiliary = [None] * length
    width = 1

    while width < length:
        lower = 0
        while lower < length:
            middle = min(lower + width, length)
            upper = min(lower + 2 * width, length)

            for index in range(lower, upper):
                auxiliary[index] = values[index]

            left = lower
            right = middle
            destination = lower
            while destination < upper:
                if left >= middle:
                    values[destination] = auxiliary[right]
                    right += 1
                elif right >= upper:
                    values[destination] = auxiliary[left]
                    left += 1
                elif auxiliary[right] < auxiliary[left]:
                    values[destination] = auxiliary[right]
                    right += 1
                else:
                    values[destination] = auxiliary[left]
                    left += 1
                destination += 1

            lower += 2 * width
        width *= 2

    return values
