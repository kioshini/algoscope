def sort(values):
    if len(values) < 2:
        return values

    remaining = list(values)
    result = []

    while remaining:
        strand = [remaining.pop(0)]
        index = 0
        while index < len(remaining):
            if not remaining[index] < strand[-1]:
                strand.append(remaining.pop(index))
            else:
                index += 1

        merged = []
        result_index = 0
        strand_index = 0
        while result_index < len(result) and strand_index < len(strand):
            if not strand[strand_index] < result[result_index]:
                merged.append(result[result_index])
                result_index += 1
            else:
                merged.append(strand[strand_index])
                strand_index += 1
        while result_index < len(result):
            merged.append(result[result_index])
            result_index += 1
        while strand_index < len(strand):
            merged.append(strand[strand_index])
            strand_index += 1
        result = merged

    for index in range(len(values)):
        values[index] = result[index]
    return values
