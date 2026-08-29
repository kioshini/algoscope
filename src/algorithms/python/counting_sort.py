import operator


def sort(values):
    if not values:
        return values

    keys = []
    for value in values:
        if isinstance(value, bool):
            raise TypeError("values must be integers")
        try:
            keys.append(operator.index(value))
        except TypeError:
            raise TypeError("values must be integers") from None

    minimum = keys[0]
    maximum = keys[0]
    for key in keys[1:]:
        if key < minimum:
            minimum = key
        if key > maximum:
            maximum = key

    range_size = maximum - minimum + 1
    if range_size > max(1000000, len(values) * 100):
        groups = {}
        ordered_keys = []
        for index in range(len(keys)):
            key = keys[index]
            if key not in groups:
                groups[key] = []
                ordered_keys.append(key)
            groups[key].append(values[index])

        for index in range(1, len(ordered_keys)):
            key = ordered_keys[index]
            position = index
            while position > 0 and key < ordered_keys[position - 1]:
                ordered_keys[position] = ordered_keys[position - 1]
                position -= 1
            ordered_keys[position] = key

        destination = 0
        for key in ordered_keys:
            for value in groups[key]:
                values[destination] = value
                destination += 1
        return values

    counts = [0] * range_size
    for key in keys:
        counts[key - minimum] += 1
    for index in range(1, len(counts)):
        counts[index] += counts[index - 1]

    output = [None] * len(values)
    for index in range(len(values) - 1, -1, -1):
        count_index = keys[index] - minimum
        counts[count_index] -= 1
        output[counts[count_index]] = values[index]

    for index in range(len(values)):
        values[index] = output[index]
    return values
