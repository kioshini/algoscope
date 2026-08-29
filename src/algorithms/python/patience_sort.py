def sort(values):
    length = len(values)
    if length < 2:
        return values

    piles = []
    for index in range(length):
        item = values[index]
        lower = 0
        upper = len(piles)
        while lower < upper:
            middle = lower + (upper - lower) // 2
            if piles[middle][-1] < item:
                lower = middle + 1
            else:
                upper = middle
        if lower == len(piles):
            piles.append([item])
        else:
            piles[lower].append(item)

    heap = []

    def comes_first(first, second):
        return piles[first][-1] < piles[second][-1]

    def push(pile_index):
        heap.append(pile_index)
        child = len(heap) - 1
        while child > 0:
            parent = (child - 1) // 2
            if not comes_first(heap[child], heap[parent]):
                break
            heap[child], heap[parent] = heap[parent], heap[child]
            child = parent

    def pop_minimum():
        minimum = heap[0]
        last = heap.pop()
        if heap:
            heap[0] = last
            parent = 0
            while 2 * parent + 1 < len(heap):
                child = 2 * parent + 1
                if child + 1 < len(heap) and comes_first(heap[child + 1], heap[child]):
                    child += 1
                if not comes_first(heap[child], heap[parent]):
                    break
                heap[parent], heap[child] = heap[child], heap[parent]
                parent = child
        return minimum

    for pile_index in range(len(piles)):
        push(pile_index)
    for destination in range(length):
        pile_index = pop_minimum()
        values[destination] = piles[pile_index].pop()
        if piles[pile_index]:
            push(pile_index)
    return values
