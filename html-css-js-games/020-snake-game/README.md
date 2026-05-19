# Bug #020: Snake Game - The Faulty Collision Detection

### The Goal
Create a Snake game where you die if you hit your own body.

### The Symptoms
The snake dies immediately even when it hasn't touched itself, or the collision detection seems completely broken.

### Hints
1. Look at the self collision detection in the `update` function.
2. The condition uses `!==` (not equal) for both x AND y coordinates.
3. Should use `===` (equal) for both coordinates, or check with `&&` (AND) not `||`.
4. Current logic: dies if x is different OR y is different - almost always true!
5. Should be: dies if BOTH x AND y are the same as a segment.
