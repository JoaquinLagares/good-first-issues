# DOM Bug #003: The Broken Toggle

### The Goal
Switch the box between green (active) and white (inactive).

### The Symptoms
The console says `box.classList is not a function`.

### Hints
1. `classList` is an object, not a function you call directly.
2. To check if a class exists, use `classList.contains()`.
