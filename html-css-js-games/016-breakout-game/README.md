# Bug #016: Breakout - The Immortal Bricks

### The Goal
Create a breakout game where bricks disappear when the ball hits them.

### The Symptoms
Bricks never disappear no matter how many times you hit them. They stay on screen forever and you can't clear a level.

### Hints
1. Look at the brick collision detection.
2. The line that should deactivate the brick is commented out.
3. Uncomment `brick.active = false;` so bricks disappear after being hit.
