# Bug #002: The Vanishing Welcome

### The Goal
When you submit the form, a welcome message should appear.

### The Symptoms
The message flashes for a split second, then the page reloads and everything disappears!

### Hints
1. Forms in HTML naturally want to "submit" to a server, which reloads the page.
2. In JavaScript, you can stop this using a method on the event object `e`.
3. Try adding `e.preventDefault();` at the beginning of your function.
