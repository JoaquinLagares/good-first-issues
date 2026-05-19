# Bug #004: The Missing Decimal

### The Goal
Divide 5 by 2 and get 2.5.

### The Symptoms
The output is "5 / 2 = 2.0".

### Hints
1. In C, dividing an `int` by an `int` always returns an `int`.
2. To get a decimal, at least one number in the division must be a `float` or `double`.
3. Try type casting: `(float)a / b`.
