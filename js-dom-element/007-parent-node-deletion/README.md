# DOM Bug #007: The Over-Eager Eraser

### The Goal
Delete only the button when it's clicked.

### The Symptoms
The entire blue/grey wrapper and the text inside it vanish!

### Hints
1. `this` refers to the button.
2. `parentNode` refers to the container (`#wrapper`).
3. Call `remove()` directly on `this` instead of `this.parentNode`.
