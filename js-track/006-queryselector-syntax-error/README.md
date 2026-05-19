# Bug #006: The Vanishing Selector

### The Goal
Updating the status message when the button is clicked.

### The Symptoms
Clicking the button does nothing. If you look at the console, you'll see "Could not find the element!".

### Hints
1. `document.querySelector` uses the same syntax as CSS.
2. If you are looking for a class named `status-box`, you need to use `.status-box`.
3. Without the dot, JavaScript thinks you are looking for an HTML tag like `<status-box>`, which doesn't exist.
 flagship.
