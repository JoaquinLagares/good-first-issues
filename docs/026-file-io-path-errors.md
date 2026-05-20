# Bug #026: File I/O and Path Handling Errors

## What is it?

File I/O errors occur when handling files incorrectly - wrong paths, missing error handling, incorrect modes, or platform-specific path issues. These bugs cause data loss, application crashes, or security vulnerabilities.

## Why It Happens

1. **Path Separators**: Using `/` on Windows or `\` on Unix
2. **Missing File Checks**: Assuming file exists without checking
3. **Wrong Open Modes**: Reading as write, writing as read
4. **No Error Handling**: File open/read failures ignored
5. **Resource Leaks**: Files not closed properly
6. **Relative Paths**: Assuming current working directory
7. **Permissions**: Not checking read/write permissions
8. **Case Sensitivity**: Assuming files are case-insensitive (varies by OS)

## Symptoms

- `FileNotFoundException`
- `PermissionDenied` / `Access Denied`
- File created in wrong location
- Data not written (stuck in buffer)
- File corruption from improper write
- Path issues on different platforms
- Permission errors in production

## Examples in Multiple Languages

### Python
```python
# WRONG: Hardcoded absolute path
with open("C:\\Users\\bob\\data.txt") as f:  # Windows-specific!
    data = f.read()

# CORRECT: Use pathlib or os.path
from pathlib import Path
file_path = Path.home() / "data.txt"  # Cross-platform
with open(file_path) as f:
    data = f.read()

# BETTER: Use pathlib throughout
data = file_path.read_text()  # Automatic open/close

# WRONG: Not checking if file exists
with open("data.txt") as f:  # FileNotFoundError if missing!
    data = f.read()

# CORRECT: Check existence or catch exception
from pathlib import Path
file_path = Path("data.txt")
if file_path.exists():
    data = file_path.read_text()
else:
    print("File not found")

# CORRECT: Catch exception
try:
    with open("data.txt") as f:
        data = f.read()
except FileNotFoundError:
    print("File not found")

# WRONG: Opening but not closing (even with try/except)
f = open("data.txt")
try:
    data = f.read()
except Exception as e:
    print(e)
# File never closed if exception occurs!

# CORRECT: Use context manager
with open("data.txt") as f:
    data = f.read()
# File automatically closed

# WRONG: Not flushing after write
with open("output.txt", "w") as f:
    f.write("Important data")
    # If program crashes, data might not be written!

# CORRECT: Explicitly flush
with open("output.txt", "w") as f:
    f.write("Important data")
    f.flush()  # Force write to disk
```

### Java
```java
// WRONG: Using String path without validation
String filename = userInput;  // Could be "../../../etc/passwd"!
FileInputStream fis = new FileInputStream(filename);

// CORRECT: Validate and canonicalize path
File file = new File(userInput);
File canonical = file.getCanonicalFile();
if (!canonical.getPath().startsWith(allowedDirectory.getPath())) {
    throw new SecurityException("Path traversal attempt!");
}
FileInputStream fis = new FileInputStream(file);

// WRONG: Using wrong path separator
String path = "folder\\file.txt";  // Windows only!
File file = new File(path);

// CORRECT: Use separator or URI
String path = "folder" + File.separator + "file.txt";  // Cross-platform
// Or better:
File file = new File("folder", "file.txt");  // Constructor handles separator

// WRONG: Not checking file permissions
FileOutputStream fos = new FileOutputStream(file);  // Might fail!

// CORRECT: Check before attempting
if (file.canWrite()) {
    FileOutputStream fos = new FileOutputStream(file);
} else {
    throw new IOException("No write permission");
}

// WRONG: Not handling IOException
try (FileInputStream fis = new FileInputStream(file)) {
    // But what if open fails?
} // IOException silently caught but what about logging?

// CORRECT: Handle with logging
try (FileInputStream fis = new FileInputStream(file)) {
    // Process file
} catch (FileNotFoundException e) {
    logger.error("File not found: " + file, e);
} catch (IOException e) {
    logger.error("IO error reading: " + file, e);
}

// WRONG: Case-sensitive comparison on case-insensitive OS
String targetFile = "DATA.txt";
if (file.getName().equals(targetFile)) {  // Fails on Windows!
    process(file);
}

// CORRECT: Case-insensitive comparison
if (file.getName().equalsIgnoreCase(targetFile)) {
    process(file);
}
```

### C
```c
// WRONG: No error checking
FILE* f = fopen("data.txt", "r");
fscanf(f, "%d", &value);  // f could be NULL!
fclose(f);

