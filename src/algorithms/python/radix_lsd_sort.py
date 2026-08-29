import operator


def sort(values):
    if not values:
        return values

    items = list(values)
    keys = []
    for value in items:
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

    for index in range(len(keys)):
        keys[index] -= minimum
    largest = maximum - minimum

    place = 1
    while largest // place > 0:
        counts = [0] * 10
        for key in keys:
            counts[(key // place) % 10] += 1
        for index in range(1, 10):
            counts[index] += counts[index - 1]

        next_items = [None] * len(items)
        next_keys = [0] * len(keys)
        for index in range(len(items) - 1, -1, -1):
            digit = (keys[index] // place) % 10
            counts[digit] -= 1
            destination = counts[digit]
            next_items[destination] = items[index]
            next_keys[destination] = keys[index]
        items = next_items
        keys = next_keys
        place *= 10

    for index in range(len(values)):
        values[index] = items[index]
    return values
