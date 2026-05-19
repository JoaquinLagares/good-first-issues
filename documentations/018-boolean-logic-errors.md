# Bug #018: Boolean Logic Errors

## What is it?

Boolean logic errors occur when conditional statements use incorrect logical operators or misunderstand De Morgan's Laws. These subtle bugs can cause code to execute when it shouldn't or skip when it should. Common issues include using `&&` instead of `||`, incorrect `!` placement, or confused logic in complex conditionals.

## Why It Happens

1. **Wrong Logical Operators**: Using `&&` when should use `||` or vice versa
2. **Operator Precedence**: Not understanding which operators evaluate first
3. **De Morgan's Law Confusion**: Incorrect negation of complex conditions
4. **Truthy/Falsy Confusion**: Misunderstanding what evaluates as true/false
5. **Comparison vs Assignment**: Using `=` instead of `==`
6. **Parentheses Misplacement**: Missing or misplaced parentheses change meaning

## Symptoms

- Code block executes when it shouldn't
- Code block doesn't execute when it should
- Conditional always true or always false
- Authentication/validation logic inverted
- Access control not working properly
- Unexpected program flow

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Using && instead of ||
if (age < 18 && status === "student") {
    // Executes only if BOTH conditions true
    grantDiscount();
}
// Intent was probably: either under 18 OR student status

// CORRECT: Use || for OR logic
if (age < 18 || status === "student") {
    grantDiscount();  // Executes if EITHER condition true
}

// WRONG: De Morgan's law mistake
if (!(age > 18 && employed)) {
    // Wrong: means NOT(over18 AND employed)
    // Should be: (age <= 18) OR NOT employed
}

// CORRECT: Apply De Morgan's law
if (age <= 18 || !employed) {
    // Now correctly inverted
}

// WRONG: Assignment instead of comparison
if (x = 5) {  // Assigns 5 to x instead of comparing!
    console.log("x is 5");
}

// CORRECT: Use == or === for comparison
if (x === 5) {
    console.log("x is 5");
}

// WRONG: Misunderstanding falsy values
if (items.length) {
    // Empty array has length 0 (falsy)
    processItems(items);
}

// CORRECT: Be explicit
if (items.length > 0) {
    processItems(items);
}
```

### Python
```python
# WRONG: AND instead of OR
if password_correct and username_exists:
    # Both must be true to grant access
    allow_login()
    # But probably meant: username exists AND password correct

# CORRECT: Think about logic
if username_exists and password_correct:
    allow_login()

# WRONG: Negation mistake
if not status == "admin":
    # This is same as: status != "admin"
    deny_access()

# CORRECT: Better readability
if status != "admin":
    deny_access()

# WRONG: De Morgan mistake
if not (x > 0 and y > 0):
    # Should be: (x <= 0) or (y <= 0)
    skip_processing()

# CORRECT: Apply De Morgan's law
if x <= 0 or y <= 0:
    skip_processing()

# WRONG: Chained comparison without thinking
if 0 < x < 10:
    # This is CORRECT in Python (chained comparison)
    # But be careful not to assume other languages work same way
    process(x)

# WRONG: Forgetting about truthiness
if value:  # What if value is 0, empty list, empty string?
    print("Has value")

# CORRECT: Be explicit
if value is not None and value != "":
    print("Has value")
```

### Java
```java
// WRONG: Operator precedence confusion
if (x > 5 && y > 5 || z < 0) {
    // Evaluated as: (x > 5 && y > 5) || (z < 0)
    // May not be what you intended!
}

// CORRECT: Use parentheses for clarity
if ((x > 5 && y > 5) || z < 0) {
    // Now clear what the logic is
}

// WRONG: Assignment in condition (in some languages allowed)
if (user = findUser(id)) {  // Assigns instead of compares!
    // In Java, this causes compilation error (good!)
}

// CORRECT: Use == for comparison
if (user == null) {
    throw new UserNotFoundException();
}

// WRONG: Double negation confusion
if (!(!isAdmin)) {
    // Same as: isAdmin
    grantAccess();  // But unclear!
}

// CORRECT: Simpler logic
if (isAdmin) {
    grantAccess();
}

// WRONG: Complex logic hard to understand
if ((age >= 18 && !employed) || (employed && salary > 50000)) {
    approveCredit();
}

// CORRECT: Extract to method for clarity
private boolean canApproveCredit(Person person) {
    boolean isAdult = person.age >= 18;
    boolean unemployedAndAdult = isAdult && !person.employed;
    boolean highEarner = person.employed && person.salary > 50000;
    return unemployedAndAdult || highEarner;
}
```

## How to Fix

1. **Understand Logical Operators**: `&&` (AND), `||` (OR), `!` (NOT)
2. **Use De Morgan's Laws**: `!(A && B)` = `!A || !B`
3. **Apply Parentheses**: Make logic explicit with parentheses
4. **Simplify Complex Logic**: Break into smaller, clearer conditions
5. **Test Edge Cases**: Empty, zero, negative, null values
6. **Use Clear Variable Names**: `isAdmin`, `hasPermission`, not `x`, `y`
7. **Extract to Methods**: Complex conditions belong in methods with clear names

## Prevention Tips

- **Think through logic carefully**: Draw truth tables if confused
- **Test both branches**: Ensure true and false conditions work
- **Use meaningful variable names**: Not single letters
- **Prefer if-else for readability**: Over complex one-liners
- **Extract complex conditions**: Into method with clear name
- **Use linters**: Can catch some boolean logic errors
- **Review De Morgan's laws**: Common source of mistakes
- **Print condition values**: Debug to see what's actually being evaluated

## De Morgan's Laws Reference

```
NOT (A AND B) = (NOT A) OR (NOT B)
NOT (A OR B) = (NOT A) AND (NOT B)

!(x > 0 && y > 0)  = (x <= 0 || y <= 0)
!(isAdmin || isMod)  = (!isAdmin && !isMod)
```

## Real-World Example

```javascript
// Payment authorization bug
function authorizePayment(payment, user) {
    // BUG: Logic checks if user is NOT admin (backwards!)
    if (payment.amount < 10000 || !user.isAdmin) {
        // Should only proceed if amount is small OR user IS admin
        processPayment(payment);
    }
}

// This allows:
// - Small payments from anyone (correct)
// - ANY payment from non-admin users (WRONG!)
// - Large payments from admins (correct)

// FIXED: Use correct logic
function authorizePayment(payment, user) {
    boolean smallAmount = payment.amount < 10000;
    boolean isAdmin = user.isAdmin;
    
    if (smallAmount || isAdmin) {
        processPayment(payment);
    }
    // Now correctly: small payments from anyone OR any payment from admin
}

// Or even clearer:
function authorizePayment(payment, user) {
    if (canAuthorizePayment(payment, user)) {
        processPayment(payment);
    }
}

function canAuthorizePayment(payment, user) {
    boolean smallAmount = payment.amount < 10000;
    boolean hasAdminRole = user.isAdmin;
    return smallAmount || hasAdminRole;
}
```

## Related Bugs

- **Logic Inversion** (#005): Different manifestation of logic errors
- **Comparison Operators** (#023): Wrong operator chosen
- **Type Mismatch** (#003): Comparing incompatible types

## Key Takeaways

✅ Understand AND (&&), OR (||), NOT (!)  
✅ Remember De Morgan's Laws for negation  
✅ Use parentheses to make logic explicit  
✅ Extract complex conditions to methods  
✅ Use clear variable names for conditions  
✅ Test both true and false branches  
✅ Be careful with operator precedence  
✅ Complexity is a code smell - simplify
