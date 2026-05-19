# Bug #003: Type Mismatch

## What is it?

A type mismatch error occurs when you try to use a value of one type where a different type is expected. This includes operations between incompatible types.

## Why It Happens

- Forgetting to convert between types
- Mixing strings and numbers in operations
- Using wrong variable type for the task
- Implicit type conversions not working as expected
- Function expecting specific type but receiving another

## Symptoms

- Compiler/interpreter errors: `TypeError`, `type mismatch`
- Unexpected results from operations
- String concatenation instead of addition: `"5" + 3 = "53"` instead of `8`
- Operations that silently fail or produce wrong results

## Examples

### JavaScript
```javascript
// WRONG: String and number addition
let result = "5" + 3;  // Result: "53" (concatenation, not addition!)

// CORRECT: Convert to same type
let result = parseInt("5") + 3;  // Result: 8
let result = Number("5") + 3;    // Result: 8

// WRONG: Mixing types in comparison
if ("5" == 5) { }  // This is true! (loose equality)

// CORRECT: Use strict equality
if ("5" === 5) { }  // This is false
```

### Python
```python
# WRONG: Can't concatenate string and int
greeting = "Hello " + 5  # TypeError!

# CORRECT: Convert to string
greeting = "Hello " + str(5)  # "Hello 5"

# WRONG: Division with integers
result = 5 / 2  # Result: 2.5 (actually works in Python 3)

# CORRECT: In Python 2, use float
result = float(5) / 2  # Result: 2.5
```

### C
```c
// WRONG: Implicit conversion might truncate
float price = 9.99;
int total = price * 3;  // Result: 29 (lost decimal)

// CORRECT: Be explicit with conversion
float total = price * 3;  // Result: 29.97

// WRONG: Char vs int confusion
char code = 65;
printf("%c", code);  // Prints: A (not 65)

// CORRECT: Be clear about intent
char code = 'A';
printf("%c", code);  // Prints: A
```

## How to Fix

1. **Know your types** - understand what type each variable holds
2. **Convert explicitly** - don't rely on implicit conversions
3. **Use type annotations** - many languages have optional type hints
4. **Test type operations** - especially with user input
5. **Read error messages carefully** - they usually tell you exactly what's wrong

## Prevention Tips

- Use a language with strong static typing if possible
- Enable strict mode or type checking in your IDE
- Never assume automatic type conversion will work as expected
- Always convert user input to the correct type
- Use `parseInt()`, `parseFloat()`, `Number()`, `str()`, etc.
- Test operations with different types as edge cases
- Document expected types in function comments
