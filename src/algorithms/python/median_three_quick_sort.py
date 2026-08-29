def sort(values):
    def quick_sort(lower, upper):
        if lower >= upper:
            return

        middle = (lower + upper) // 2
        if values[middle] < values[lower]:
            temporary = values[lower]
            values[lower] = values[middle]
            values[middle] = temporary
        if values[upper] < values[lower]:
            temporary = values[lower]
            values[lower] = values[upper]
            values[upper] = temporary
        if values[upper] < values[middle]:
            temporary = values[middle]
            values[middle] = values[upper]
            values[upper] = temporary

        pivot = values[middle]
        left = lower
        right = upper
        while left <= right:
            while values[left] < pivot:
                left += 1
            while pivot < values[right]:
                right -= 1
            if left <= right:
                temporary = values[left]
                values[left] = values[right]
                values[right] = temporary
                left += 1
                right -= 1

        quick_sort(lower, right)
        quick_sort(left, upper)

    quick_sort(0, len(values) - 1)
    return values
