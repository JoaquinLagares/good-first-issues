# Bug #011: Hangman - The Inverted Penalty

### The Goal
Create a hangman game where guessing wrong letters decreases remaining guesses.

### The Symptoms
Your remaining guesses go negative or don't decrease properly. Correct guesses actually decrease remaining guesses!

### Hints
1. Look at the logic in `guessLetter` function.
2. The condition and the wrong increment/decrement are backwards.
3. If the letter is NOT in the word, you should increment wrong guesses.
4. If the letter IS in the word, don't increment wrong (or keep track correctly).
