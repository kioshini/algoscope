def sort(values):
    def sift_down(root, upper):
        while 2 * root + 1 < upper:
            child = 2 * root + 1
            if child + 1 < upper and values[child] < values[child + 1]:
                child += 1
            if not values[root] < values[child]:
                break
            temporary = values[root]
            values[root] = values[child]
            values[child] = temporary
            root = child

    for root in range(len(values) // 2 - 1, -1, -1):
        sift_down(root, len(values))
    for upper in range(len(values) - 1, 0, -1):
        temporary = values[0]
        values[0] = values[upper]
        values[upper] = temporary
        sift_down(0, upper)
    return values
