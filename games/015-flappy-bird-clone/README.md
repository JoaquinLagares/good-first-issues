# Bug #015: Flappy Bird - The Inverted Collision

### The Goal
Create a Flappy Bird game where you die when hitting pipes.

### The Symptoms
The bird only dies if it stays inside the gap. Passing through pipes kills you!

### Hints
1. Look at the collision detection logic.
2. The condition for `bird.y < pipe.gapY` only triggers the game over.
3. The logic is backwards - you should die if hitting the pipe, not passing through it.
4. Check the condition logic for when the bird collides with the pipe (not the gap).
