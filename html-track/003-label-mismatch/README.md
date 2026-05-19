# Bug #004: Clicking logic broken

### The Goal
When a user clicks on the text "Email address:", the input box should become focused (active).

### The Symptoms
Clicking the label does nothing. This is bad for accessibility and user experience!

### Hints
1. Check the `for` attribute on the `<label>`.
2. Check the `id` attribute on the `<input>`.
3. Do they match?
