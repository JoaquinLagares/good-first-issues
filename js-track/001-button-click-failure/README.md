# Bug #001: The Button that Does Nothing

### The Goal
When you click "Click Me!", a message should appear below the button.

### The Symptoms
Clicking the button does absoluteley nothing. No errors (or maybe one in the console?) and no message.

### Hints
1. Open the Browser Console (F12 -> Console).
2. Look at how the button is selected in `app.js`.
3. Check the `id` in `index.html` and compare it to `getElementById`.
4. Are you trying to listen to an element that doesn't exist?
