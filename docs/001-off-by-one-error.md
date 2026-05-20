# Bug #001: Off-by-One Error

## What is it?

An off-by-one error occurs when a loop, array access, or calculation is off by exactly one position. This is one of the most common bugs in programming, often called the "fence-post problem."

## Why It Happens

- Confusion between inclusive and exclusive bounds
- Forgetting that arrays are zero-indexed
- Miscounting loop iterations
- Misunderstanding loop conditions

## Symptoms

- Loops run one iteration too many or too few
- Last element is skipped or first element is included twice
- Array index out of bounds errors
- Incorrect count or sum calculations

## Examples

### JavaScript - Array Loop
```javascript
// WRONG: Skips the last element
for (let i = 0; i < array.length - 1; i++) {
    console.log(array[i]);
}

// CORRECT: Includes all elements
for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
}
```

### Python - Range Function
```python
# WRONG: range(1, 10) gives 1-9, not 1-10
for i in range(1, 10):
    print(i)

# CORRECT: Use range(1, 11) for 1-10
for i in range(1, 11):
    print(i)
```

### C - Buffer Allocation
```c
// WRONG: Not enough space for null terminator
char buffer[5];
strcpy(buffer, "Hello"); // Buffer overflow!

// CORRECT: +1 for null terminator
char buffer[6];
strcpy(buffer, "Hello");
```

## How to Fix

1. **Be explicit about bounds**: Use comments explaining why you chose specific loop limits
2. **Test with edge cases**: Always test with first and last elements
3. **Use language features**: Prefer `for-each` loops when available
4. **Visualize the fence**: Draw out which elements you want to include
5. **Count carefully**: Count on your fingers if needed during debugging

## Prevention Tips

- Always consider whether bounds are inclusive or exclusive
- Remember: arrays are zero-indexed
- Use `<` for array loops (not `<=`)
- Test boundary conditions thoroughly
