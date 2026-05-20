# Bug #009: Race Condition

## What is it?

A race condition occurs when multiple threads or processes access and modify shared data concurrently without proper synchronization. The outcome depends on the order of execution (which "races" fastest), leading to unpredictable results.

## Why It Happens

- Multiple threads accessing same variable/resource
- No locks or synchronization mechanisms
- Assumption that operations are atomic (indivisible)
- Forgetting that simple operations aren't always atomic
- Complex multi-threaded logic without proper coordination

## Symptoms

- Behavior differs between runs
- Intermittent crashes or data corruption
- Values appear to change unexpectedly
- Tests pass sometimes but fail other times
- Results correct in single-threaded but wrong with threads
- Performance issues due to unexpected contention

## Examples

### Python - Race Condition
```python
# WRONG: Race condition
import threading

counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1  # NOT atomic!

# Each thread does this:
# Read counter
# Add 1
# Write counter
# These can interleave!

thread1 = threading.Thread(target=increment)
thread2 = threading.Thread(target=increment)
thread1.start()
thread2.start()
thread1.join()
thread2.join()
print(counter)  # Expected: 200000, Actual: ~150000 (random)

# CORRECT: Use locks
import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100000):
        with lock:  # Acquire lock
            counter += 1  # Safe!
        # Lock automatically released

thread1 = threading.Thread(target=increment)
thread2 = threading.Thread(target=increment)
thread1.start()
thread2.start()
thread1.join()
thread2.join()
print(counter)  # Correctly: 200000
```

### Java - Race Condition
```java
// WRONG: Race condition
class Counter {
    private int value = 0;
    
    public void increment() {
        value++;  // Not atomic!
    }
    
    public int getValue() {
        return value;
    }
}

// With multiple threads, results are unpredictable

// CORRECT: Use synchronized
class Counter {
    private int value = 0;
    
    public synchronized void increment() {
        value++;  // Only one thread at a time
    }
    
    public synchronized int getValue() {
        return value;
    }
}

// CORRECT: Use atomic types
import java.util.concurrent.atomic.AtomicInteger;
class Counter {
    private AtomicInteger value = new AtomicInteger(0);
    
    public void increment() {
        value.incrementAndGet();  // Thread-safe
    }
    
    public int getValue() {
        return value.get();
    }
}
```

### JavaScript - Race Condition (async)
```javascript
// WRONG: Race condition with async operations
let data = null;

async function loadData() {
    let result = await fetch('/api/data');
    data = result;  // Race condition!
}

// If loadData() called twice quickly:
loadData();  // Request 1 starts
loadData();  // Request 2 starts
// Whichever finishes last sets 'data'
// But code might expect Request 1's result

// CORRECT: Use Promise or async/await properly
let loadingPromise = null;

async function loadData() {
    if (loadingPromise) {
        return loadingPromise;  // Reuse in-flight request
    }
    
    loadingPromise = fetch('/api/data');
    let result = await loadingPromise;
    return result;
}

// CORRECT: Use async/await with proper error handling
class DataStore {
    constructor() {
        this.data = null;
        this.loading = false;
    }
    
    async loadData() {
        if (this.loading) return this.data;  // Already loading
        
        this.loading = true;
        try {
            let result = await fetch('/api/data');
            this.data = result;
        } finally {
            this.loading = false;
        }
        return this.data;
    }
}
```

## How to Fix

1. **Identify shared resources** - what data is accessed by multiple threads?
2. **Use locks/mutexes** - synchronize access
3. **Use atomic operations** - for simple operations
4. **Use thread-safe data structures** - when available
5. **Use immutable data** - can't race condition on immutable
6. **Minimize critical sections** - lock only what's necessary
7. **Avoid deadlocks** - always acquire locks in same order

## Prevention Tips

- Assume anything shared between threads needs synchronization
- Use thread-safe libraries and classes
- Use higher-level abstractions (queues, message passing)
- Avoid shared mutable state when possible
- Use const/immutable keywords
- Test with many threads and iterations
- Use tools like ThreadSanitizer to detect races
- Use static analysis tools
- Document thread safety
- Be very careful with timing-sensitive code
- Use synchronization primitives correctly
- Never share raw pointers/references between threads without protection
