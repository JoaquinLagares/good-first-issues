# Bug #020: Resource Cleanup Failures

## What is it?

Resource cleanup failures occur when system resources like file handles, database connections, memory, or network sockets are not properly released. This leads to resource exhaustion, memory leaks, and eventual system failure. Common in file I/O, database operations, and network programming.

## Why It Happens

1. **Forgetting to Close Resources**: Not calling `.close()` or `free()`
2. **Early Returns**: Returning before cleanup code executes
3. **Exceptions Before Cleanup**: Error thrown before cleanup
4. **Multiple Exit Points**: Cleanup code needed in several places
5. **Not Using Finally**: Cleanup code skipped if exception occurs
6. **Circular References**: Objects keep each other alive

## Symptoms

- Application slows down over time
- "Too many open files" error
- Database connection pool exhaustion
- Memory usage constantly grows
- Application crashes after running long time
- Resource limits exceeded

## Examples in Multiple Languages

### Python
```python
# WRONG: File not closed
f = open("data.txt")
data = f.read()
process(data)
# If process() raises exception, file never closed!

# CORRECT: Use context manager
with open("data.txt") as f:
    data = f.read()
    process(data)
# File automatically closed

# WRONG: Early return skips cleanup
def read_file(filename):
    f = open(filename)
    data = f.read()
    if len(data) == 0:
        return None  # File never closed!
    return process(data)

# CORRECT: Cleanup before returning
def read_file(filename):
    f = open(filename)
    try:
        data = f.read()
        if len(data) == 0:
            return None
        return process(data)
    finally:
        f.close()  # Always closes

# BETTER: Use context manager
def read_file(filename):
    with open(filename) as f:
        data = f.read()
        if len(data) == 0:
            return None
        return process(data)
```

### Java
```java
// WRONG: Resource not closed
public void processDatabase() {
    Connection conn = DriverManager.getConnection(url);
    Statement stmt = conn.createStatement();
    ResultSet rs = stmt.executeQuery("SELECT * FROM users");
    // If exception occurs, resources never closed!
    // Connection pool gets exhausted!
}

// CORRECT: Use try-finally
public void processDatabase() {
    Connection conn = null;
    try {
        conn = DriverManager.getConnection(url);
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM users");
        // Process results
    } finally {
        if (conn != null) {
            conn.close();
        }
    }
}

// BETTER: Use try-with-resources
public void processDatabase() {
    try (Connection conn = DriverManager.getConnection(url);
         Statement stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
        // Process results
        // All resources automatically closed
    } catch (SQLException e) {
        logger.error("Database error", e);
    }
}

// WRONG: Forgetting close on multiple resources
public void copyFile(String source, String dest) {
    FileInputStream in = new FileInputStream(source);
    FileOutputStream out = new FileOutputStream(dest);
    byte[] buffer = new byte[1024];
    int len;
    while ((len = in.read(buffer)) > 0) {
        out.write(buffer, 0, len);
    }
    // If exception: both streams never closed!
}

// CORRECT: Try-with-resources handles multiple
public void copyFile(String source, String dest) {
    try (FileInputStream in = new FileInputStream(source);
         FileOutputStream out = new FileOutputStream(dest)) {
        byte[] buffer = new byte[1024];
        int len;
        while ((len = in.read(buffer)) > 0) {
            out.write(buffer, 0, len);
        }
    } catch (IOException e) {
        logger.error("File copy failed", e);
    }
}
```

### C
```c
// WRONG: Memory not freed
char* read_file(const char* filename) {
    FILE* f = fopen(filename, "r");
    char* data = malloc(1000);
    if (fread(data, 1, 1000, f) == 0) {
        return NULL;  // BUG: data never freed, f never closed!
    }
    fclose(f);
    return data;  // Caller must free!
}

// CORRECT: Clean up before returning
char* read_file(const char* filename) {
    FILE* f = fopen(filename, "r");
    if (f == NULL) {
        return NULL;
    }
    char* data = malloc(1000);
    if (data == NULL) {
        fclose(f);  // Clean up before returning
        return NULL;
    }
    size_t read = fread(data, 1, 1000, f);
    fclose(f);  // Always close
    if (read == 0) {
        free(data);  // Free before returning
        return NULL;
    }
    return data;  // Caller must free!
}

// WRONG: malloc failures not handled
int* buffer = malloc(sizeof(int) * 1000);
memcpy(buffer, source, sizeof(int) * 1000);
// If malloc failed, buffer is NULL!
// If memcpy fails, buffer never freed!

// CORRECT: Check return values
int* buffer = malloc(sizeof(int) * 1000);
if (buffer == NULL) {
    return -1;
}
if (memcpy(buffer, source, sizeof(int) * 1000) == NULL) {
    free(buffer);
    return -1;
}
// Use buffer
free(buffer);
```

