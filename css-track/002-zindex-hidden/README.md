# Bug #002: The Ghost Modal

### The Goal
The gold modal should appear on TOP of the grey background.

### The Symptoms
Refreshing the page shows nothing but grey. The modal is there in the HTML, but invisible!

### Hints
1. Check the `z-index` of both `.background-content` and `.modal`.
2. A higher `z-index` number means "closer to the user".
