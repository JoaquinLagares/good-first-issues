# Bug #007: Infinite Loop

## What is it?

An infinite loop is a loop that never terminates. The loop condition is always true, or the termination condition is never reached, causing the program to hang indefinitely.

## Why It Happens

- Loop condition never becomes false
- Increment/decrement is missing or wrong
- Update variable is inside wrong scope
- Condition logic is incorrect
- Variable being checked is never modified
- Using wrong comparison operator

## Symptoms

- Program hangs and becomes unresponsive
- 100% CPU usage
- Cannot break out (except with Ctrl+C)
- Application freezes
- Browser tab becomes unresponsive
- System becomes sluggish

## Examples

### JavaScript
```javascript
// WRONG: i never changes
let i = 0;
while (i < 10) {
    console.log(i);
    // Forgot i++  - infinite loop!
}

// CORRECT: Increment i
let i = 0;
while (i < 10) {
    console.log(i);
    i++;
}

// WRONG: Condition always true
while (true) {
    console.log("Loop forever!");
    // No break statement!
}

// CORRECT: Add break or condition
let count = 0;
while (true) {
    console.log("Loop");
    count++;
    if (count >= 5) break;
}
```

### Python
```python
# WRONG: x is never modified
x = 0
while x < 10:
    print(x)
    # Forgot x += 1  - infinite loop!

# CORRECT: Modify x
x = 0
while x < 10:
    print(x)
    x += 1

# WRONG: Condition always true
while True:
    print("Infinite!")
    # No break or return

# CORRECT: Add break condition
count = 0
while True:
    print("Loop")
    count += 1
    if count >= 5:
        break
```

### C
```c
// WRONG: i never increments
for (int i = 0; i < 10; ) {  // Empty increment!
    printf("%d\n", i);
}

// CORRECT: Add increment
for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
}

// WRONG: Condition always true
for (;;) {
    printf("Forever!");
    // No break!
}

// CORRECT: Add break or real condition
for (int i = 0; i < 5; i++) {
    if (someError) break;
    printf("%d\n", i);
}
```

## How to Fix

1. **Always check that loop variable is modified** inside the loop
2. **Verify the termination condition** will eventually be true
3. **Use debugger** to step through and see what's happening
4. **Add timeout** to catch infinite loops in production
5. **Print debug info** before the loop to verify initial state
6. **Check variable scope** - modifying right variable?
7. **Review operators** - `<` vs `<=` vs `>` vs `>=`

## Prevention Tips

- Always ask: "How does this loop terminate?"
- Check loop variables are modified in each iteration
- Use for loops when you know iteration count
- Use while loops for complex termination conditions
- Add comments explaining loop termination
- Never modify loop variable inside nested loop (usually)
- Test with known iteration counts first
- Use IDE code formatter - it reveals missing increments
- Add assertions to catch unexpected states
- Use timeout mechanisms in production code
- Monitor CPU usage when testing loops
