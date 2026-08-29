def sort(values):
    def quick_sort(lower, upper):
        if lower >= upper:
            return
        pivot = values[upper]
        destination = lower
        for index in range(lower, upper):
            if not pivot < values[index]:
                if destination != index:
                    temporary = values[destination]
                    values[destination] = values[index]
                    values[index] = temporary
                destination += 1
        temporary = values[destination]
        values[destination] = values[upper]
        values[upper] = temporary
        quick_sort(lower, destination - 1)
        quick_sort(destination + 1, upper)

    quick_sort(0, len(values) - 1)
    return values
