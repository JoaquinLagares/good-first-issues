# DOM Bug #008: The Collection Crisis

### The Goal
Highlight both paragraphs in yellow when the button is clicked.

### The Symptoms
The console says `Cannot set properties of undefined (setting 'backgroundColor')`.

### Hints
1. `getElementsByClassName` returns an `HTMLCollection` (like a list).
2. You must loop through the collection (using `for` or convert to array) to change each individual element.
3. Alternatively, use `querySelectorAll` and `.forEach()`.
