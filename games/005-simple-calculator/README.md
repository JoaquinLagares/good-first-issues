# Bug #005: Simple Calculator - Chain Operator Failure

### The Goal
Create a calculator that can handle chaining operations (e.g., 5 + 3 - 2 = 6).

### The Symptoms
When you try to chain operations (like 5 + 3 - 2), the second operator doesn't calculate the intermediate result properly. You can only perform one operation at a time.

### Hints
1. Look at the `setOperator` function.
2. When a new operator is pressed after the first operation, it should calculate the previous result first.
3. There's a condition checking if `operator` exists where you should call `calculate()` to get an intermediate result.
