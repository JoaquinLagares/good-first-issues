# Bug #011: String Manipulation Errors

## What is it?

String manipulation errors occur when developers incorrectly process, concatenate, or transform strings, leading to unexpected results like truncated text, missing characters, or incorrect formatting. These bugs are common because strings are immutable in many languages, and developers often forget this behavior.

## Why It Happens

1. **Forgetting Strings Are Immutable**: In Python, Java, and JavaScript, strings cannot be modified in-place; operations create new strings
2. **Index Confusion**: Off-by-one errors when slicing or accessing string characters
3. **Case Sensitivity**: Assuming `"Hello"` equals `"hello"` when doing comparisons
4. **Whitespace Issues**: Not accounting for leading/trailing spaces or invisible characters
5. **Encoding Problems**: Not handling special characters or Unicode properly

## Symptoms

- Text appears incomplete or truncated
- Expected characters are missing
- Case doesn't match expectations (all caps or lowercase when shouldn't be)
- Concatenated strings appear in wrong order
- Slice operations return wrong portions of text
- String operations silently fail

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Forgetting strings are immutable
let text = "Hello";
text.toUpperCase();  // Creates new string but doesn't modify text
console.log(text);   // Output: "Hello" (unchanged!)

// CORRECT
let text = "Hello";
text = text.toUpperCase();  // Assign the result
console.log(text);   // Output: "HELLO"

// WRONG: String slicing off-by-one
let name = "Alice";
let shortened = name.slice(0, 3);  // Output: "Ali" (but might expect "Alic")

// CORRECT: Understanding slice is exclusive on end
let name = "Alice";
let shortened = name.slice(0, 4);  // Output: "Alic"
```

### Python
```python
# WRONG: Mutating string through assignment (doesn't work)
text = "hello"
text[0] = "H"  # TypeError! Strings are immutable!

# CORRECT: Create new string with upper()
text = "hello"
text = text[0].upper() + text[1:]  # Output: "Hello"

# WRONG: Forgetting case matters
if "apple" == "Apple":
    print("Found it")  # Won't execute

# CORRECT: Convert to same case
if "apple".lower() == "Apple".lower():
    print("Found it")  # Executes!

# WRONG: Slice without considering boundaries
word = "cat"
print(word[0:10])  # Output: "cat" (Python safely returns available chars)

# CORRECT: Be explicit about what you need
word = "cat"
print(word[0:3])   # Output: "cat"
```

### C
```c
// WRONG: Forgetting null terminator
char buffer[5];
strcpy(buffer, "Hello");  // Buffer overflow! "Hello" = 6 chars (with \0)

// CORRECT: Account for null terminator
char buffer[6];
strcpy(buffer, "Hello");  // Safe, exactly fits

// WRONG: String index confusion
char text[] = "abc";
printf("%c\n", text[3]);  // Accesses null terminator or beyond!

// CORRECT: Use string length to validate
char text[] = "abc";
int len = strlen(text);
if (2 < len) {
    printf("%c\n", text[2]);  // Safe access
}
```

### C++
```cpp
// WRONG: Not checking string bounds
std::string text = "hi";
char c = text[10];  // Undefined behavior!

// CORRECT: Use .at() for bounds checking
std::string text = "hi";
try {
    char c = text.at(10);  // Throws exception
} catch (std::out_of_range& e) {
    std::cerr << "Index out of range\n";
}

// WRONG: Assuming concatenation modifies original
std::string text = "hello";
text + " world";  // Creates new string, doesn't modify text

// CORRECT: Assign the result
std::string text = "hello";
text = text + " world";  // text is now "hello world"
```

### Java
```java
// WRONG: Case sensitivity in comparison
String name = "Alice";
if (name.equals("alice")) {
    System.out.println("Found");  // Won't execute
}

// CORRECT: Use equalsIgnoreCase for case-insensitive comparison
String name = "Alice";
if (name.equalsIgnoreCase("alice")) {
    System.out.println("Found");  // Executes!
}

// WRONG: String indexing beyond length
String text = "cat";
System.out.println(text.charAt(5));  // StringIndexOutOfBoundsException

// CORRECT: Check length first
String text = "cat";
if (5 < text.length()) {
    System.out.println(text.charAt(5));
}
```

## How to Fix

1. **Understand String Immutability**: Always assign results back to variable
2. **Use Proper String Methods**: Learn language-specific string manipulation methods
3. **Test String Length**: Validate index is within bounds before accessing
4. **Be Case-Aware**: Use `.lower()` or `.toUpperCase()` for consistent comparisons
5. **Handle Whitespace**: Use `.strip()`, `.trim()` to remove unwanted spaces
6. **Validate Encoding**: For special characters, ensure proper encoding
7. **Use String Builders**: For many concatenations, use `StringBuilder` (Java) or list joining (Python)

## Prevention Tips

- **Always assign string operation results**: `text = text.upper()` not just `text.upper()`
- **Print intermediate values**: Debug string transformations step-by-step
- **Understand language string methods**: Read documentation for your language's string class
- **Check bounds before indexing**: Verify `index < length` before accessing characters
- **Use comparison methods**: `equals()`, `equalsIgnoreCase()` instead of `==` (depends on language)
- **Be explicit about whitespace**: Don't assume spaces are handled automatically
- **Test with edge cases**: Empty strings, single characters, very long strings

## Real-World Example

```python
# E-commerce bug: Product name truncation
def format_product_name(name, max_length=20):
    # BUG: Forgot to assign slice result
    name.upper()  # Creates uppercase string but doesn't use it
    truncated = name[:max_length]  # Uses original name!
    return truncated

# Input: "awesome product from store"
# Expected output: "AWESOME PRODUCT FROM"
# Actual output: "awesome product from"  ← lowercase!

# FIXED:
def format_product_name(name, max_length=20):
    name = name.upper()  # Assign the result
    truncated = name[:max_length]
    return truncated
```

## Related Bugs

- **Off-by-One Error** (#001): Common in string slicing
- **Logic Inversion** (#005): Incorrect conditionals in string matching
- **Type Mismatch** (#003): Converting strings to wrong types

## Key Takeaways

✅ Strings are immutable in most modern languages  
✅ String operations return new strings; assign the result  
✅ Always validate bounds before accessing string indices  
✅ Be aware of case sensitivity in comparisons  
✅ Whitespace matters; handle it explicitly  
✅ Test with edge cases: empty strings, special characters  
✅ Use language-specific string methods correctly
