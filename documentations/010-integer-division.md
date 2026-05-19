# Bug #010: Integer Division

## What is it?

Integer division occurs when both operands of a division operation are integers. In most languages, this produces an integer result, discarding the decimal part (truncation) rather than rounding.

## Why It Happens

- Forgetting that dividing two integers gives an integer result
- Using `int` instead of `float` or `double`
- Not considering precision loss
- Assuming division will preserve decimals
- Different behavior between languages

## Symptoms

- Expected: 5 / 2 = 2.5, Got: 5 / 2 = 2
- Calculations are off, percentages are wrong
- Ratings: 4 / 5 stars shows as 0 instead of 0.8
- Averages are too small
- Scores or measurements are inaccurate
- Physics/graphics calculations give wrong results

## Examples

### Python 2 vs Python 3
```python
# Python 2: Integer division (/)
result = 5 / 2
print(result)  # 2 (truncated)

# Python 3: True division by default (/)
result = 5 / 2
print(result)  # 2.5 (float)

# To force integer division in Python 3
result = 5 // 2
print(result)  # 2 (floor division)

# CORRECT: Be explicit about what you want
result = 5 / 2.0  # Make one operand float
print(result)  # 2.5

result = float(5) / 2
print(result)  # 2.5
```

### JavaScript
```javascript
// JavaScript always uses floating point
let result = 5 / 2;
console.log(result);  // 2.5 (correct)

// But when using bitwise operations, forces integer
let result = 5 / 2 | 0;  // Bitwise OR with 0
console.log(result);  // 2 (truncated - probably not what you want)

// Correct way
let result = 5 / 2;
console.log(result);  // 2.5
```

### C/C++
```c
// WRONG: Integer division
int a = 5, b = 2;
float result = a / b;  // Result: 2.0 (not 2.5!)
printf("Result: %f\n", result);  // 2.000000

// The division happens first (int/int = int)
// Then result is converted to float

// CORRECT: Cast to float first
float a = 5.0, b = 2.0;
float result = a / b;
printf("Result: %f\n", result);  // 2.500000

// CORRECT: Cast one operand
int a = 5, b = 2;
float result = (float)a / b;  // Explicitly cast
printf("Result: %f\n", result);  // 2.500000

// CORRECT: Use explicit float literal
int a = 5, b = 2;
float result = 5.0 / 2;
printf("Result: %f\n", result);  // 2.500000
```

### Java
```java
// WRONG: Integer division
int a = 5, b = 2;
double result = a / b;  // Result: 2.0
System.out.println(result);  // 2.0

// Division happens first (int/int = int)
// Then result converted to double

// CORRECT: Cast to double
int a = 5, b = 2;
double result = (double) a / b;
System.out.println(result);  // 2.5

// CORRECT: Use double literals
double result = 5.0 / 2.0;
System.out.println(result);  // 2.5
```

## Real-World Examples

### Star Rating
```javascript
// WRONG: Shows 0 stars instead of 0.8
let reviews = 4;
let maxScore = 5;
let rating = reviews / maxScore;  // 4/5 = 0 (if both int)
console.log(Math.floor(rating));  // 0 (wrong!)

// CORRECT
let rating = reviews / maxScore;  // 4/5 = 0.8
let stars = Math.round(rating * 5);  // Correct rating
```

### Percentage Calculation
```c
// WRONG: Shows 0% instead of 20%
int correct = 1;
int total = 5;
int percentage = correct / total * 100;  // 0 * 100 = 0
printf("%d%%\n", percentage);  // 0% (wrong!)

// CORRECT
double percentage = (double)correct / total * 100;
printf("%.0f%%\n", percentage);  // 20%
```

## How to Fix

1. **Use floating-point types** when you need decimals
2. **Cast explicitly** - `(float)a / b`
3. **Use float literals** - `5.0 / 2` instead of `5 / 2`
4. **Know your language** - Python 3 vs Python 2 behave differently
5. **Test with known values** - 1/2 should be 0.5, not 0
6. **Use proper formulas** - divide last to avoid truncation

## Prevention Tips

- Always think about whether result should be float
- Avoid dividing integers expecting float result
- Use `float` or `double` for calculations with decimals
- Make one operand explicitly float/double
- Comment why you're using integer division
- Test calculations with fractional expected results
- Use debugger to check intermediate results
- Be careful with order of operations: `a / b * c` vs `a * c / b`
- For percentages: multiply first, then divide
- Use linting tools to warn about mixed int/float operations
- Document expected precision