### C++
```cpp
// WRONG: Not using RAII
void processFile() {
    std::ifstream file("data.txt");
    std::string line;
    // ...
    // If exception: stream might not close properly
}

// CORRECT: RAII pattern (automatic cleanup)
void processFile() {
    std::ifstream file("data.txt");  // Destructor closes
    std::string line;
    getline(file, line);
    // file automatically closes when goes out of scope
}

// WRONG: Manual memory not cleaned
void processData() {
    int* arr = new int[1000];
    // ... process ...
    if (error) {
        return;  // BUG: arr never deleted!
    }
    delete[] arr;
}

// CORRECT: Use smart pointers
void processData() {
    std::unique_ptr<int[]> arr(new int[1000]);
    // ... process ...
    if (error) {
        return;  // arr automatically deleted
    }
    // arr automatically deleted when goes out of scope
}

// WRONG: Database connection not released
class DataProcessor {
    DatabaseConnection* conn;
    
    void process() {
        conn = new DatabaseConnection();
        // ... if exception, conn never deleted!
    }
};

// CORRECT: Use smart pointer
class DataProcessor {
    std::unique_ptr<DatabaseConnection> conn;
    
    void process() {
        conn = std::make_unique<DatabaseConnection>();
        // conn automatically deleted when DataProcessor destroyed
    }
};
```

## How to Fix

1. **Use Finally Blocks**: Ensure cleanup always happens
2. **Use Try-With-Resources**: Java 7+, Python context managers
3. **Use RAII**: C++, automatic cleanup via destructors
4. **Use Smart Pointers**: Instead of manual memory management
5. **Check Return Values**: Malloc, open, etc. can fail
6. **Close In Exception Handler**: Catch and cleanup
7. **Single Exit Point**: Or cleanup at every return
8. **Avoid Circular References**: Can prevent garbage collection

## Prevention Tips

- **Make cleanup automatic**: Use language features for this
- **Never manually manage if language provides automation**: Use context managers, RAII
- **Check return values**: File open, malloc, etc. can fail
- **Run with resource monitoring**: Monitor file handles, memory
- **Enable leak detectors**: Valgrind (C/C++), ASan
- **Test with resource exhaustion**: What happens at limits
- **Long-running tests**: Show if resources leak over time
- **Code review cleanup**: Especially in error paths

## Real-World Example

```java
// Web server connection leak
public class UserService {
    public void uploadUserData(int userId, File data) {
        Connection conn = pool.getConnection();  // Get from pool
        
        InputStream in = new FileInputStream(data);  // Open file
        String sql = "INSERT INTO users (id, data) VALUES (?, ?)";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setInt(1, userId);
        stmt.setBlob(2, in);
        stmt.execute();
        
        // BUG: If exception, nothing is closed!
        // After many requests: connection pool exhausted!
    }
}

// FIXED: Try-with-resources
public void uploadUserData(int userId, File data) {
    try (Connection conn = pool.getConnection();
         InputStream in = new FileInputStream(data);
         PreparedStatement stmt = conn.prepareStatement(
             "INSERT INTO users (id, data) VALUES (?, ?)")) {
        
        stmt.setInt(1, userId);
        stmt.setBlob(2, in);
        stmt.execute();
    } catch (SQLException | IOException e) {
        logger.error("Upload failed for user " + userId, e);
    }
    // All resources automatically closed
}
```

## Resource Cleanup Checklist

✓ File handles (.close(), finally, or context manager)  
✓ Database connections (return to pool, finally)  
✓ Network sockets (.close() in finally)  
✓ Memory allocation (free, delete, smart pointers)  
✓ Locks (unlock in finally)  
✓ Transactions (rollback on error)  
✓ Temporary objects (clean up)  
✓ Event listeners (unsubscribe)

## Related Bugs

- **Exception Handling** (#019): Cleanup in exception path
- **Memory Leak** (#006): Heap memory not freed
- **Infinite Loop** (#007): Resource acquisition in loop

## Key Takeaways

✅ Use automatic cleanup mechanisms (finally, context managers, RAII)  
✅ Never rely on manual cleanup alone  
✅ Check all return values from resource functions  
✅ Cleanup in exception paths too  
✅ Use try-with-resources (Java 7+)  
✅ Use context managers (Python with statement)  
✅ Use RAII and smart pointers (C++)  
✅ Test resource exhaustion scenarios
