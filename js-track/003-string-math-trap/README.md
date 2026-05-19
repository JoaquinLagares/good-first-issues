# Bug #003: 1 + 1 = 11?

### The Goal
The calculator should add the numbers together correctly.

### The Symptoms
If you add 10 and 20, the result displays as "1020" instead of "30".

### Hints
1. In JavaScript, the `+` operator works for both numbers (addition) and strings (joining).
2. Input values are ALWAYS strings, even if `type="number"`.
3. Look up how to use `parseInt()` or `Number()` to convert strings to numbers.
