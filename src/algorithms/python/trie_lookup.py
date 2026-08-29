def solve(data):
    root = {"children": {}, "terminal": False}
    for word in data["words"]:
        node = root
        for character in word:
            children = node["children"]
            if character not in children:
                children[character] = {"children": {}, "terminal": False}
            node = children[character]
        node["terminal"] = True

    node = root
    for character in data["query"]:
        node = node["children"].get(character)
        if node is None:
            return False
    return node["terminal"]
