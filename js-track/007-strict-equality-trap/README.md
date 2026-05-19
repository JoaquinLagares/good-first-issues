# Bug #007: The Strict Truth

### The Goal
The user should win when they enter the correct number (7).

### The Symptoms
Even if you type "7", the message says "Wrong! Try again."

### Hints
1. Input values from HTML are always strings.
2. The `===` operator checks for both **Value** and **Type**.
3. "7" (string) is NOT strictly equal to 7 (number).
4. Try using `Number()` or `parseInt()` on the input, or use `==` (though `===` with conversion is better practice).
 flagship.
