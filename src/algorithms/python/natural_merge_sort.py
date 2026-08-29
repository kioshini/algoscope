def sort(values):
    if len(values) < 2:
        return values

    runs = []
    start = 0
    for index in range(1, len(values)):
        if values[index] < values[index - 1]:
            runs.append((start, index))
            start = index
    runs.append((start, len(values)))

    while len(runs) > 1:
        merged_runs = []
        run_index = 0
        while run_index < len(runs):
            if run_index + 1 >= len(runs):
                merged_runs.append(runs[run_index])
                break

            left, middle = runs[run_index]
            _, right = runs[run_index + 1]
            buffer = []
            first = left
            second = middle
            while first < middle and second < right:
                if not values[second] < values[first]:
                    buffer.append(values[first])
                    first += 1
                else:
                    buffer.append(values[second])
                    second += 1
            while first < middle:
                buffer.append(values[first])
                first += 1
            while second < right:
                buffer.append(values[second])
                second += 1
            for offset in range(len(buffer)):
                values[left + offset] = buffer[offset]

            merged_runs.append((left, right))
            run_index += 2
        runs = merged_runs

    return values
