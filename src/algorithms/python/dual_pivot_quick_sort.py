def sort(values):
    def quick_sort(lower, upper):
        if lower >= upper:
            return

        if values[upper] < values[lower]:
            temporary = values[lower]
            values[lower] = values[upper]
            values[upper] = temporary

        left_pivot = values[lower]
        right_pivot = values[upper]
        less = lower + 1
        greater = upper - 1
        index = less

        while index <= greater:
            if values[index] < left_pivot:
                temporary = values[index]
                values[index] = values[less]
                values[less] = temporary
                less += 1
            elif right_pivot < values[index]:
                while index < greater and right_pivot < values[greater]:
                    greater -= 1
                temporary = values[index]
                values[index] = values[greater]
                values[greater] = temporary
                greater -= 1

                if values[index] < left_pivot:
                    temporary = values[index]
                    values[index] = values[less]
                    values[less] = temporary
                    less += 1
            index += 1

        less -= 1
        greater += 1
        temporary = values[lower]
        values[lower] = values[less]
        values[less] = temporary
        temporary = values[upper]
        values[upper] = values[greater]
        values[greater] = temporary

        quick_sort(lower, less - 1)
        if left_pivot < right_pivot:
            quick_sort(less + 1, greater - 1)
        quick_sort(greater + 1, upper)

    quick_sort(0, len(values) - 1)
    return values
