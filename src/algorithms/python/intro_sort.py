def sort(values):
    length = len(values)
    if length < 2:
        return values

    def swap(first, second):
        temporary = values[first]
        values[first] = values[second]
        values[second] = temporary

    def insertion_sort(lower, upper):
        for index in range(lower + 1, upper):
            item = values[index]
            position = index
            while position > lower and item < values[position - 1]:
                values[position] = values[position - 1]
                position -= 1
            values[position] = item

    def heap_sort(lower, upper):
        size = upper - lower

        def sift_down(root, count):
            while 2 * root + 1 < count:
                child = 2 * root + 1
                if child + 1 < count and values[lower + child] < values[lower + child + 1]:
                    child += 1
                if not values[lower + root] < values[lower + child]:
                    return
                swap(lower + root, lower + child)
                root = child

        for root in range(size // 2 - 1, -1, -1):
            sift_down(root, size)
        for end in range(size - 1, 0, -1):
            swap(lower, lower + end)
            sift_down(0, end)

    depth_limit = 0
    remaining = length
    while remaining > 1:
        depth_limit += 2
        remaining //= 2

    threshold = 16
    pending = [(0, length, depth_limit)]
    while pending:
        lower, upper, depth = pending.pop()
        while upper - lower > threshold:
            if depth == 0:
                heap_sort(lower, upper)
                lower = upper
                break
            depth -= 1

            middle = lower + (upper - lower) // 2
            last = upper - 1
            if values[middle] < values[lower]:
                swap(middle, lower)
            if values[last] < values[middle]:
                swap(last, middle)
            if values[middle] < values[lower]:
                swap(middle, lower)
            swap(middle, last)

            pivot = values[last]
            boundary = lower
            for index in range(lower, last):
                if values[index] < pivot:
                    swap(boundary, index)
                    boundary += 1
            swap(boundary, last)

            if boundary - lower < upper - boundary - 1:
                pending.append((boundary + 1, upper, depth))
                upper = boundary
            else:
                pending.append((lower, boundary, depth))
                lower = boundary + 1
        if lower < upper:
            insertion_sort(lower, upper)

    return values
