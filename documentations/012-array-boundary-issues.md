# Bug #012: Array Boundary Issues

## What is it?

Array boundary issues occur when accessing array elements outside the valid index range (0 to length-1). This causes runtime errors, crashes, or undefined behavior. It's one of the most common bugs in C/C++ but also appears in all languages.

## Why It Happens

1. **Off-by-One Errors**: Using `<=` instead of `<` in loop conditions
2. **Forgetting Length**: Attempting to access index equal to array length
3. **Negative Indices**: Accidental negative index access
4. **Loop Variable Overflow**: Integer overflow making index out of bounds
5. **Empty Array Access**: Accessing first element without checking if array is empty

## Symptoms

- `IndexOutOfBoundsException` (Java)
- Segmentation fault (C/C++)
- Undefined behavior (C/C++)
- Runtime error accessing array element
- Program crash
- Garbage values returned

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Loop goes one past array end
let arr = [10, 20, 30];
for (let i = 0; i <= arr.length; i++) {
    console.log(arr[i]);  // Last iteration: arr[3] = undefined
}

// CORRECT: Use < instead of <=
let arr = [10, 20, 30];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);  // Safe: i goes 0, 1, 2
}

// WRONG: Assuming array isn't empty
let results = [];
let first = results[0];  // undefined, not an error but wrong

// CORRECT: Check length first
let results = [];
if (results.length > 0) {
    let first = results[0];
}
```

### Python
```python
# WRONG: Index equals array length
arr = [10, 20, 30]
print(arr[3])  # IndexError: list index out of range

# CORRECT: Use valid indices (0, 1, 2)
arr = [10, 20, 30]
print(arr[2])  # Output: 30

# WRONG: Loop condition goes too far
arr = [1, 2, 3]
for i in range(len(arr) + 1):
    print(arr[i])  # IndexError on last iteration

# CORRECT: range(len(arr)) goes 0 to len-1
arr = [1, 2, 3]
for i in range(len(arr)):
    print(arr[i])  # Safe: 0, 1, 2
```

### C
```c
// WRONG: Buffer overflow
int arr[3] = {10, 20, 30};
arr[3] = 40;  // Writing beyond array bounds!

// CORRECT: Use valid indices
int arr[3] = {10, 20, 30};
arr[2] = 40;  // Valid: index 2 is the 3rd element

// WRONG: Loop exceeds bounds
int arr[5];
for (int i = 0; i <= 5; i++) {
    arr[i] = i;  // When i=5, out of bounds!
}

// CORRECT: Use < for loop condition
int arr[5];
for (int i = 0; i < 5; i++) {
    arr[i] = i;  // Safe: 0, 1, 2, 3, 4
}
```

### Java
```java
// WRONG: Accessing beyond array length
int[] numbers = {10, 20, 30};
System.out.println(numbers[3]);  // ArrayIndexOutOfBoundsException

// CORRECT: Use valid indices
int[] numbers = {10, 20, 30};
System.out.println(numbers[2]);  // Output: 30

// WRONG: Loop condition off-by-one
int[] arr = new int[4];
for (int i = 0; i <= arr.length; i++) {
    arr[i] = i;  // Fails when i = 4
}

// CORRECT: Use < not <=
int[] arr = new int[4];
for (int i = 0; i < arr.length; i++) {
    arr[i] = i;  // Safe: 0, 1, 2, 3
}
```

## How to Fix

1. **Loop Conditions**: Use `i < length` not `i <= length`
2. **Array Access**: Remember first index is 0, last is `length - 1`
3. **Check Bounds**: Verify `index >= 0 && index < length` before accessing
4. **Use Built-in Methods**: Use `.forEach()`, `.map()`, iterator patterns
5. **Be Careful with Negative Indices**: Some languages allow them (Python), others don't (Java)
6. **Validate Empty Arrays**: Check `length > 0` before accessing first element

## Prevention Tips

- **Always use `<` in loops**: `for (i = 0; i < length; i++)` is the standard pattern
- **Remember: first index is 0**: The last valid index is `length - 1`
- **Print array length during debug**: Know what length you're working with
- **Use IDE warnings**: Most IDEs warn about potential out-of-bounds access
- **Test with empty arrays**: Make sure code handles zero-length arrays
- **Use array utilities**: Many languages provide safe iteration methods
- **Bounds check after calculations**: If calculating an index, validate it's in range

## Real-World Example

```java
// Search function bug
public int findElement(int[] arr, int target) {
    // BUG: Loop condition uses <=
    for (int i = 0; i <= arr.length; i++) {
        if (arr[i] == target) {  // Crashes when i = arr.length!
            return i;
        }
    }
    return -1;
}

// FIXED: Use < instead of <=
public int findElement(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}
```

## Related Bugs

- **Off-by-One Error** (#001): Same root cause, different context
- **Null/None Reference** (#002): Similar to accessing uninitialized array
- **Uninitialized Variables** (#004): Array containing garbage values

## Key Takeaways

✅ Valid array indices: 0 to length-1  
✅ Use `<` not `<=` in loop conditions  
✅ Always check bounds before accessing  
✅ Test with empty arrays  
✅ Verify calculated indices are valid  
✅ Use language-provided safe iteration methods  
✅ Most common place to find this bug: loops
