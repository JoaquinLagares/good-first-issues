# Bug #028: Stack Overflow and Recursion Errors

## What is it?

Stack overflow occurs when the call stack runs out of space, typically due to infinite recursion, excessively deep recursion, or allocation of huge objects on the stack. This causes crashes with no recovery possible.

## Why It Happens

1. **Infinite Recursion**: No base case or wrong base case
2. **Missing Base Case**: Recursion never terminates
3. **Too Deep Recursion**: Legitimate recursion exceeds stack limit
4. **Large Stack Allocations**: Huge local arrays on stack
5. **Mutual Recursion**: Functions calling each other infinitely
6. **Accidental Recursion**: Calling self instead of different function
7. **Memory Exhaustion**: Not just stack but heap issues

## Symptoms

- `StackOverflowError` (Java)
- Segmentation fault (C/C++)
- `RuntimeError: maximum recursion depth` (Python)
- Application crash
- Seems random (recursion depth varies)
- Crash during normal operation

## Examples in Multiple Languages

### Python
```python
# WRONG: Missing base case
def countdown(n):
    print(n)
    countdown(n - 1)  # No base case!

countdown(5)
# RuntimeError: maximum recursion depth exceeded

# CORRECT: Include base case
def countdown(n):
    if n <= 0:  # BASE CASE
        return
    print(n)
    countdown(n - 1)

countdown(5)

# WRONG: Accidental recursion (typo)
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)  # Correct

def broken_factorial(n):
    if n <= 1:
        return 1
    return n * broken_factorial(n)  # BUG: n never decreases!

# CORRECT: Check recursion terminates
def factorial(n):
    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# WRONG: Too deep recursion
def sum_list(lst):
    if len(lst) == 0:
        return 0
    return lst[0] + sum_list(lst[1:])  # Creates new list each time!

sum_list(list(range(5000)))  # Stack overflow!

# CORRECT: Use iteration or increase stack size
def sum_list(lst):
    total = 0
    for item in lst:
        total += item
    return total

# Or increase recursion limit (carefully)
import sys
sys.setrecursionlimit(10000)

# But still use iteration if possible
```

### Java
```java
// WRONG: Missing base case
public int factorial(int n) {
    return n * factorial(n - 1);  // No base case!
}

// StackOverflowError

// CORRECT: Include base case
public int factorial(int n) {
    if (n <= 1) return 1;  // BASE CASE
    return n * factorial(n - 1);
}

// WRONG: Accidental infinite recursion
public void processTree(Node node) {
    System.out.println(node.value);
    if (node.left != null) {
        processTree(node.left);
    }
    if (node.right != null) {
        processTree(node.right);
    }
    processTree(node);  // BUG: Recursing into self!
}

// CORRECT: Remove incorrect recursion
public void processTree(Node node) {
    System.out.println(node.value);
    if (node.left != null) {
        processTree(node.left);
    }
    if (node.right != null) {
        processTree(node.right);
    }
}

// WRONG: Mutual recursion without base case
public boolean isEven(int n) {
    if (n == 0) return true;
    return isOdd(n - 1);  // OK - has base case
}

public boolean isOdd(int n) {
    if (n == 0) return false;
    return isEven(n - 1);  // OK - has base case
}

// CORRECT if base cases exist

// WRONG: Large local arrays
public void processData() {
    int[] hugeArray = new int[1000000000];  // 4GB on stack!
    // ...
}

// CORRECT: Use heap or smaller array
public void processData() {
    int[] array = new int[1000];  // Reasonable size
    // ...
}
```

### C
```c
// WRONG: Missing base case
int fibonacci(int n) {
    return fibonacci(n-1) + fibonacci(n-2);  // No base case!
}

// Stack overflow

// CORRECT: Include base case
int fibonacci(int n) {
    if (n <= 1) return n;  // BASE CASE
    return fibonacci(n-1) + fibonacci(n-2);
}

// WRONG: Very deep recursion
int deepRecursion(int n) {
    if (n == 0) return 0;
    int arr[1000] = {0};  // 4KB per recursion level!
    return deepRecursion(n - 1);  // Stack grows with n
}

// CORRECT: Use iteration or tail recursion
int deepRecursion(int n) {
    // Iterative version
    int sum = 0;
    for (int i = 0; i < n; i++) {
        // ...
    }
    return sum;
}

// WRONG: Large buffer on stack
void readData() {
    char buffer[1000000];  // 1MB on stack!
    fread(buffer, 1, sizeof(buffer), stdin);
}

// CORRECT: Allocate on heap
void readData() {
    char* buffer = malloc(1000000);  // Heap
    if (buffer == NULL) {
        perror("malloc");
        return;
    }
    fread(buffer, 1, 1000000, stdin);
    free(buffer);
}
```

## How to Fix

1. **Include Base Case**: Recursion must terminate
2. **Validate Input**: Ensure recursion terminates
3. **Use Iteration**: When possible, iteration is safer
4. **Tail Call Optimization**: Some languages optimize tail recursion
5. **Increase Stack Size**: Only if you understand implications
6. **Check Recursion Depth**: Add counter to detect infinite recursion
7. **Use Heap**: For large allocations, not stack
8. **Trampoline Pattern**: For deep recursion in some languages

## Prevention Tips

- **Every recursive function needs base case**: Non-negotiable
- **Test with edge cases**: Zero, negative, very large inputs
- **Check recursion depth**: Add logging to see how deep it goes
- **Prefer iteration**: Safer and often faster
- **Profile recursion**: Measure stack usage
- **Enable warnings**: Compiler can warn about missing base cases
- **Code review**: Recursion bugs need careful review
- **Understand tail recursion**: Compiler might optimize

## Recursion Limits

| Language | Default Limit |
|----------|---------------|
| Python | ~1000 |
| Java | ~15,000 (varies) |
| C | System stack size (~8MB on Linux) |
| JavaScript | ~15,000 |

## Real-World Example

```python
# JSON parsing bug
def parse_json_tree(obj):
    # BUG: Missing base case for primitive types
    if isinstance(obj, dict):
        return {k: parse_json_tree(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [parse_json_tree(item) for item in obj]
    # Missing: else return obj directly!
    return parse_json_tree(obj)  # BUG: Infinite recursion!

# Call with primitive: parse_json_tree(5)
# Result: StackOverflowError

# FIXED: Include base case
def parse_json_tree(obj):
    if isinstance(obj, dict):
        return {k: parse_json_tree(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [parse_json_tree(item) for item in obj]
    else:
        return obj  # BASE CASE: Return primitive types

# Now works correctly
parse_json_tree(5)  # Returns: 5
```

## Tail Recursion Example

```python
# Not tail recursive (can't be optimized)
def sum_list(lst):
    if not lst:
        return 0
    return lst[0] + sum_list(lst[1:])  # Computation after recursive call

# Tail recursive (compiler might optimize)
def sum_list_tail(lst, acc=0):
    if not lst:
        return acc
    return sum_list_tail(lst[1:], acc + lst[0])  # No computation after call

# But Python doesn't optimize tail recursion, so still use iteration
```

## Related Bugs

- **Infinite Loop** (#007): Similar to infinite recursion
- **Uninitialized Variables** (#004): Recursion variable not set
- **Memory Leak** (#006): Heap allocated in recursion

## Key Takeaways

✅ Every recursive function MUST have a base case  
✅ Base case must be reachable  
✅ Prefer iteration over deep recursion  
✅ Validate recursion terminates before running  
✅ Allocate large data on heap, not stack  
✅ Understand your language's recursion limit  
✅ Test with edge cases: 0, 1, very large  
✅ Measure recursion depth to catch issues
