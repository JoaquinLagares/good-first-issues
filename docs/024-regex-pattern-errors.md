# Bug #024: Regular Expression Pattern Errors

## What is it?

Regular expression (regex) pattern errors occur when regex patterns are written incorrectly, causing matches to fail, match wrong text, or perform unexpectedly. Regex is notoriously tricky, with subtle syntax differences between languages and easy-to-miss edge cases.

## Why It Happens

1. **Greedy vs Non-Greedy**: `.*` matches too much, should use `.*?`
2. **Anchor Confusion**: Forgetting `^` and `$` for start/end matching
3. **Character Class Mistakes**: `[0-9]` vs `[09]`, bracket positioning
4. **Escape Confusion**: When to escape special characters
5. **Language Differences**: Regex syntax differs between languages
6. **Performance Issues**: Catastrophic backtracking on complex patterns

## Symptoms

- Regex doesn't match expected text
- Regex matches too much text
- Partial matches when full match needed
- Case sensitivity issues
- Performance hangs with certain inputs
- Cross-platform regex differences

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Missing anchors (matches substring)
let pattern = /hello/;
console.log(pattern.test("hello world"));  // true (correct)
console.log(pattern.test("say hello"));    // true (might want full match)

// CORRECT: Use anchors for full match
let pattern = /^hello$/;
console.log(pattern.test("hello world"));  // false (full match required)

// WRONG: Greedy matching
let pattern = /<.*>/;
let html = "<div>content</div>";
console.log(html.match(pattern));  // ["<div>content</div>"] (matches everything!)

// CORRECT: Non-greedy matching
let pattern = /<.*?>/;
console.log(html.match(pattern));  // ["<div>"] (matches minimal)

// WRONG: Forgetting regex flags
let pattern = /hello/;
console.log("HELLO".match(pattern));  // null (case-sensitive)

// CORRECT: Use flags
let pattern = /hello/i;  // i = case-insensitive
console.log("HELLO".match(pattern));  // ["HELLO"]

// WRONG: Not escaping special characters
let pattern = /price: $\d+/;  // $ treated as end-of-line anchor!
console.log("price: $50".match(pattern));  // null

// CORRECT: Escape literal special chars
let pattern = /price: \$\d+/;
console.log("price: $50".match(pattern));  // ["price: $50"]
```

### Python
```python
# WRONG: String vs raw string
pattern = "\\d+"  # Double backslash = single backslash
import re
matches = re.findall(pattern, "The year 2024")
# Works but confusing!

# CORRECT: Use raw string
pattern = r"\d+"
matches = re.findall(pattern, "The year 2024")
# Clearer: r prefix means raw string

# WRONG: Greedy quantifier
pattern = r"<.*>"
html = "<div>content</div><span>text</span>"
match = re.search(pattern, html)
print(match.group())  # "<div>content</div><span>text</span>" (too much!)

# CORRECT: Non-greedy
pattern = r"<.*?>"
match = re.search(pattern, html)
print(match.group())  # "<div>" (correct)

# WRONG: Not using MULTILINE for ^$
text = "line1\nline2"
pattern = r"^line"
matches = re.findall(pattern, text)
# Without MULTILINE: only matches start of entire string

# CORRECT: Use MULTILINE flag
matches = re.findall(pattern, text, re.MULTILINE)
# Now ^ matches start of each line

# WRONG: Character class confusion
pattern = r"[09]"  # Matches 0 or 9, not 0-9!
print(re.findall(pattern, "0123456789"))  # ['0', '9']

# CORRECT: Hyphen placement
pattern = r"[0-9]"  # Matches 0 through 9
print(re.findall(pattern, "0123456789"))  # All digits
```

### Java
```java
// WRONG: Pattern compilation each time
String text = "The year 2024";
for (String line : lines) {
    if (line.matches("\\d+")) {  // Recompiles regex each time!
        process(line);
    }
}

// CORRECT: Compile once, reuse
Pattern pattern = Pattern.compile("\\d+");
for (String line : lines) {
    if (pattern.matcher(line).matches()) {
        process(line);
    }
}

