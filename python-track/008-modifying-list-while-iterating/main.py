numbers = [1, 2, 3, 4, 5]

# BUG: Removing items from a list while iterating over it
for num in numbers:
    if num % 2 == 0:
        numbers.remove(num)

print(numbers)  # Unexpected result
