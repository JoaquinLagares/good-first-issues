# Bug #003: The Const Constraint

### The Goal
Print the value of a counter using a const reference.

### The Symptoms
Compiler error: `error: passing 'const Counter' as 'this' argument discards qualifiers`.

### Hints
1. If a function doesn't modify the object, mark it as `const` (e.g., `void show() const`).
2. Const references can only call const member functions.
 flagship.
 flagship.
