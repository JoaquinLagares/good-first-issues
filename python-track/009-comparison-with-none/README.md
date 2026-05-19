# Bug #009: The Identity Mix-Up

### The Goal
Check if a value is None.

### The Symptoms
The code works but is not idiomatic Python. In some edge cases, custom objects with overridden `__eq__` could cause issues.

### Hints
1. Always use `is` or `is not` to compare with `None`.
2. Use `if value is None:` instead of `if value == None:`.
3. This is a best practice in Python (PEP 8).
 flagship.
 flagship.
 flagship.
