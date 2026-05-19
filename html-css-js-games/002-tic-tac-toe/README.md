# Bug #002: Tic Tac Toe - The Wrong Winner

### The Goal
Create a working Tic Tac Toe game where the correct player is announced as the winner.

### The Symptoms
When someone wins, the opposite player is announced as the winner. If X wins, it says "O Wins!" instead.

### Hints
1. Check the win announcement logic in the `handleCellClick` function.
2. The ternary operator that determines the winner announcement is backwards.
3. When `currentPlayer === 'X'` and they win, announce X, not O.
