def sort(values):
    auxiliary = [None] * len(values)

    def merge_sort(lower, upper):
        if upper - lower < 2:
            return
        middle = (lower + upper) // 2
        merge_sort(lower, middle)
        merge_sort(middle, upper)
        for index in range(lower, upper):
            auxiliary[index] = values[index]
        left = lower
        right = middle
        for destination in range(lower, upper):
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

    merge_sort(0, len(values))
    return values
