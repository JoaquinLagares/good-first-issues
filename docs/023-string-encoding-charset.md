# Bug #023: String Encoding and Charset Issues

## What is it?

String encoding issues occur when strings with non-ASCII characters (Unicode) are handled incorrectly. This includes encoding/decoding mistakes, charset mismatches, and data corruption. With global applications, this is increasingly important.

## Why It Happens

1. **Assumed ASCII**: Assuming all strings are ASCII (a-z, 0-9)
2. **Charset Mismatches**: Reading UTF-8 as ASCII or vice versa
3. **Encoding on Write, Wrong on Read**: Using different charsets
4. **Byte vs Character Confusion**: Length in bytes vs characters
5. **Locale Assumptions**: Assuming user locale matches
6. **BOM Handling**: Byte order mark not handled

## Symptoms

- Mojibake (garbled characters): `café` becomes `cafÃ©`
- Loss of data with non-ASCII characters
- Database corruption with emoji/special chars
- API responses show corrupted text
- Filename handling breaks with special characters
- Search/replace doesn't work with Unicode

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: Assuming ASCII length
let text = "café";
console.log(text.length);  // 4 (correct in JavaScript)
let bytes = Buffer.from(text, 'utf8');
console.log(bytes.length);  // 5 (UTF-8 uses 2 bytes for é)

// CORRECT: Understand the difference
let text = "café";
console.log(text.length);  // Character count: 4
let utf8Bytes = Buffer.from(text, 'utf8');
console.log(utf8Bytes.length);  // Byte count: 5

// WRONG: Not specifying encoding
let data = Buffer.from(text);  // Default UTF-8 (OK)
let decoded = data.toString();  // Default UTF-8 (OK if matched)

// CORRECT: Be explicit
let data = Buffer.from(text, 'utf8');
let decoded = data.toString('utf8');  // Explicit encoding

// WRONG: Reading file without encoding
const content = fs.readFileSync('data.txt');
console.log(content);  // Buffer object, not string!

// CORRECT: Specify encoding
const content = fs.readFileSync('data.txt', 'utf8');
console.log(content);  // String!
```

### Python
```python
# WRONG: Bytes vs string confusion
text = "hello"
data = text.encode('utf-8')  # Now bytes
print(data)  # b'hello'
print(data + text)  # TypeError! Can't concatenate bytes and str

# CORRECT: Decode to string
text = "hello"
data = text.encode('utf-8')
decoded = data.decode('utf-8')
print(decoded + text)  # Works!

# WRONG: Assuming ASCII
filename = "café.txt"
with open(filename, 'r') as f:  # Default encoding (UTF-8 on most systems)
    data = f.read()

# CORRECT: Specify encoding if needed
filename = "café.txt"
with open(filename, 'r', encoding='utf-8') as f:
    data = f.read()

# WRONG: Writing with wrong encoding
text = "café"
with open('output.txt', 'w') as f:  # Default encoding
    f.write(text)  # Might use latin-1 on some systems!

# CORRECT: Specify encoding explicitly
text = "café"
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write(text)

# WRONG: Length confusion with Unicode
text = "👨‍👩‍👧‍👦"  # Family emoji (multiple characters)
print(len(text))  # 7 (multiple characters for single emoji!)

# CORRECT: Understand grapheme clusters
text = "👨‍👩‍👧‍👦"
print(len(text))  # 7 (technically multiple code points)
```

### Java
```java
// WRONG: Charset mismatch
String text = "café";
byte[] bytes = text.getBytes();  // Uses system default charset!
String recovered = new String(bytes);  // Uses system default (might differ!)

// CORRECT: Explicit charset
String text = "café";
byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
String recovered = new String(bytes, StandardCharsets.UTF_8);

// WRONG: Reading with wrong charset
FileInputStream fis = new FileInputStream("data.txt");
InputStreamReader reader = new InputStreamReader(fis);  // Uses default charset!
BufferedReader br = new BufferedReader(reader);

// CORRECT: Specify charset
FileInputStream fis = new FileInputStream("data.txt");
InputStreamReader reader = new InputStreamReader(
    fis, StandardCharsets.UTF_8);  // Explicit
