# Bug #009: Simple Timer - The Countdown Gone Wrong

### The Goal
Create a timer that counts down from a specified number of seconds.

### The Symptoms
The timer counts up instead of counting down. It increases from 0 instead of decreasing to 0.

### Hints
1. Look at the interval function that updates the timer.
2. The line `totalSeconds++;` is incrementing instead of decrementing.
3. Change it to `totalSeconds--;` to count down properly.
4. Also, the condition `if (totalSeconds <= 0)` will never be reached if counting up.
