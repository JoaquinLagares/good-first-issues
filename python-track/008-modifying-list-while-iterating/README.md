# Bug #008: The Iteration Interference

### The Goal
Remove all even numbers from a list.

### The Symptoms
Some even numbers are not removed, or the result is unpredictable.

### Hints
1. Modifying a list while iterating over it causes the iterator to skip items.
2. Iterate over a copy of the list: `for num in numbers[:]` or `for num in list(numbers)`.
3. Or use a list comprehension: `numbers = [n for n in numbers if n % 2 != 0]`.
 flagship.
 flagship.
 flagship.
