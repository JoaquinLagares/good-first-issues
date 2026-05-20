# Bug #019: Exception Handling Failures

## What is it?

Exception handling failures occur when exceptions are not caught, caught incorrectly, or when exception handling code doesn't properly recover from errors. This includes overly broad catch blocks, ignoring caught exceptions, not cleaning up resources, and missing error handling entirely.

## Why It Happens

1. **Ignoring Exceptions**: Catching but not handling, empty catch blocks
2. **Over-Broad Catches**: Catching `Exception` instead of specific types
3. **Wrong Exception Type**: Catching wrong exception or not catching at all
4. **Resource Leaks**: Not cleaning up in finally block
5. **Silent Failures**: Logging error but continuing as if nothing happened
6. **Re-throwing Mistakes**: Losing exception information when re-throwing

## Symptoms

- Exception silently caught and ignored
- Program crashes from unhandled exception
- Resource leak (file handles, connections not closed)
- Error messages logged but program continues incorrectly
- Difficult-to-debug issues from swallowed exceptions
- Resource exhaustion over time

## Examples in Multiple Languages

### Python
```python
# WRONG: Catching but ignoring exception
try:
    connect_to_database()
except Exception:
    pass  # Silent failure! Bug won't be caught

# CORRECT: Log or handle appropriately
try:
    connect_to_database()
except ConnectionError as e:
    logger.error(f"Database connection failed: {e}")
    raise  # Or use default database

# WRONG: Over-broad exception catch
try:
    data = process_file(filename)
    value = int(data)  # Could raise ValueError!
except Exception:
    return None  # Silently hides all errors!

# CORRECT: Catch specific exceptions
try:
    data = process_file(filename)
    value = int(data)
except FileNotFoundError:
    logger.error(f"File not found: {filename}")
    return None
except ValueError:
    logger.error(f"Invalid data format in {filename}")
    return None

# WRONG: Not cleaning up resources
file = open("data.txt")
data = file.read()
process(data)
# What if process() raises exception? File never closed!

# CORRECT: Use try/finally or context manager
file = open("data.txt")
try:
    data = file.read()
    process(data)
finally:
    file.close()

# BETTER: Use context manager
with open("data.txt") as file:
    data = file.read()
    process(data)  # File automatically closed even if error
```

### JavaScript
```javascript
// WRONG: Ignoring error
try {
    fetchData().then(data => {
        processData(data);
    }).catch(error => {
        console.log(error);  // Logged but not handled!
    });
} catch (e) {
    // Won't catch promise rejection!
}

// CORRECT: Handle error properly
try {
    fetchData()
        .then(data => processData(data))
        .catch(error => {
            logger.error(`Data fetch failed: ${error}`);
            return defaultData;  // Recover with default
        });
} catch (e) {
    // Synchronous errors
}

// WRONG: Empty catch block
try {
    riskyOperation();
} catch (e) {
    // Silent failure!
}

// CORRECT: Handle or re-throw
try {
    riskyOperation();
} catch (e) {
    if (e instanceof NetworkError) {
        retry();  // Handle specific error
    } else {
        throw e;  // Re-throw unknown errors
    }
}

// WRONG: Not cleaning up resources
const file = fs.openSync("data.txt");
try {
    const data = fs.readSync(file);
    process(data);
} catch (e) {
    console.error(e);
}
// What if process() throws? File never closed!

// CORRECT: Always close in finally
const file = fs.openSync("data.txt");
try {
    const data = fs.readSync(file);
    process(data);
} finally {
    fs.closeSync(file);  // Always executes
}
```

### Java
```java
// WRONG: Catching generic Exception
try {
    int value = Integer.parseInt(input);
    System.out.println(value);
} catch (Exception e) {
    System.out.println("Error");  // Too broad! Hides real errors
}

// CORRECT: Catch specific exception
try {
    int value = Integer.parseInt(input);
    System.out.println(value);
} catch (NumberFormatException e) {
    logger.error("Invalid number format: " + input, e);
}

// WRONG: Empty catch block
try {
    saveFile();
} catch (IOException e) {
    // Silent failure!
}

// CORRECT: Log and handle or re-throw
try {
    saveFile();
} catch (IOException e) {
    logger.error("Failed to save file", e);
    throw new ApplicationException("Save failed", e);
}

// WRONG: Resource not closed
FileInputStream fis = new FileInputStream("data.bin");
try {
    byte[] data = fis.readAllBytes();
    process(data);
} catch (IOException e) {
    logger.error("Read failed", e);
}
// What if process() throws? Stream never closed!

// CORRECT: Use try-with-resources
try (FileInputStream fis = new FileInputStream("data.bin")) {
    byte[] data = fis.readAllBytes();
    process(data);
} catch (IOException e) {
    logger.error("Read failed", e);
}
// Stream automatically closed
```