// CORRECT: Check for errors
FILE* f = fopen("data.txt", "r");
if (f == NULL) {
    perror("fopen failed");
    return -1;
}
if (fscanf(f, "%d", &value) != 1) {
    perror("fscanf failed");
    fclose(f);
    return -1;
}
fclose(f);

// WRONG: Wrong file mode
FILE* f = fopen("data.txt", "r");  // Read mode
fprintf(f, "data");  // Can't write in read mode!

// CORRECT: Use appropriate mode
FILE* f = fopen("data.txt", "w");  // Write mode

// WRONG: Not closing file on error
FILE* f = fopen("data.txt", "r");
if (f == NULL) {
    return -1;  // Didn't close (but wasn't open)
}
// ... if error occurs later ...
return -1;  // File not closed!

// CORRECT: Always close in finally
FILE* f = fopen("data.txt", "r");
int result = -1;
if (f != NULL) {
    // Process file
    result = process(f);
}
if (f != NULL) {
    fclose(f);  // Always close
}
return result;
```

## How to Fix

1. **Use pathlib/os.path**: Handle separators automatically
2. **Check File Existence**: Before reading
3. **Check Permissions**: Before reading/writing
4. **Use Correct Mode**: Read vs write, binary vs text
5. **Handle Exceptions**: Catch file-specific errors
6. **Close Properly**: Use finally or context managers
7. **Flush After Write**: Ensure data reaches disk
8. **Validate Paths**: Prevent path traversal attacks

## Prevention Tips

- **Use pathlib**: Modern cross-platform path handling
- **Test on multiple platforms**: Windows, Linux, Mac
- **Use context managers**: Automatic resource cleanup
- **Check return values**: fopen(), open(), etc. can fail
- **Enable file permission checks**: Test with restricted permissions
- **Use absolute paths in production**: Avoid current directory ambiguity
- **Validate user input**: Especially for file paths
- **Code review paths**: Ensure cross-platform compatibility

## File Mode Reference

| Mode | Purpose | File Exists | Can Write |
|------|---------|-------------|-----------|
| `"r"` | Read | Must exist | No |
| `"w"` | Write | Create/overwrite | Yes |
| `"a"` | Append | Create if needed | Yes (end) |
| `"rb"` | Binary read | Must exist | No |
| `"wb"` | Binary write | Create/overwrite | Yes |
| `"r+"` | Read/write | Must exist | Yes |
| `"w+"` | Read/write | Create/overwrite | Yes |

## Real-World Example

```java
// Log file writing bug
public class Logger {
    private String logPath = "logs/app.log";  // BUG: Relative path!
    
    public void log(String message) {
        try (FileWriter fw = new FileWriter(logPath, true);
             BufferedWriter bw = new BufferedWriter(fw)) {
            bw.write(message);
            bw.newLine();
        } catch (IOException e) {
            // Silently ignored
        }
    }
}

// Problem: On different systems with different working directories,
// log goes to different locations!
// On production server, "logs/app.log" is wrong directory

// FIXED: Use absolute path
public class Logger {
    private Path logPath;
    
    public Logger(Path baseDirectory) {
        logPath = baseDirectory.resolve("logs").resolve("app.log");
    }
    
    public void log(String message) {
        try {
            Files.createDirectories(logPath.getParent());
            Files.write(logPath, (message + "\n").getBytes(),
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            System.err.println("Log write failed: " + e);
        }
    }
}
```

## Path Handling Best Practices

✓ Use `Path` or `pathlib` for cross-platform code  
✓ Never hardcode file separators (`/` or `\`)  
✓ Use canonical/absolute paths when possible  
✓ Validate user-provided paths  
✓ Check file exists and permissions  
✓ Use try-with-resources (Java) or context manager (Python)  
✓ Flush after write in critical sections  
✓ Log all file I/O errors

## Related Bugs

- **Exception Handling** (#019): File exception handling
- **Resource Cleanup** (#020): Closing files properly
- **Null Safety** (#017): File not existing

## Key Takeaways

✅ Use pathlib/Path for cross-platform handling  
✅ Always check file exists and permissions  
✅ Use context managers for automatic cleanup  
✅ Handle all IOException possibilities  
✅ Use correct file open mode  
✅ Flush after critical writes  
✅ Never hardcode paths  
✅ Validate user-supplied paths for security
