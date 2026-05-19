# Bug #015: Variable Scope Issues

## What is it?

Variable scope issues occur when variables are accessed outside their defined scope, or when developers misunderstand where a variable is accessible. This includes accessing variables before declaration, accessing outer scope when inner scope shadows them, or trying to use block-scoped variables globally.

## Why It Happens

1. **Hoisting (JavaScript)**: Variables declared with `var` are hoisted, creating confusing behavior
2. **Block Scope vs Function Scope**: Mixing `let`/`const` (block) with `var` (function)
3. **Global Pollution**: Accidentally creating global variables instead of local ones
4. **Variable Shadowing**: Inner scope variable hides outer scope variable with same name
5. **Closure Misunderstanding**: Not understanding what a closure captures
6. **Loop Variable Scope**: Loop variables leaking into outer scope

## Symptoms

- `ReferenceError: variable is not defined`
- Variable has unexpected value
- Variable exists globally when should be local
- Closure captures wrong variable
- Inner loop variables affect outer scope
- `undefined` or `null` when variable should have value

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: var hoisting creates confusing behavior
console.log(x);  // undefined (not ReferenceError!)
var x = 5;
console.log(x);  // 5

// Equivalent to:
var x;
console.log(x);  // undefined
x = 5;
console.log(x);  // 5

// CORRECT: Use let or const (block-scoped)
console.log(y);  // ReferenceError (good!)
let y = 5;
console.log(y);  // 5

// WRONG: Variable shadowing in closure
let count = 0;
function makeCounter() {
    let count = 0;  // Shadows outer count!
    return function() {
        return ++count;
    };
}
let counter = makeCounter();
console.log(counter());  // 1
console.log(count);      // 0 (outer count unchanged!)

// CORRECT: Don't shadow outer variable
let count = 0;
function makeCounter() {
    return function() {
        return ++count;  // Uses outer count
    };
}
let counter = makeCounter();
console.log(counter());  // 1
console.log(count);      // 1 (outer count updated!)

// WRONG: Creating global by accident
function initialize() {
    result = 42;  // No var/let/const = global!
}
initialize();
console.log(window.result);  // 42 (pollutes global scope)

// CORRECT: Declare with let/const/var
function initialize() {
    let result = 42;  // Local only
}
initialize();
console.log(result);  // ReferenceError
```

### Python
```python
# WRONG: Accessing variable before assignment in function
def show_value():
    print(x)  # UnboundLocalError!
    x = 10

# Python sees 'x = 10' below, so treats x as local
# But we access it before assignment

# CORRECT: Assign before using
def show_value():
    x = 10
    print(x)  # 10

# WRONG: Modifying outer scope variable without 'nonlocal'
x = 5
def modify():
    x = 10  # Creates local x, doesn't modify outer!
    print(x)  # 10

modify()
print(x)  # 5 (outer x unchanged)

# CORRECT: Use 'nonlocal' keyword
x = 5
def modify():
    nonlocal x
    x = 10  # Modifies outer x
    print(x)  # 10

modify()
print(x)  # 10 (outer x changed)

# WRONG: Loop variable leaks in Python 2
for i in range(5):
    pass
print(i)  # 4 (i still exists!)

# In Python 3, this is same but less concerning
# Best: don't rely on loop variable persisting
```

### Java
```java
// WRONG: Accessing variable outside its block
for (int i = 0; i < 5; i++) {
    // ...
}
System.out.println(i);  // Compilation error!

// CORRECT: Declare outside loop if needed later
int i;
for (i = 0; i < 5; i++) {
    // ...
}
System.out.println(i);  // 5

// WRONG: Variable shadowing in nested scopes
int value = 10;
{
    int value = 20;  // Shadows outer value
    System.out.println(value);  // 20
}
System.out.println(value);  // 10

// CORRECT: Avoid shadowing, use different names
int value = 10;
{
    int innerValue = 20;  // Clear that it's different
    System.out.println(innerValue);  // 20
}
System.out.println(value);  // 10
```

### C
```c
// WRONG: Global variable conflicts
int counter = 0;  // Global
void increment() {
    int counter = 0;  // Local shadows global!
    counter++;
    printf("%d\n", counter);  // 1
    printf("%d\n", ::counter);  // C doesn't have ::, but would be 0
}

// CORRECT: Use different names or be explicit
static int globalCounter = 0;  // Clearly global
void increment() {
    globalCounter++;
}

// WRONG: Returning pointer to local variable
int* getPointer() {
    int x = 42;
    return &x;  // DANGER! x destroyed after function ends
}

// CORRECT: Return value or allocate on heap
int getValue() {
    int x = 42;
    return x;  // Returns value
}

int* allocate() {
    int* ptr = malloc(sizeof(int));
    *ptr = 42;
    return ptr;  // Memory persists (must be freed!)
}
```

## How to Fix

1. **Use Proper Variable Declarations**: Use `let`/`const` in JavaScript, not `var`
2. **Understand Your Language's Scoping**: Block vs function scope
3. **Avoid Shadowing**: Don't reuse same variable name in nested scopes
4. **Declare Before Using**: Ensure variable exists before accessing
5. **Use Nonlocal/Global Keywords**: When intentionally modifying outer scope
6. **Keep Scope Minimal**: Declare variables where they're used
7. **Understand Closures**: Know what variables are captured

## Prevention Tips

- **Enable strict mode**: `"use strict";` in JavaScript catches more errors
- **Use linters**: ESLint, pylint catch scope issues
- **Use TypeScript**: Catches many scope-related type errors
- **Declare close to use**: Minimize scope of variables
- **Use meaningful names**: Avoid shadowing by using clear names
- **Print variable values**: Debug scope issues with logging
- **Understand hoisting**: Know how your language hoists variables

## Real-World Example

```javascript
// Cart total calculation bug
function calculateTotal(items) {
    total = 0;  // BUG: No let/const, creates global!
    
    for (var i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    
    return total;
}

let cart1 = [{price: 10}, {price: 20}];
let cart2 = [{price: 5}];

console.log(calculateTotal(cart1));  // 30
console.log(calculateTotal(cart2));  // 5 + 30 = 35 (BUG!)

// FIXED: Declare total as local variable
function calculateTotal(items) {
    let total = 0;  // Local variable
    
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    
    return total;
}

console.log(calculateTotal(cart1));  // 30
console.log(calculateTotal(cart2));  // 5 (correct!)
```

## Related Bugs

- **Uninitialized Variables** (#004): Variable exists but not initialized
- **Race Condition** (#009): Multiple scopes accessing same variable
- **Null/None Reference** (#002): Variable scope results in undefined

## Key Takeaways

✅ Use `let`/`const` instead of `var` in JavaScript  
✅ Understand your language's scope rules (block vs function)  
✅ Declare variables close to where they're used  
✅ Avoid shadowing variables with same names  
✅ Know how closures capture variables  
✅ Use strict mode and linters  
✅ Never return pointers to local variables (C/C++)
