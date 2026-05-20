# Bug #017: Null Safety Check Failures

## What is it?

Null safety check failures occur when code assumes a value is not null/None without verifying first, leading to null pointer exceptions, attribute errors, or crashes. This is one of programming's most famous bugs, called "the billion-dollar mistake" by Tony Hoare who invented null.

## Why It Happens

1. **Trusting Assumptions**: Assuming a function always returns non-null
2. **Missing Validation**: Not checking before using returned values
3. **Optional Type Confusion**: Treating optional types as required
4. **Forgetting API Contracts**: Not reading "may return null" in documentation
5. **Incomplete Conditionals**: Only checking some conditions but not null
6. **Error Handling Neglect**: Ignoring potential null from error cases

## Symptoms

- `NullPointerException` (Java)
- `AttributeError` (Python)
- `TypeError: Cannot read property` (JavaScript)
- `Access violation` (C/C++)
- Segmentation fault
- Program crash when accessing object member

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Assuming API returns object
function getUserName(userId) {
    let user = fetchUser(userId);  // May return null!
    return user.name;  // NullPointerException if user is null
}

// CORRECT: Check for null/undefined
function getUserName(userId) {
    let user = fetchUser(userId);
    if (user) {
        return user.name;
    }
    return "Unknown";
}

// WRONG: Chaining without null checks
function getCompanyAddress(employee) {
    return employee.company.address.street;  // Fails if company is null!
}

// CORRECT: Check each step
function getCompanyAddress(employee) {
    if (employee && employee.company && employee.company.address) {
        return employee.company.address.street;
    }
    return "No address";
}

// CORRECT (Modern): Use optional chaining
function getCompanyAddress(employee) {
    return employee?.company?.address?.street ?? "No address";
}
```

### Python
```python
# WRONG: Assuming dictionary has key
def get_user_email(user_dict):
    return user_dict["email"]  # KeyError if "email" missing!

# CORRECT: Use .get() with default
def get_user_email(user_dict):
    return user_dict.get("email", "unknown@example.com")

# WRONG: Assuming function returns value
def find_item(items, target):
    for item in items:
        if item == target:
            return item
    # Returns None implicitly if not found!

result = find_item([1, 2, 3], 5)
print(result.value)  # AttributeError! result is None

# CORRECT: Check result before using
def find_item(items, target):
    for item in items:
        if item == target:
            return item
    return None

result = find_item([1, 2, 3], 5)
if result is not None:
    print(result.value)
else:
    print("Item not found")
```

### Java
```java
// WRONG: Assuming method returns object
String name = getName();  // May return null!
int length = name.length();  // NullPointerException!

// CORRECT: Check for null
String name = getName();
if (name != null) {
    int length = name.length();
} else {
    System.out.println("Name is null");
}

// WRONG: Stream operations without null checks
List<User> users = getUsers();  // May return null!
users.stream()
    .filter(u -> u.getAge() > 18)
    .forEach(System.out::println);  // NullPointerException!

// CORRECT: Check before using
List<User> users = getUsers();
if (users != null) {
    users.stream()
        .filter(u -> u.getAge() > 18)
        .forEach(System.out::println);
}

// BETTER: Use Optional
Optional<List<User>> users = Optional.ofNullable(getUsers());
users.orElse(Collections.emptyList()).stream()
    .filter(u -> u.getAge() > 18)
    .forEach(System.out::println);
```

### C
```c
// WRONG: Assuming malloc succeeds
int* arr = malloc(1000 * sizeof(int));
arr[0] = 42;  // Crash if malloc returned NULL!

// CORRECT: Always check malloc result
int* arr = malloc(1000 * sizeof(int));
if (arr == NULL) {
    printf("Memory allocation failed\n");
    return -1;
}
arr[0] = 42;
free(arr);

// WRONG: Dereferencing NULL pointer
void process(char* str) {
    printf("%c\n", str[0]);  // Crash if str is NULL!
}

// CORRECT: Check for NULL
void process(char* str) {
    if (str != NULL) {
        printf("%c\n", str[0]);
    } else {
        printf("String is NULL\n");
    }
}
```

### C++
```cpp
// WRONG: Dereferencing without check
std::string* getName() {
    return nullptr;
}

std::string name = *getName();  // Crash! Dereferencing nullptr

// CORRECT: Check before dereferencing
std::string* namePtr = getName();
if (namePtr != nullptr) {
    std::string name = *namePtr;
} else {
    std::string name = "Unknown";
}

// BETTER: Use smart pointers
std::shared_ptr<std::string> getName() {
    return nullptr;
}

auto namePtr = getName();
std::string name = (namePtr != nullptr) ? *namePtr : "Unknown";

// BEST: Use optional (C++17)
std::optional<std::string> getName() {
    return std::nullopt;
}

auto name = getName().value_or("Unknown");
```

## How to Fix

1. **Always Check Before Using**: Verify null before accessing properties/methods
2. **Use Safe Access Operators**: Optional chaining (?.), null coalescing (??)
3. **Use Optional Types**: Java's `Optional`, Rust's `Option`, Kotlin's nullable types
4. **Read API Documentation**: Know which functions can return null
5. **Provide Defaults**: Use `.getOrDefault()`, `.get()` with fallback
6. **Validate Inputs**: Check function parameters for null
7. **Use Assertions**: In development, assert non-null values
8. **Enable Type Checking**: TypeScript, mypy catch some null issues

## Prevention Tips

- **Always check null before use**: Make it a habit
- **Read API docs**: See what can return null
- **Use language null-safety features**: Optional, nullable types
- **Enable warnings**: Compiler can warn about potential null access
- **Use IDE hints**: Most IDEs highlight potential null dereferences
- **Defensive programming**: Always assume values might be null
- **Write unit tests**: Test with null values explicitly
- **Use assertions**: Catch null bugs early in development

## Real-World Example

```java
// Email notification bug
public void sendNotification(User user) {
    // BUG: Not checking if user has email
    String email = user.getEmail();
    sendEmail(email, "Hello!");  // Crashes if email is null!
}

// FIXED: Check for null
public void sendNotification(User user) {
    if (user != null && user.getEmail() != null) {
        String email = user.getEmail();
        sendEmail(email, "Hello!");
    } else {
        log.warn("Cannot send notification: user or email missing");
    }
}

// EVEN BETTER: Use Optional
public void sendNotification(User user) {
    Optional.ofNullable(user)
        .map(User::getEmail)
        .ifPresent(email -> sendEmail(email, "Hello!"));
}
```

## Related Bugs

- **Type Mismatch** (#003): Implicit null conversions
- **Uninitialized Variables** (#004): Variables that might be null
- **Exception Handling** (#020): Not catching null exceptions

## Key Takeaways

✅ Never assume a value is not null  
✅ Always check before dereferencing  
✅ Use safe access operators when available  
✅ Understand language-specific null behavior  
✅ Read API documentation  
✅ Use Optional types in modern languages  
✅ Test explicitly with null values  
✅ Null checks should be automatic habit
