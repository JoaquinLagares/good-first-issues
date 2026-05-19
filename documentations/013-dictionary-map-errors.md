# Bug #013: Dictionary/Map Operation Errors

## What is it?

Dictionary and map operation errors occur when accessing, modifying, or iterating over key-value collections incorrectly. These bugs include accessing non-existent keys, type mismatches in keys, and incorrect key-value pair handling.

## Why It Happens

1. **Accessing Non-Existent Keys**: Trying to access a key that doesn't exist in the dictionary
2. **Key Type Mismatch**: Using different types for the same key (1 vs "1")
3. **Mutating During Iteration**: Adding/removing items while iterating over dictionary
4. **Case Sensitivity**: Assuming keys are case-insensitive when they're not
5. **Forgetting Default Values**: Not handling missing keys gracefully

## Symptoms

- `KeyError` (Python)
- `NullPointerException` (Java)
- `undefined` (JavaScript)
- Program crashes on dictionary access
- Logic errors when dictionary changes during iteration
- Unexpected `None` or `null` values

## Examples in Multiple Languages

### Python
```python
# WRONG: Accessing non-existent key
data = {"name": "Alice", "age": 30}
print(data["city"])  # KeyError: 'city'

# CORRECT: Use .get() with default value
data = {"name": "Alice", "age": 30}
print(data.get("city", "Unknown"))  # Output: "Unknown"

# WRONG: Case sensitivity assumed
user = {"Name": "Bob"}
print(user["name"])  # KeyError: 'name'

# CORRECT: Use consistent key case
user = {"name": "Bob"}
print(user["name"])  # Output: "Bob"

# WRONG: Modifying dict during iteration
data = {"a": 1, "b": 2, "c": 3}
for key in data:
    if key == "b":
        del data[key]  # RuntimeError: dictionary changed size during iteration

# CORRECT: Iterate over copy or collect keys first
data = {"a": 1, "b": 2, "c": 3}
for key in list(data.keys()):
    if key == "b":
        del data[key]  # Safe
```

### JavaScript
```javascript
// WRONG: Accessing undefined property doesn't error but returns undefined
let obj = {name: "Alice"};
console.log(obj.city);  // undefined (no error!)

// CORRECT: Check if property exists first
let obj = {name: "Alice"};
if ("city" in obj) {
    console.log(obj.city);
} else {
    console.log("City not found");
}

// WRONG: Using object with numeric string keys
let data = {};
data[1] = "one";
data["1"] = "ONE";  // Overwrites! Objects convert 1 to "1"
console.log(data[1]);  // Output: "ONE"

// CORRECT: Use Map for true key distinction if needed
let data = new Map();
data.set(1, "one");
data.set("1", "ONE");  // Different keys
console.log(data.get(1));  // Output: "one"
```

### Java
```java
// WRONG: Accessing non-existent key
Map<String, String> map = new HashMap<>();
map.put("name", "Alice");
System.out.println(map.get("city"));  // null (no error)

// CORRECT: Check before accessing or use getOrDefault
Map<String, String> map = new HashMap<>();
map.put("name", "Alice");
String city = map.getOrDefault("city", "Unknown");  // "Unknown"

// WRONG: Modifying map during iteration
Map<String, Integer> data = new HashMap<>();
data.put("a", 1);
data.put("b", 2);
for (String key : data.keySet()) {
    if (key.equals("b")) {
        data.remove(key);  // ConcurrentModificationException
    }
}

// CORRECT: Remove after iteration or use iterator
Map<String, Integer> data = new HashMap<>();
data.put("a", 1);
data.put("b", 2);
List<String> toRemove = new ArrayList<>();
for (String key : data.keySet()) {
    if (key.equals("b")) {
        toRemove.add(key);
    }
}
for (String key : toRemove) {
    data.remove(key);  // Safe
}
```

### C++ (std::map)
```cpp
// WRONG: Accessing non-existent key creates it!
std::map<std::string, int> data;
data["name"] = 5;
int value = data["age"];  // Creates "age" with value 0!

// CORRECT: Use .find() to check first
std::map<std::string, int> data;
data["name"] = 5;
auto it = data.find("age");
if (it != data.end()) {
    int value = it->second;
}

// WRONG: Type confusion with key
std::map<int, std::string> data;
data[1] = "one";
std::string val = data["1"];  // Tries to convert string "1" to int!

// CORRECT: Be consistent with key types
std::map<std::string, std::string> data;
data["1"] = "one";
std::string val = data["1"];  // Safe
```

## How to Fix

1. **Check Key Existence**: Use `.get()`, `.find()`, `in` operator
2. **Use Default Values**: Provide fallback for missing keys
3. **Consistent Key Types**: Ensure keys always same type
4. **Iterate Over Copy**: Don't modify dictionary during iteration
5. **Be Case-Aware**: Remember keys are case-sensitive
6. **Use Safe Access Methods**: `.getOrDefault()`, `.get()` with default
7. **Handle Null/None**: Check for missing values after retrieval

## Prevention Tips

- **Never assume keys exist**: Always check or use default values
- **Print dictionary structure**: Debug by printing keys and values
- **Be explicit about key types**: Don't mix string "1" and integer 1
- **Use typed dictionaries**: TypeScript or mypy helps catch type errors
- **Collect changes first**: Don't modify during iteration
- **Use language utilities**: Most languages have safe access methods
- **Test with empty dictionaries**: Ensure code handles missing keys

## Real-World Example

```python
# User profile lookup bug
def get_user_profile(user_id, database):
    user = database[user_id]  # BUG: KeyError if user doesn't exist
    profile = {
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"]  # Bug: phone might not exist
    }
    return profile

# FIXED: Use .get() with defaults
def get_user_profile(user_id, database):
    if user_id not in database:
        return None  # Handle missing user
    user = database[user_id]
    profile = {
        "name": user.get("name", "Unknown"),
        "email": user.get("email", "unknown@example.com"),
        "phone": user.get("phone", "Not provided")
    }
    return profile
```

## Related Bugs

- **Null/None Reference** (#002): Similar behavior with missing keys
- **Type Mismatch** (#003): Using wrong type for dictionary keys
- **Logic Inversion** (#005): Incorrect conditions for key checking

## Key Takeaways

✅ Always check key existence before accessing  
✅ Use `.get()` with default values  
✅ Be consistent with key types  
✅ Never modify collections during iteration  
✅ Remember keys are case-sensitive  
✅ Understand language-specific null/undefined behavior  
✅ Handle missing keys gracefully
