# Bug #013: Quiz Game - The Inverted Answers

### The Goal
Create a quiz game where correct answers increase the score.

### The Symptoms
When you select the correct answer, it says "Wrong!" and vice versa. Your score increases for wrong answers!

### Hints
1. Look at the comparison operator in the `selectOption` function.
2. The condition uses `!==` (not equal) instead of `===` (equal).
3. When `selectedAnswer !== q.correct` means the answer is WRONG, not right.
4. Flip the logic to fix the bug.
