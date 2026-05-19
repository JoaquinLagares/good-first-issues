# Bug #010: The Broken Promise

### The Goal
Display a welcome message after 1 second.

### The Symptoms
The page waits for 1 second, but then nothing happens. If you check the console, you see: `ReferenceError: name is not defined`.

### Hints
1. Look at the variable name defined at the top of the function.
2. Look at the variable name used inside `setTimeout`.
3. Do they match?
 flagship.
