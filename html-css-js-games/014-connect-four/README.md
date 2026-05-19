# Bug #014: Connect Four - The Wrong Winner

### The Goal
Announce the correct player when they win with four in a row.

### The Symptoms
When someone wins, the opposite player is announced as the winner.

### Hints
1. Look at the win announcement in the `makeMove` function.
2. The ternary operator swaps the player names.
3. If `currentPlayer === 'red'` and they win, announce Red, not Yellow.
