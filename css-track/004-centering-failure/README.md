# Bug #004: Left-Leaning Card

### The Goal
The "Sign Up" card should be centered horizontally on the page.

### The Symptoms
The card spans the entire width of the page, or stays stuck to the left.

### Hints
1. `margin: 0 auto` only works if the element has a specific `width` smaller than its container.
2. If `width` is not set, it defaults to `100%` for `div` elements, leaving no margin to distribute.
3. Try setting `width: 300px;`.
