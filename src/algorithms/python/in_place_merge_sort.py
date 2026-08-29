def sort(values):
    def merge(lower, middle, upper):
        left = lower
        right = middle

        while left < right and right < upper:
            if not values[right] < values[left]:
                left += 1
                continue

            temporary = values[right]
            index = right
            while index > left:
                values[index] = values[index - 1]
                index -= 1
            values[left] = temporary

            left += 1
            right += 1

    def merge_sort(lower, upper):
        if upper - lower < 2:
            return

        middle = (lower + upper) // 2
        merge_sort(lower, middle)
        merge_sort(middle, upper)
        merge(lower, middle, upper)

    merge_sort(0, len(values))
    return values
