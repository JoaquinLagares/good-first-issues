# Bug #012: Simon Says - The Array Index Error

### The Goal
Create a memory game where you repeat an increasingly long sequence of colors.

### The Symptoms
The game ends immediately after your first input, claiming you were wrong even when correct.

### Hints
1. Look at the player comparison in the `playerClick` function.
2. The array index comparison is off by one.
3. `playerSequence[playerSequence.length]` is always undefined (one past the end).
4. Use `playerSequence[playerSequence.length - 1]` to get the last element.
