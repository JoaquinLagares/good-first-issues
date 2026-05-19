# Bug #008: Copy vs Reference

## What is it?

Confusion between copying a value versus copying a reference. In some languages, assignment creates a copy; in others, it creates a reference. Modifying one might unexpectedly modify the other.

## Why It Happens

- Misunderstanding how objects/arrays are passed
- Different behavior between primitive types and objects
- Shallow copy vs deep copy confusion
- Expecting copy semantics but getting reference semantics (or vice versa)
- Not realizing both variables point to same memory

## Symptoms

- Modifying one variable changes another mysteriously
- Changes to arrays/objects affect multiple "copies"
- State is shared unexpectedly
- Original data is modified when you expected a copy
- Testing fails because objects are aliased

## Examples

### JavaScript
```javascript
// WRONG: Both reference same object
let user1 = { name: "Alice", age: 25 };
let user2 = user1;
user2.name = "Bob";
console.log(user1.name);  // "Bob" - both changed!

// CORRECT: Make a copy
let user1 = { name: "Alice", age: 25 };
let user2 = { ...user1 };  // Spread operator
user2.name = "Bob";
console.log(user1.name);  // "Alice" - only user2 changed

// WRONG: Shallow copy doesn't copy nested objects
let obj1 = { name: "Alice", address: { city: "NYC" } };
let obj2 = { ...obj1 };
obj2.address.city = "LA";
console.log(obj1.address.city);  // "LA" - nested object shared!

// CORRECT: Deep copy for nested objects
let obj1 = { name: "Alice", address: { city: "NYC" } };
let obj2 = JSON.parse(JSON.stringify(obj1));
obj2.address.city = "LA";
console.log(obj1.address.city);  // "NYC" - truly independent
```

### Python
```python
# WRONG: list is referenced, not copied
list1 = [1, 2, 3]
list2 = list1
list2.append(4)
print(list1)  # [1, 2, 3, 4] - both changed!

# CORRECT: Use copy() or list()
list1 = [1, 2, 3]
list2 = list1.copy()  # or list(list1)
list2.append(4)
print(list1)  # [1, 2, 3] - unchanged

# WRONG: Shallow copy of nested lists
list1 = [[1, 2], [3, 4]]
list2 = list1.copy()
list2[0].append(5)
print(list1)  # [[1, 2, 5], [3, 4]] - nested list shared!

# CORRECT: Deep copy for nested structures
import copy
list1 = [[1, 2], [3, 4]]
list2 = copy.deepcopy(list1)
list2[0].append(5)
print(list1)  # [[1, 2], [3, 4]] - truly independent
```

### C++
```cpp
// WRONG: Both point to same memory
std::vector<int> v1 = {1, 2, 3};
std::vector<int>& v2 = v1;  // Reference!
v2.push_back(4);
// v1 also has 4 now

// CORRECT: Make a copy
std::vector<int> v1 = {1, 2, 3};
std::vector<int> v2 = v1;  // Copy constructor
v2.push_back(4);
// v1 still has 3 elements

// WRONG: Shallow copy of pointers
class Data {
    int* array;
public:
    Data(const Data& other) : array(other.array) { }  // Shallow!
};
Data d1, d2(d1);
delete d1.array;
// d2.array is now invalid!

// CORRECT: Deep copy
class Data {
    int* array;
public:
    Data(const Data& other) {
        array = new int[size];
        std::copy(other.array, other.array + size, array);
    }
};
```

## How to Fix

1. **Know your language's semantics** - primitives vs objects
2. **Always explicitly copy** - don't assume
3. **Use copy constructors/methods** - not just assignment
4. **For nested structures, use deep copy** - not shallow copy
5. **Document whether function takes ownership** - does it modify?
6. **Pass by value** when you want a copy
7. **Pass by reference** when you want to modify original
8. **Const reference** when you want efficiency without modification

## Prevention Tips

- Always ask: "Are both variables the same object or different?"
- Test by modifying one and checking the other
- Use language features: `const`, `clone()`, `copy()`, `.copy()`
- Use copy constructors explicitly
- Avoid aliasing - minimize shared references
- Document expected behavior
- Use immutable data when possible
- Use `Object.freeze()` in JavaScript to prevent changes
- Add assertions to verify state
- Use static analysis tools to detect aliasing issues
