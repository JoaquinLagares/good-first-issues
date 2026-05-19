# Bug #016: Function Parameter Passing Errors

## What is it?

Function parameter passing errors occur when arguments are passed incorrectly to functions, or when developers misunderstand pass-by-value vs pass-by-reference semantics. This can result in unintended modifications, lost data, or type mismatches.

## Why It Happens

1. **Pass-by-Value vs Pass-by-Reference**: Confusion about whether changes affect original
2. **Missing Arguments**: Function called with fewer arguments than required
3. **Wrong Argument Order**: Arguments passed in wrong order
4. **Type Mismatches**: Passing incompatible types as arguments
5. **Mutable Object Modification**: Accidentally modifying passed objects
6. **Default Parameter Misunderstanding**: Assuming default values work differently

## Symptoms

- Function doesn't modify original variable when it should (or does when it shouldn't)
- `TypeError: function missing required argument`
- Unexpected function behavior with swapped arguments
- Passed object gets modified unexpectedly
- Type coercion causes wrong values

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Pass-by-value for objects (reference is passed!)
function addItem(arr, item) {
    arr.push(item);  // Modifies original array!
}
let items = [1, 2];
addItem(items, 3);
console.log(items);  // [1, 2, 3] (modified!)

// CORRECT: If you don't want modification, copy the array
function addItemSafely(arr, item) {
    let newArr = [...arr];  // Create copy
    newArr.push(item);
    return newArr;
}
let items = [1, 2];
let result = addItemSafely(items, 3);
console.log(items);      // [1, 2] (unchanged)
console.log(result);     // [1, 2, 3]

// WRONG: Missing required arguments
function greet(name, age) {
    console.log(`${name} is ${age}`);
}
greet("Alice");  // "Alice is undefined"

// CORRECT: Provide all required arguments or use defaults
function greet(name, age = "unknown") {
    console.log(`${name} is ${age}`);
}
greet("Alice");  // "Alice is unknown"

// WRONG: Arguments in wrong order
function transfer(from, to, amount) {
    from -= amount;
    to += amount;
}
let alice = 100, bob = 50;
transfer(bob, alice, 20);  // Swapped from/to!
// alice = 120, bob = 30 (but intended: alice = 80, bob = 70)

// CORRECT: Use named parameters or be careful
function transfer(from, to, amount) {
    from -= amount;
    to += amount;
}
let alice = 100, bob = 50;
transfer(alice, bob, 20);  // Correct order
```

### Python
```python
# WRONG: Mutable default argument persists
def append_to_list(item, lst=[]):
    lst.append(item)
    return lst

print(append_to_list(1))  # [1]
print(append_to_list(2))  # [1, 2] (shared default!)
print(append_to_list(3))  # [1, 2, 3] (accumulates!)

