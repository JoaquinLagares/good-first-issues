# Bug #017: Whack-a-Mole - The Permanent Mole

### The Goal
Whack moles as they appear in different holes.

### The Symptoms
After you whack a mole, it stays visible as an emoji instead of returning to the hole emoji. Multiple moles appear at once.

### Hints
1. Look at the `spawnMole` function.
2. When removing the old mole, the text should be reset to '🕳️'.
3. The line that resets the mole display is commented out.
4. Uncomment `currentMole.textContent = '🕳️';` to fix it.
