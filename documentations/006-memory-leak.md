# Bug #006: Memory Leak

## What is it?

A memory leak occurs when a program allocates memory but fails to release it back to the system. Over time, this wastes memory and can cause the program to slow down, use excessive RAM, or eventually crash.

## Why It Happens

- Forgetting to `free()` or `delete` allocated memory
- Exception thrown before cleanup code runs
- Losing reference to allocated memory
- Circular references in objects
- Not using automatic memory management when available
- Allocating in a loop without deallocation

## Symptoms

- Program uses more and more memory over time
- Performance gradually degrades
- "Out of memory" errors
- System becomes slow and unresponsive
- Long-running programs eventually crash
- Memory usage increases even when idle

## Examples

### C
```c
// WRONG: Memory leak - allocated but never freed
void processData() {
    int* buffer = malloc(1000 * sizeof(int));
    // ... use buffer ...
    // Oops! Forgot to free it
}

// CORRECT: Always free allocated memory
void processData() {
    int* buffer = malloc(1000 * sizeof(int));
    // ... use buffer ...
    free(buffer);  // Important!
    buffer = NULL;  // Good practice
}

// WRONG: Leak if exception happens
void process() {
    int* data = malloc(100);
    riskyFunction();  // If this throws, memory leaks!
    free(data);
}

// CORRECT: Use try-finally or RAII pattern
void process() {
    int* data = malloc(100);
    int success = 0;
    if (setjmp(...) == 0) {
        riskyFunction();
        success = 1;
    }
    free(data);  // Always runs
}
```

### C++
```cpp
// WRONG: Memory leak without delete
class Manager {
    int* data;
public:
    Manager() {
        data = new int[100];
    }
    // Forgot destructor!
};

// CORRECT: Destructor releases memory
class Manager {
    int* data;
public:
    Manager() {
        data = new int[100];
    }
    ~Manager() {  // Destructor
        delete[] data;
    }
};

// CORRECT: Better - use smart pointers
class Manager {
    std::unique_ptr<int[]> data;
public:
    Manager() {
        data = std::make_unique<int[]>(100);
        // Automatically freed when object destroyed
    }
};
```

### Python
```python
# Python handles memory automatically with garbage collection
# But you can still have logical leaks with circular references

# WRONG: Circular reference prevents garbage collection
class Node:
    def __init__(self):
        self.parent = None
        self.child = None

parent = Node()
child = Node()
parent.child = child
child.parent = parent
del parent
del child
# Memory leaks because of circular reference

# CORRECT: Break circular references
parent.child = None
child.parent = None

# CORRECT: Use weakref for circular references
import weakref
class Node:
    def __init__(self):
        self.parent = None
        self.child = None
        
parent = Node()
child = Node()
parent.child = child
child.parent = weakref.ref(parent)  # Weak reference
```

## How to Fix

1. **For every allocation (malloc, new), have a deallocation (free, delete)**
2. **Use smart pointers** (C++): `std::unique_ptr`, `std::shared_ptr`
3. **Use garbage-collected languages** when appropriate
4. **Use RAII pattern** - Release as soon as object is destroyed
5. **Use try-finally blocks** - Ensure cleanup happens
6. **Break circular references** - Set to None/null when done
7. **Use memory profilers** - Find leaks before production

## Prevention Tips

- Use memory profiling tools: Valgrind (Linux), Dr. Memory (Windows)
- Enable compiler warnings for potential leaks
- Use static analysis tools
- Write unit tests that check memory usage
- Use languages with automatic memory management when possible
- Always pair allocation with deallocation
- Use smart pointers instead of raw pointers
- Document memory ownership (who owns this pointer?)
- Don't allocate in loops without deallocating
- Use RAII idiom in C++
