# DOM Bug #010: The Soulless Clone

### The Goal
When you clone the button, the new button should also show an alert when clicked.

### The Symptoms
The original button works perfectly, but the cloned buttons do absolutely nothing when clicked.

### Hints
1. Standard `cloneNode()` does not copy event listeners.
2. You have two options: use Event Delegation (attach listener to a parent) or re-attach the listener to the clone.
3. Event delegation is usually the "pro" way to solve this!
 flagship.
