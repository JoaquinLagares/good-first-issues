# Bug #003: The Header That Scrolled Away

### The Goal
The black header should stay "stuck" to the top of the browser window as you scroll down the page.

### The Symptoms
The header scrolls off the screen just like normal content.

### Hints
1. Check the `.navbar` class in `style.css`.
2. `position: sticky` doesn't work by itself; it needs a coordinate to know where to stick.
3. Try adding `top: 0;`.
