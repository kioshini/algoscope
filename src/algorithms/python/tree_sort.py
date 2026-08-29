def sort(values):
    length = len(values)
    if length < 2:
        return values

    root = [values[0], None, None, 1]
    for index in range(1, length):
        item = values[index]
        node = root
        while True:
            if item < node[0]:
                if node[1] is None:
                    node[1] = [item, None, None, 1]
                    break
                node = node[1]
            elif node[0] < item:
                if node[2] is None:
                    node[2] = [item, None, None, 1]
                    break
                node = node[2]
            else:
                node[3] += 1
                break

    stack = []
    node = root
    destination = 0
    while stack or node is not None:
        while node is not None:
            stack.append(node)
            node = node[1]
        node = stack.pop()
        for _ in range(node[3]):
            values[destination] = node[0]
            destination += 1
        node = node[2]
    return values
