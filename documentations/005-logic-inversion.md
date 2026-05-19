# Bug #005: Logic Inversion

## What is it?

Logic inversion occurs when conditional statements are reversed - you write the opposite of what you intended. This causes correct inputs to fail and incorrect inputs to pass.

## Why It Happens

- Rushed coding and not double-checking logic
- Using `!=` instead of `==` or vice versa
- Forgetting to negate with `!`
- Confusion with De Morgan's Laws
- Copy-pasting and forgetting to flip the condition
- Confusing `>` with `<`

## Symptoms

- Opposite behavior than expected
- If condition: things that should pass fail, and vice versa
- Passwords accepted when they shouldn't be
- Errors accepted as valid input
- Permissions reversed (admin blocked, guest allowed)

## Examples

### JavaScript
```javascript
// WRONG: Only accepts WRONG passwords
if (password === "correct") {
    console.log("Access Denied!");  // Oops!
} else {
    console.log("Access Granted!");
}

// CORRECT: Proper logic
if (password === "correct") {
    console.log("Access Granted!");
} else {
    console.log("Access Denied!");
}

// WRONG: Inverted win condition
if (score < 100) {
    console.log("You won!");  // Should be >= not <
}

// CORRECT: Right comparison
if (score >= 100) {
    console.log("You won!");
}
```

### Python
```python
# WRONG: Only allows adults NOT to enter
age = 25
if age < 18:
    print("Welcome!")
else:
    print("Too young")

# CORRECT: Proper age check
if age >= 18:
    print("Welcome!")
else:
    print("Too young")

# WRONG: Inverted color check
valid_colors = ['red', 'blue', 'green']
color = 'red'
if color not in valid_colors:  # Oops, should be 'in'
    print("Valid color")
```

### C
```c
// WRONG: Returns true for bad input
int isValidAge(int age) {
    if (age < 0 || age > 120)  // Should be && not ||
        return 1;  // true
    return 0;  // false
}

// CORRECT: Proper validation
int isValidAge(int age) {
    if (age >= 0 && age <= 120)
        return 1;  // true
    return 0;  // false
}
```

## How to Fix

1. **Write the logic in plain English first** - "If password equals 'correct', grant access"
2. **Then translate to code** - avoids logic inversion
3. **Use meaningful variable names** - `isValid` vs `notValid` (use positive)
4. **Double-check with test cases** - test both true and false cases
5. **Use assert statements** - verify logic is correct
6. **Review conditionals** - extra review time prevents this common mistake

## Prevention Tips

- Always test both branches of if/else
- Use positive logic when possible (`isValid` not `notInvalid`)
- Comment complex conditions
- Break complex conditions into smaller parts
- Use De Morgan's Laws correctly: `!(A && B)` = `(!A || !B)`
- Read conditions out loud before submitting
- Use IDE code visualization for conditionals
- Have someone else review tricky logic
