def sort(values):
    length = len(values)
    if length < 2:
        return values

    def reverse(lower, upper):
        upper -= 1
        while lower < upper:
            temporary = values[lower]
            values[lower] = values[upper]
            values[upper] = temporary
            lower += 1
            upper -= 1

    def insertion_sort(lower, upper, start):
        for index in range(start, upper):
            item = values[index]
            position = index
            while position > lower and item < values[position - 1]:
                values[position] = values[position - 1]
                position -= 1
            values[position] = item

    def merge(left, middle, right):
        buffer = []
        index = left
        while index < middle:
            buffer.append(values[index])
            index += 1

        first = 0
        second = middle
        destination = left
        while first < len(buffer) and second < right:
            if values[second] < buffer[first]:
                values[destination] = values[second]
                second += 1
            else:
                values[destination] = buffer[first]
                first += 1
            destination += 1
        while first < len(buffer):
            values[destination] = buffer[first]
            first += 1
            destination += 1

    minrun = length
    remainder = 0
    while minrun >= 64:
        remainder |= minrun & 1
        minrun >>= 1
    minrun += remainder

    runs = []

    def merge_at(index):
        left, left_size = runs[index]
        _, right_size = runs[index + 1]
        merge(left, left + left_size, left + left_size + right_size)
        runs[index] = (left, left_size + right_size)
        del runs[index + 1]

    start = 0
    while start < length:
        end = start + 1
        if end < length:
            if values[end] < values[start]:
                end += 1
                while end < length and values[end] < values[end - 1]:
                    end += 1
                reverse(start, end)
            else:
                end += 1
                while end < length and not values[end] < values[end - 1]:
                    end += 1

        forced_end = start + minrun
        if forced_end > length:
            forced_end = length
        if end < forced_end:
            insertion_sort(start, forced_end, end)
            end = forced_end

        runs.append((start, end - start))
        while len(runs) > 1:
            count = len(runs)
            if count >= 3 and runs[count - 3][1] <= runs[count - 2][1] + runs[count - 1][1]:
                if runs[count - 3][1] < runs[count - 1][1]:
                    merge_at(count - 3)
                else:
                    merge_at(count - 2)
            elif runs[count - 2][1] <= runs[count - 1][1]:
                merge_at(count - 2)
            else:
                break
        start = end

    while len(runs) > 1:
        merge_at(len(runs) - 2)
    return values
