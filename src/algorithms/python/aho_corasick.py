def solve(data):
    text = data["text"]
    patterns = data["patterns"]
    transitions = [{}]
    failures = [0]
    outputs = [[]]

    for pattern_index, pattern in enumerate(patterns):
        if pattern == "":
            continue
        state = 0
        for character in pattern:
            next_state = transitions[state].get(character)
            if next_state is None:
                next_state = len(transitions)
                transitions[state][character] = next_state
                transitions.append({})
                failures.append(0)
                outputs.append([])
            state = next_state
        outputs[state].append(pattern_index)

    queue = []
    for state in transitions[0].values():
        queue.append(state)
    queue_index = 0
    while queue_index < len(queue):
        state = queue[queue_index]
        queue_index += 1
        for character, next_state in transitions[state].items():
            queue.append(next_state)
            fallback = failures[state]
            while fallback and character not in transitions[fallback]:
                fallback = failures[fallback]
            failures[next_state] = transitions[fallback].get(character, 0)
            outputs[next_state].extend(outputs[failures[next_state]])

    found = [(0, index) for index, pattern in enumerate(patterns) if pattern == ""]
    state = 0
    for end, character in enumerate(text):
        while state and character not in transitions[state]:
            state = failures[state]
        state = transitions[state].get(character, 0)
        for pattern_index in outputs[state]:
            start = end - len(patterns[pattern_index]) + 1
            found.append((start, pattern_index))

    found.sort(key=lambda match: (match[0], match[1]))
    return [
        {"index": start, "pattern": patterns[pattern_index]}
        for start, pattern_index in found
    ]