### C
```c
// WRONG: Not checking return values
FILE* file = fopen("data.txt", "r");
fscanf(file, "%d", &value);  // No check if file is NULL!

// CORRECT: Check return values
FILE* file = fopen("data.txt", "r");
if (file == NULL) {
    perror("fopen");
    return -1;
}
if (fscanf(file, "%d", &value) != 1) {
    fprintf(stderr, "Invalid data format\n");
    fclose(file);
    return -1;
}
fclose(file);

// WRONG: Not cleaning up on error
int* buffer = malloc(1000);
if (buffer == NULL) {
    return -1;  // OK
}
int result = process(buffer);
if (result < 0) {
    return -1;  // BUG: buffer never freed!
}
free(buffer);

// CORRECT: Clean up before returning
int* buffer = malloc(1000);
if (buffer == NULL) {
    return -1;
}
int result = process(buffer);
free(buffer);  // Always clean up
if (result < 0) {
    return -1;
}
return 0;
```

## How to Fix

1. **Catch Specific Exceptions**: Not generic `Exception`
2. **Always Clean Up**: Use finally, try-with-resources, RAII
3. **Log Exceptions**: Include context and stack trace
4. **Handle or Re-throw**: Don't silently ignore
5. **Provide Recovery**: Default values, retries, fallbacks
6. **Use Proper Exception Hierarchy**: Create custom exceptions
7. **Document What Can Fail**: Comment which exceptions possible
8. **Test Error Cases**: Explicitly test error paths

## Prevention Tips

- **Enable compiler warnings**: Catches unchecked exceptions
- **Never use empty catch blocks**: Always log or re-throw
- **Catch specific types**: Not base `Exception` class
- **Use IDE inspection**: Highlights potential issues
- **Test error paths**: Don't just test happy path
- **Use linters**: Can detect empty catch blocks
- **Document error cases**: Know what can fail
- **Review exception handling**: During code review

## Real-World Example

```java
// Database connection pool bug
public class UserRepository {
    private DatabaseConnection conn;
    
    public User getUser(int id) {
        try {
            conn = pool.getConnection();  // May fail
            ResultSet rs = conn.query("SELECT * FROM users WHERE id = " + id);
            // BUG: If query throws, connection never returned to pool!
            return parseUser(rs);
        } catch (SQLException e) {
            // Logging but not handling
            logger.warn("Database error", e);
            return null;
        }
    }
}

// FIXED: Ensure cleanup
public class UserRepository {
    private DatabaseConnection conn;
    
    public User getUser(int id) {
        DatabaseConnection conn = null;
        try {
            conn = pool.getConnection();
            ResultSet rs = conn.query("SELECT * FROM users WHERE id = " + id);
            return parseUser(rs);
        } catch (SQLException e) {
            logger.error("Failed to fetch user " + id, e);
            return null;  // Or throw custom exception
        } finally {
            if (conn != null) {
                pool.returnConnection(conn);  // Always return
            }
        }
    }
}

// BEST: Use try-with-resources
public User getUser(int id) {
    try (DatabaseConnection conn = pool.getConnection()) {
        ResultSet rs = conn.query("SELECT * FROM users WHERE id = " + id);
        return parseUser(rs);
    } catch (SQLException e) {
        logger.error("Failed to fetch user " + id, e);
        return null;
    }
    // Connection automatically returned to pool
}
```

## Exception Hierarchy Guidelines

```
Exception (catch specific types)
├── IOException (file, network)
├── SQLException (database)
├── ParseException (format)
├── IllegalArgumentException (invalid input)
├── NullPointerException (null)
└── RuntimeException (not required to catch)
```

## Related Bugs

- **Resource Cleanup** (#021): Not cleaning up in error case
- **Null/None Reference** (#002): Null returned on error
- **Logic Inversion** (#005): Error recovery logic reversed

## Key Takeaways

✅ Catch specific exception types, not generic Exception  
✅ Always clean up resources in finally or try-with-resources  
✅ Log exceptions with full context and stack trace  
✅ Handle errors or re-throw; never silently ignore  
✅ Test error paths explicitly  
✅ Provide recovery mechanisms (defaults, retries)  
✅ Use custom exceptions for application-specific errors  
✅ Document what exceptions methods can throw
