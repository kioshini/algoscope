def sort(values):
    def quick_sort(lower, upper):
        if lower >= upper:
            return

        pivot = values[(lower + upper) // 2]
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
