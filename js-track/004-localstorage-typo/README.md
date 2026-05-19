# Bug #004: The Forgetful Theme

### The Goal
The page should remember that the user selected "Dark Mode" even after they refresh the browser.

### The Symptoms
You click the button, the theme changes. But when you refresh, it goes back to white!

### Hints
1. Look at the `localStorage` calls in `app.js`.
2. Compare the string key in `getItem()` and `setItem()`. 
3. One uses a hyphen `-`, the other uses an underscore `_`. They must match exactly!
 flagship: `user-theme` vs `user_theme`.
