def sort(values):
    def equivalent(left, right):
        return not left < right and not right < left

    for cycle_start in range(len(values) - 1):
        item = values[cycle_start]
        position = cycle_start
        for index in range(cycle_start + 1, len(values)):
            if values[index] < item:
                position += 1
        if position == cycle_start:
            continue
        while equivalent(item, values[position]):
            position += 1
        displaced = values[position]
        values[position] = item
        item = displaced
        while position != cycle_start:
            position = cycle_start
            for index in range(cycle_start + 1, len(values)):
                if values[index] < item:
                    position += 1
            while equivalent(item, values[position]):
                position += 1
            displaced = values[position]
            values[position] = item
            item = displaced
    return values
