def sort(values):
    def quick_sort(lower, upper):
        if lower >= upper:
            return

        pivot = values[lower]
        less = lower
        index = lower + 1
        greater = upper

        while index <= greater:
            if values[index] < pivot:
                temporary = values[less]
                values[less] = values[index]
                values[index] = temporary
                less += 1
                index += 1
            elif pivot < values[index]:
                temporary = values[index]
                values[index] = values[greater]
                values[greater] = temporary
                greater -= 1
            else:
                index += 1

        quick_sort(lower, less - 1)
        quick_sort(greater + 1, upper)

    quick_sort(0, len(values) - 1)
    return values
