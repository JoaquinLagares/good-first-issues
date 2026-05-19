# Bug #010: Password Strength Checker - The Misclassified Strength

### The Goal
Create a password strength checker that correctly classifies passwords as Weak, Medium, or Strong based on 5 criteria.

### The Symptoms
Passwords are being misclassified. A password with 4 valid criteria is still marked as "Weak" instead of "Strong".

### Hints
1. Look at the strength classification thresholds in the `if/else if` statements.
2. The thresholds for weak, medium, and strong are incorrect.
3. Consider: 1-2 criteria = Weak, 3-4 = Medium, 5 = Strong (or adjust the logic).
4. The current logic has an off-by-one error in the threshold checks.
