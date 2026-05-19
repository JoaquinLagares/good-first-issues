# Bug #004: Uninitialized Variables

## What is it?

Using a variable before assigning it a value. The variable contains garbage data (whatever was previously at that memory location) leading to unpredictable behavior.

## Why It Happens

- Forgetting to assign an initial value
- Assuming a variable starts at 0 or null
- Scope confusion - variable defined in wrong place
- Conditional initialization that might be skipped
- Copy-paste error left initialization out

## Symptoms

- Program prints random/garbage values
- Behavior changes between runs
- Logic errors: conditions evaluate unexpectedly
- Crashes due to invalid pointer values (C/C++)
- Values appear to change without being modified

## Examples

### C
```c
// WRONG: counter contains garbage data
int counter;
for (int i = 0; i < 5; i++) {
    counter++;  // Could start at -12345 or any random value!
}
printf("Final: %d\n", counter);  // Unpredictable output

// CORRECT: Initialize to 0
int counter = 0;
for (int i = 0; i < 5; i++) {
    counter++;
}
printf("Final: %d\n", counter);  // Output: 5
```

### Python
```python
# WRONG: sum not defined before the loop
for i in range(1, 6):
    total += i  # NameError: name 'total' is not defined

# CORRECT: Initialize before use
total = 0
for i in range(1, 6):
    total += i
print(total)  # Output: 15
```

### JavaScript
```javascript
// WRONG: x is undefined
console.log(x);  // undefined
if (x > 5) { }   // No error, but always false

// CORRECT: Initialize x
let x = 0;
console.log(x);  // 0
if (x > 5) { }   // Properly evaluates

// WRONG: Array contains undefined elements
let arr = new Array(5);
console.log(arr[0]);  // undefined

// CORRECT: Initialize with values
let arr = [0, 0, 0, 0, 0];
console.log(arr[0]);  // 0
```

## How to Fix

1. **Always initialize** variables when you declare them
2. **Use default values** based on context (0, false, "", null, etc.)
3. **Initialize at declaration** rather than later
4. **Use IDE warnings** - most IDEs warn about uninitialized variables
5. **Enable compiler warnings** - use `-Wall` in GCC
6. **Static analysis tools** can catch these before runtime

## Prevention Tips

- Make initialization a habit: `int x = 0;` not `int x;`
- Use language features for safe initialization
- Initialize in constructors
- Declare variables as close to use as possible
- Use const/final for immutable values
- Enable all compiler warnings
- Test edge cases with variables at their limits
- Comment why you chose a particular initial value
