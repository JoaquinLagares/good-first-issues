# Bug #014: Floating Point Precision Errors

## What is it?

Floating point precision errors occur when comparing or performing arithmetic with decimal numbers. Due to how computers store floating point numbers in binary, unexpected rounding errors and comparison failures occur. For example, 0.1 + 0.2 doesn't exactly equal 0.3.

## Why It Happens

1. **Binary Representation**: Decimal numbers can't be exactly represented in binary (0.1, 0.2, 0.3)
2. **Exact Equality Comparison**: Using `==` to compare floats instead of checking range
3. **Accumulated Rounding**: Small errors compound through many calculations
4. **Integer Division**: Integer arithmetic producing unexpected results
5. **Type Conversion**: Converting between float and integer loses precision

## Symptoms

- `0.1 + 0.2` doesn't equal `0.3`
- Floating point comparison always fails
- Accumulated calculation errors grow over many iterations
- Money calculations produce wrong cents/cents
- Results slowly drift from expected values
- Assertion failures in test comparisons

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Direct float comparison
if (0.1 + 0.2 === 0.3) {
    console.log("Equal");  // Never executes!
}
console.log(0.1 + 0.2);  // Output: 0.30000000000000004

// CORRECT: Compare within epsilon
function almostEqual(a, b, epsilon = 1e-9) {
    return Math.abs(a - b) < epsilon;
}
if (almostEqual(0.1 + 0.2, 0.3)) {
    console.log("Equal");  // Executes!
}

// WRONG: Accumulating float errors
let total = 0;
for (let i = 0; i < 3; i++) {
    total += 0.1;
}
console.log(total === 0.3);  // false!

// CORRECT: Use integer arithmetic or epsilon
let total = 0;
for (let i = 0; i < 3; i++) {
    total += 0.1;
}
console.log(almostEqual(total, 0.3));  // true
```

### Python
```python
# WRONG: Direct float comparison
if 0.1 + 0.2 == 0.3:
    print("Equal")  # Never executes!
print(0.1 + 0.2)  # Output: 0.30000000000000004

# CORRECT: Use math.isclose()
import math
if math.isclose(0.1 + 0.2, 0.3):
    print("Equal")  # Executes!

# WRONG: Money calculations with floats
price = 10.50
total = 0
for i in range(3):
    total += price
print(f"${total}")  # Precision issues with large amounts

# CORRECT: Use integer arithmetic (cents) or Decimal
from decimal import Decimal
price = Decimal("10.50")
total = 0
for i in range(3):
    total += price
print(f"${total}")  # Exact: 31.50
```

### Java
```java
// WRONG: Float equality comparison
if (0.1f + 0.2f == 0.3f) {
    System.out.println("Equal");  // May fail!
}

// CORRECT: Use epsilon for comparison
public static boolean almostEqual(double a, double b) {
    return Math.abs(a - b) < 1e-9;
}
if (almostEqual(0.1 + 0.2, 0.3)) {
    System.out.println("Equal");  // Works!
}

// WRONG: Money calculations with double
double total = 0;
for (int i = 0; i < 10; i++) {
    total += 0.1;
}
System.out.println(total);  // 0.9999999999999999

// CORRECT: Use BigDecimal for money
BigDecimal total = BigDecimal.ZERO;
for (int i = 0; i < 10; i++) {
    total = total.add(new BigDecimal("0.1"));
}
System.out.println(total);  // 1.0
```

### C
```c
// WRONG: Direct float comparison
float a = 0.1f, b = 0.2f, c = 0.3f;
if (a + b == c) {
    printf("Equal\n");  // May not execute!
}

// CORRECT: Compare with epsilon
#include <math.h>
int almostEqual(float a, float b) {
    return fabsf(a - b) < 1e-6f;
}
if (almostEqual(a + b, c)) {
    printf("Equal\n");  // Works!
}

// WRONG: Accumulating errors
float total = 0.0f;
for (int i = 0; i < 3; i++) {
    total += 0.1f;
}
printf("%.20f\n", total);  // Shows accumulated error

// CORRECT: Minimize operations, use epsilon for comparison
float total = 0.0f;
for (int i = 0; i < 3; i++) {
    total += 0.1f;
}
if (almostEqual(total, 0.3f)) {
    printf("Equal\n");
}
```

## How to Fix

1. **Never Use `==` for Floats**: Use epsilon comparison instead
2. **Use Epsilon Comparison**: `abs(a - b) < epsilon` where epsilon = 1e-9 or 1e-6
3. **Use Decimal Type for Money**: Most languages have Decimal type
4. **Integer Arithmetic**: Store amounts in cents, not dollars
5. **Minimize Operations**: Fewer calculations = fewer rounding errors
6. **Use Language Utilities**: `math.isclose()` (Python), `Double.compare()` (Java)
7. **Be Aware of Accumulation**: Repeated operations compound errors

## Prevention Tips

- **Never compare floats with ==**: Always use epsilon or language utilities
- **Use `decimal.Decimal` for money**: Not regular floats
- **Understand the problem**: 0.1 and 0.2 are inherently imprecise
- **Choose epsilon carefully**: 1e-9 for fine comparisons, 1e-6 for rougher
- **Print intermediate values**: Debug to see where precision loss occurs
- **Use integer arithmetic**: Store prices in cents, distances in millimeters
- **Test with edge cases**: 0.1, 0.2, calculations that accumulate

## Real-World Example

```python
# Banking bug: Interest calculation
def calculate_balance(initial, rate, years):
    balance = initial
    for year in range(years):
        balance = balance * (1 + rate)  # BUG: Accumulating precision errors
        print(f"Year {year+1}: ${balance}")
    return balance

# Initial: $1000, Rate: 0.05 (5%), Years: 30
# Expected: ~$4321.94
# Actual: $4321.9422433594297 (correct but displays imprecisely)

# Better version:
from decimal import Decimal
def calculate_balance(initial, rate, years):
    balance = Decimal(str(initial))
    rate = Decimal(str(rate))
    for year in range(years):
        balance = balance * (Decimal(1) + rate)
    return float(balance)  # Or keep as Decimal

# Or for comparison:
def should_apply_bonus(score):
    # BUG: Direct float comparison
    if score == 95.0:
        return True
    return False

score = 0.95 * 100  # = 95.0 theoretically, but...
print(score)  # 94.99999999999999
print(should_apply_bonus(score))  # False! (bug)

# FIXED:
def should_apply_bonus(score):
    return abs(score - 95.0) < 0.01  # Epsilon comparison
```

## Related Bugs

- **Type Mismatch** (#003): Converting float to int loses data
- **Integer Division** (#010): Integer math losing decimal places
- **Logic Inversion** (#005): Wrong comparison operators with floats

## Key Takeaways

✅ Floating point math has inherent precision limits  
✅ Never use `==` to compare floats  
✅ Use epsilon comparison: `abs(a - b) < epsilon`  
✅ Use `Decimal` type for financial calculations  
✅ Store money in cents, not dollars  
✅ Minimize number of floating point operations  
✅ Understand that 0.1 + 0.2 ≠ 0.3 exactly
