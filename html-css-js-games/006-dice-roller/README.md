# Bug #006: Dice Roller - The Zero Dice

### The Goal
Create a dice roller that displays results between 1 and 6 for each die.

### The Symptoms
The dice show values from 0 to 5 instead of 1 to 6. You can get 0 as a result, which isn't valid for dice.

### Hints
1. Look at the `Math.floor(Math.random() * 6)` calculation.
2. This generates numbers from 0 to 5, not 1 to 6.
3. You need to add 1 to the result: `Math.floor(Math.random() * 6) + 1`.