BufferedReader br = new BufferedReader(reader);

// BETTER: Use Files utility
String content = Files.readString(
    Paths.get("data.txt"), 
    StandardCharsets.UTF_8);  // Explicit and concise

// WRONG: Ignoring encoding in HTTP
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
BufferedReader br = new BufferedReader(
    new InputStreamReader(conn.getInputStream()));
// Might use wrong charset!

// CORRECT: Use header charset if provided
String contentType = conn.getContentType();
// Parse charset from Content-Type header
String charset = extractCharset(contentType, "UTF-8");
BufferedReader br = new BufferedReader(
    new InputStreamReader(conn.getInputStream(), charset));
```

### C
```c
// WRONG: Assuming ASCII
char buffer[100];
strcpy(buffer, "café");  // Buffer overflow if not UTF-8 aware!

// CORRECT: Account for UTF-8 multi-byte characters
char buffer[300];  // Larger for UTF-8
strncpy(buffer, "café", 299);

// WRONG: Character operations on UTF-8
char text[] = "café";
for (int i = 0; i < strlen(text); i++) {
    // This iterates over bytes, not characters!
    // 'é' is 2 bytes in UTF-8
}

// CORRECT: Use multibyte character functions
#include <wchar.h>
wchar_t text[] = L"café";  // Wide character string
for (int i = 0; i < wcslen(text); i++) {
    // Now iterates over characters
}
```

## How to Fix

1. **Always Specify Encoding**: UTF-8 is standard for most new projects
2. **Understand Bytes vs Characters**: Know when you're dealing with each
3. **Use Library Functions**: Don't manually handle encoding
4. **Test with Unicode**: Include emoji, accents, special chars
5. **Validate on Boundaries**: Ensure data isn't corrupted in transit
6. **Document Assumptions**: State what encoding is expected
7. **Use BOM Cautiously**: UTF-8 BOM can cause issues
8. **HTML/URL Encoding**: Separate concern from string encoding

## Prevention Tips

- **Default to UTF-8**: It's the standard for web/modern systems
- **Specify encoding explicitly**: In file I/O, network, databases
- **Test with non-ASCII**: Always include emoji, accents in tests
- **Use string libraries**: Don't manually manipulate bytes
- **Check locale settings**: Some operations locale-dependent
- **Validate input**: Check encoding when receiving data
- **Log encoding info**: Debug encoding issues by tracking it
- **Use type systems**: Typed strings (Text in Haskell, etc.)

## Real-World Example

```python
# Web form submission bug
def process_user_signup(name, email):
    # BUG: Saving to file without UTF-8 encoding
    with open('users.txt', 'a') as f:  # Default encoding!
        f.write(f"{name},{email}\n")
    
    # If user enters "Müller", it might be corrupted!

# Later, when reading back:
with open('users.txt', 'r') as f:  # Different system = different charset
    data = f.read()
    # "Müller" appears as "M"

# FIXED: Explicit UTF-8
def process_user_signup(name, email):
    with open('users.txt', 'a', encoding='utf-8') as f:
        f.write(f"{name},{email}\n")

# Later, always read as UTF-8:
with open('users.txt', 'r', encoding='utf-8') as f:
    data = f.read()
    # "Müller" appears correctly!
```

## Encoding Quick Reference

| Encoding | Bytes/Char | Notes |
|----------|-----------|-------|
| ASCII | 1 | Only 0-127 |
| UTF-8 | 1-4 | Most common, variable length |
| UTF-16 | 2-4 | Used by Java internally |
| Latin-1 | 1 | European chars |
| GB2312 | 2 | Chinese |

## Related Bugs

- **Type Mismatch** (#003): Bytes vs string confusion
- **Resource Cleanup** (#020): Encoding context not preserved
- **Logic Inversion** (#005): Encoding checks backwards

## Key Takeaways

✅ Default to UTF-8 for new projects  
✅ Always specify encoding explicitly  
✅ Understand bytes vs characters distinction  
✅ Test with non-ASCII characters  
✅ Encoding should match at read and write  
✅ Use library functions, not manual handling  
✅ Validate encoding at system boundaries  
✅ Global apps need encoding awareness
