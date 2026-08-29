def sort(values):
    length = len(values)
    if length < 2:
        return values

    contenders = []
    for index in range(length):
        contenders.append(values[index])

    leaf_count = 1
    while leaf_count < length:
        leaf_count *= 2
    tree = [None] * (2 * leaf_count)
    for index in range(length):
        tree[leaf_count + index] = index

    def winner(first, second):
        if first is None:
            return second
        if second is None:
            return first
        if contenders[second] < contenders[first]:
            return second
        return first

    for node in range(leaf_count - 1, 0, -1):
        tree[node] = winner(tree[2 * node], tree[2 * node + 1])

    for destination in range(length):
        champion = tree[1]
        values[destination] = contenders[champion]
        node = leaf_count + champion
        tree[node] = None
        node //= 2
        while node:
            tree[node] = winner(tree[2 * node], tree[2 * node + 1])
            node //= 2
    return values
