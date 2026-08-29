def sort(values):
    if len(values) < 2:
        return values

    minimum = values[0]
    maximum = values[0]
    for index in range(1, len(values)):
        if values[index] < minimum:
            minimum = values[index]
        if maximum < values[index]:
            maximum = values[index]

    if not minimum < maximum and not maximum < minimum:
        return values

    bucket_count = len(values)
    buckets = [[] for _ in range(bucket_count)]
    try:
        span = maximum - minimum
        for value in values:
            bucket_index = int((value - minimum) * (bucket_count - 1) / span)
            if bucket_index < 0:
                bucket_index = 0
            elif bucket_index >= bucket_count:
                bucket_index = bucket_count - 1
            buckets[bucket_index].append(value)
    except (OverflowError, ValueError, ZeroDivisionError):
        buckets = [list(values)]

    for bucket in buckets:
        for index in range(1, len(bucket)):
            item = bucket[index]
            position = index
            while position > 0 and item < bucket[position - 1]:
                bucket[position] = bucket[position - 1]
                position -= 1
            bucket[position] = item

    destination = 0
    for bucket in buckets:
        for item in bucket:
            values[destination] = item
            destination += 1
    return values
