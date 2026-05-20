# Bug #018: Pong - The One-Way Paddle

### The Goal
Create a Pong game where both paddles can hit and bounce the ball.

### The Symptoms
The ball bounces off paddles inconsistently. Sometimes it passes through, sometimes it bounces the wrong way.

### Hints
1. Look at the paddle collision detection.
2. Both paddles use `if (ball.speedX > 0)` but this is wrong for player2.
3. For player1 (left side), should bounce when `ball.speedX < 0` (coming toward them).
4. For player2 (right side), should bounce when `ball.speedX > 0` (coming toward them).
