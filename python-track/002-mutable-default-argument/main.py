def add_item(item, items=[]):
    items.append(item)
    return items

result1 = add_item(1)
print(result1)

result2 = add_item(2)
print(result2)  # BUG: Prints [1, 2] instead of [2]
