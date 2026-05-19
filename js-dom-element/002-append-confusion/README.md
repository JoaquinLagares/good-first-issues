# DOM Bug #002: The Bread Failure

### The Goal
Add "Bread" to the shopping list when the button is clicked.

### The Symptoms
The button doesn't do anything, and if you open the console, you see: `TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.`

### Hints
1. `appendChild()` needs a real DOM element (created with `document.createElement()`).
2. If you want to use a string, look into `insertAdjacentHTML()` or `innerHTML`.
