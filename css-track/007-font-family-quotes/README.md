# Bug #007: The Font Name Fail

### The Goal
The title should display in "Times New Roman".

### The Symptoms
The font doesn't change from the browser's default because the CSS rule is invalid.

### Hints
1. If a font name has spaces in it (like "Times New Roman"), the browser gets confused.
2. Wrap the font name in quotes (e.g., `'Times New Roman'`).
3. Always include a generic fallback like `serif`.