# CORRECT: Use None as default
def append_to_list(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst

print(append_to_list(1))  # [1]
print(append_to_list(2))  # [2]
print(append_to_list(3))  # [3]

# WRONG: Modifying passed mutable object
def add_prefix(items):
    items.insert(0, "prefix")  # Modifies original!

data = ["a", "b"]
add_prefix(data)
print(data)  # ["prefix", "a", "b"]

# CORRECT: Work with copy or return new list
def add_prefix(items):
    return ["prefix"] + items  # Returns new list

data = ["a", "b"]
result = add_prefix(data)
print(data)    # ["a", "b"] (unchanged)
print(result)  # ["prefix", "a", "b"]
```

### Java
```java
// WRONG: Pass-by-value for objects (reference is value!)
void addToList(List<Integer> list, int value) {
    list.add(value);  // Modifies original list!
}
List<Integer> numbers = new ArrayList<>();
numbers.add(1);
numbers.add(2);
addToList(numbers, 3);
System.out.println(numbers);  // [1, 2, 3]

// CORRECT: Create new list if original shouldn't change
void addToListSafely(List<Integer> list, int value) {
    List<Integer> copy = new ArrayList<>(list);
    copy.add(value);
    return copy;
}

// WRONG: Missing required arguments
public void drawRectangle(int x, int y, int width, int height) {
    // ...
}
drawRectangle(10, 20);  // Compilation error!

// CORRECT: Provide all arguments
public void drawRectangle(int x, int y, int width, int height) {
    // ...
}
drawRectangle(10, 20, 100, 50);  // OK

// Or use overloading with defaults:
public void drawRectangle(int x, int y) {
    drawRectangle(x, y, 50, 50);  // Use defaults
}
```

### C
```c
// WRONG: Forgot to pass pointer for modification
void increment(int x) {
    x++;  // Increments local copy, not original!
}
int value = 5;
increment(value);
printf("%d\n", value);  // 5 (unchanged!)

// CORRECT: Pass pointer for modification
void increment(int* x) {
    (*x)++;  // Increments what pointer points to
}
int value = 5;
increment(&value);
printf("%d\n", value);  // 6

// WRONG: Not enough arguments for printf
printf("%d %s", 42);  // Missing string argument!

// CORRECT: Provide all required arguments
printf("%d %s\n", 42, "hello");  // OK

// WRONG: Wrong type passed
void process(double value) {
    printf("%.2f\n", value);
}
int x = 10;
process(x);  // Implicit conversion, may lose precision

// CORRECT: Be aware of type conversions
void process(double value) {
    printf("%.2f\n", value);
}
int x = 10;
process((double)x);  // Explicit conversion
```

## How to Fix

1. **Understand Pass-by-Reference vs Pass-by-Value**: Know your language's behavior
2. **Use Pointers/References Intentionally**: Only pass references if modification needed
3. **Provide All Required Arguments**: Check function signature
4. **Get Argument Order Right**: Match function definition
5. **Use Named Parameters**: When language supports, makes order irrelevant
6. **Avoid Mutable Default Arguments**: Use `None`/`null` instead
7. **Create Copies When Needed**: Don't modify passed objects unintentionally
8. **Use Type Hints**: Catch type mismatches early

## Prevention Tips

- **Read function signatures carefully**: Know what arguments are required
- **Use IDE hints**: Most IDEs show parameter info when calling
- **Enable compiler warnings**: Catches missing/extra arguments
- **Use type hints**: TypeScript, mypy catch type mismatches
- **Document mutation behavior**: Make clear what gets modified
- **Test with different argument orders**: Ensure robustness
- **Avoid mutable defaults**: Always use None and check

## Real-World Example

```python
# User account merge bug
def merge_accounts(source_account, target_account):
    # BUG: Modifying passed dict objects!
    target_account["balance"] += source_account["balance"]
    source_account["balance"] = 0
    target_account["transactions"].extend(source_account["transactions"])
    source_account["transactions"].clear()
    # Now original accounts are modified!

alice = {"balance": 100, "transactions": ["sale"]}
bob = {"balance": 50, "transactions": ["buy"]}
merge_accounts(alice, bob)

print(alice)  # {"balance": 0, "transactions": []} (wiped!)

# FIXED: Return new objects instead of modifying
def merge_accounts(source_account, target_account):
    merged = {
        "balance": source_account["balance"] + target_account["balance"],
        "transactions": source_account["transactions"] + target_account["transactions"]
    }
    return merged

alice = {"balance": 100, "transactions": ["sale"]}
bob = {"balance": 50, "transactions": ["buy"]}
merged = merge_accounts(alice, bob)

print(alice)    # {"balance": 100, "transactions": ["sale"]} (unchanged)
print(merged)   # {"balance": 150, "transactions": ["sale", "buy"]}
```

## Related Bugs

- **Type Mismatch** (#003): Wrong argument types
- **Uninitialized Variables** (#004): Arguments passed but not initialized
- **Null/None Reference** (#002): Missing required argument

## Key Takeaways

✅ Understand pass-by-value vs pass-by-reference for your language  
✅ Objects usually pass by reference (even if language is pass-by-value)  
✅ Document which parameters are modified  
✅ Avoid mutable default arguments  
✅ Get argument order correct  
✅ Provide all required arguments  
✅ Use type hints to catch mismatches  
✅ Test with different argument combinations