// WRONG: Backslash confusion
String pattern = "\d+";  // Single backslash interpreted as escape!

// CORRECT: Double backslash for literal backslash
String pattern = "\\d+";

// WRONG: Not anchoring (matches substring)
Pattern pattern = Pattern.compile("hello");
Matcher matcher = pattern.matcher("hello world");
if (matcher.find()) {
    System.out.println("Found!");  // finds() ≠ matches()
}

// CORRECT: Use matches() for full string
if (pattern.matcher("hello").matches()) {
    System.out.println("Full match!");
}

// WRONG: No bounds on repetition (catastrophic backtracking)
String pattern = "(a+)+b";  // Exponential backtracking on "aaaaaaaaac"
Pattern p = Pattern.compile(pattern);
String input = "aaaaaaaaaaaaaaaaaaaaac";
p.matcher(input).find();  // Hangs!

// CORRECT: Use atomic grouping
String pattern = "(?>a+)b";  // Prevents backtracking
```

## How to Fix

1. **Use Raw Strings**: In Python, use `r"pattern"` to avoid double escaping
2. **Test Your Patterns**: Use regex tester tools online
3. **Start Simple**: Build patterns incrementally
4. **Anchor Carefully**: `^` and `$` for full match vs substring
5. **Use Non-Greedy**: `*?` and `+?` when you need minimal match
6. **Remember Escaping**: Special chars need `\` (but escaped in strings)
7. **Understand Flags**: Case-insensitive, multiline, etc.
8. **Avoid Catastrophic Backtracking**: Test with problematic inputs

## Prevention Tips

- **Use online regex tester**: Validate pattern before coding
- **Document patterns**: Comment complex regex with explanation
- **Extract to variables**: Don't inline complex patterns
- **Compile once**: Reuse compiled patterns (Java, C#)
- **Test edge cases**: Empty string, special chars, long input
- **Know your language's regex**: Flavors differ
- **Use named groups**: Improves readability
- **Performance test**: Try with long/problematic inputs

## Regex Quick Reference

| Pattern | Meaning | Example |
|---------|---------|---------|
| `.` | Any character | `a.b` matches "aXb" |
| `*` | 0 or more (greedy) | `a*` matches "", "a", "aa" |
| `+` | 1 or more (greedy) | `a+` matches "a", "aa" |
| `?` | 0 or 1 | `a?b` matches "b" or "ab" |
| `^` | Start of string/line | `^hello` matches start |
| `$` | End of string/line | `world$` matches end |
| `[0-9]` | Character class | Matches any digit |
| `(abc)` | Group | For capturing or reference |
| `\d` | Digit | Equivalent to `[0-9]` |
| `\w` | Word char | Alphanumeric + `_` |
| `\s` | Whitespace | Space, tab, newline |

## Real-World Example

```python
# Email validation bug
import re

def is_valid_email(email):
    # BUG: Pattern too greedy, allows anything
    pattern = r"^.+@.+$"  # .+ matches too much!
    return re.match(pattern, email) is not None

# Matches: " @  " (not an email!)
# Matches: "a@b" (too permissive)

# FIXED: Proper email pattern
def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None

# Now correctly validates email format
```

## Language-Specific Notes

**Python**: Use `r"pattern"` (raw string), avoid double escaping

**JavaScript**: Use `/pattern/flags`, remember greedy vs non-greedy

**Java**: Compile Pattern once for efficiency, double-escape backslashes

**C#**: Similar to Java, watch out for verbatim strings `@"pattern"`

## Related Bugs

- **String Manipulation** (#011): Regex part of string processing
- **Logic Inversion** (#005): Regex logic backwards
- **Performance Issues**: Catastrophic backtracking

## Key Takeaways

✅ Use raw strings to avoid escaping confusion  
✅ Anchor patterns with ^ and $ when needed  
✅ Understand greedy (*) vs non-greedy (*?)  
✅ Test patterns with online tester before use  
✅ Document complex regex with explanation  
✅ Compile once in performance-critical code  
✅ Watch for catastrophic backtracking  
✅ Regex syntax differs between languages
