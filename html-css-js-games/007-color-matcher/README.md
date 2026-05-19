# Bug #007: Color Matcher - The Inverted Logic

### The Goal
Create a game where you click on the color that matches the target color to earn points.

### The Symptoms
When you click the correct color, it says "Wrong!" and vice versa. Your score increases for incorrect selections.

### Hints
1. Look at the `checkColor` function.
2. The condition logic is inverted with `!==` instead of `===`.
3. When the selected color matches the target, it should say "Correct!" not "Wrong!".
