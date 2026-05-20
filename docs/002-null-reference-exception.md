# Bug #002: Null/None Reference Exception

## What is it?

A null reference exception (NullPointerException, AttributeError, etc.) occurs when you try to access a property or method on a variable that is `null`, `None`, or `undefined`.

## Why It Happens

- Variable initialization is skipped
- Function returns `null` unexpectedly
- Forgot to check if a value exists before using it
- Object or array doesn't have the expected property
- Conditional logic returns early without initialization

## Symptoms

- Crash with errors like: `TypeError: Cannot read property 'x' of undefined`
- `AttributeError: 'NoneType' object has no attribute 'x'`
- `NullPointerException` in Java/C#
- Application terminates abruptly
- Undefined behavior in C/C++

## Examples

### JavaScript
```javascript
// WRONG: user might be null
let userName = user.name;

// CORRECT: Check first
let userName = user ? user.name : "Guest";

// CORRECT: Use optional chaining
let userName = user?.name ?? "Guest";
```

### Python
```python
# WRONG: result might be None
result = find_user()
print(result.email)

# CORRECT: Check first
result = find_user()
if result is not None:
    print(result.email)
else:
    print("User not found")
```

### Java
```java
// WRONG: obj might be null
int length = obj.toString().length();

// CORRECT: Check for null
if (obj != null) {
    int length = obj.toString().length();
}

// CORRECT: Use Objects.requireNonNull
Objects.requireNonNull(obj);
int length = obj.toString().length();
```

## How to Fix

1. **Always initialize variables** before use
2. **Check for null before accessing** properties or methods
3. **Use defensive programming** - assume values might be null
4. **Return meaningful values** instead of null when possible
5. **Use optional types** if your language supports them
6. **Add assertions** to catch issues early during development

## Prevention Tips

- Use type systems and null safety features when available
- Make it a habit to always check inputs
- Use IDE warnings for potential null dereferences
- Write tests that include null cases
- Document which functions can return null
- Consider using `Optional` types (Java, JavaScript)
