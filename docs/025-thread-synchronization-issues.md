# Bug #025: Thread Synchronization Issues

## What is it?

Thread synchronization issues occur in multithreaded programs when multiple threads access shared data without proper coordination. This causes race conditions, deadlocks, and data corruption. These are notoriously difficult bugs to reproduce and debug.

## Why It Happens

1. **Data Races**: Two threads accessing same data without locks
2. **Deadlock**: Threads waiting for each other infinitely
3. **Race Conditions**: Order-dependent behavior that's unpredictable
4. **Volatile Misunderstanding**: Not using volatile for shared mutable state
5. **Improper Locking**: Locks not held long enough or held incorrectly
6. **Lost Updates**: Multiple threads modifying same variable

## Symptoms

- Intermittent failures (Heisenbug)
- Different results on different runs
- Data corruption
- Program hangs (deadlock)
- Memory visibility issues
- Crashes in multithreaded sections

## Examples in Multiple Languages

### Java
```java
// WRONG: Shared mutable state without synchronization
class Counter {
    private int count = 0;
    
    public void increment() {
        count++;  // Data race! Not atomic!
    }
    
    public int getCount() {
        return count;
    }
}

// Two threads incrementing: race condition
Counter counter = new Counter();
Thread t1 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) counter.increment();
});
Thread t2 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) counter.increment();
});
// Final count might be 1600 or 1800 instead of 2000

// CORRECT: Use synchronized or AtomicInteger
class Counter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();  // Atomic operation
    }
    
    public int getCount() {
        return count.get();
    }
}

// WRONG: Improper synchronization
class BankAccount {
    private double balance;
    
    public synchronized void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;  // Not atomic! Check-then-act problem
        }
    }
}

// CORRECT: Synchronize entire operation
class BankAccount {
    private double balance;
    
    public synchronized void withdraw(double amount) {
        // Check and act atomically
        if (balance >= amount) {
            balance -= amount;
        }
    }
}

// WRONG: Deadlock with nested locks
class Account {
    private double balance;
    
    public synchronized void transferTo(Account other, double amount) {
        this.balance -= amount;
        other.deposit(amount);  // Calls synchronized method!
    }
    
    public synchronized void deposit(double amount) {
        this.balance += amount;
    }
}

// Two threads: A.transferTo(B) and B.transferTo(A) = DEADLOCK

// CORRECT: Avoid nested locks or use consistent ordering
class Account {
    private double balance;
    
    public void transferTo(Account other, double amount) {
        // Always lock in consistent order to prevent deadlock
        Account first = this.accountId < other.accountId ? this : other;
        Account second = this.accountId < other.accountId ? other : this;
        
        synchronized (first) {
            synchronized (second) {
                this.balance -= amount;
                other.balance += amount;
            }
        }
    }
}
```

### Python
```python
# WRONG: Shared state without lock
import threading

counter = 0

def increment():
    global counter
    for _ in range(1000):
        counter += 1  # Race condition!

threads = [threading.Thread(target=increment) for _ in range(2)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(counter)  # Might be 1234 instead of 2000

# CORRECT: Use Lock
import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(1000):
        with lock:
            counter += 1

# Now counter always equals 2000

# WRONG: Not using Lock for mutable shared state
class Counter:
    def __init__(self):
        self.value = 0
    
    def increment(self):
        self.value += 1

counter = Counter()

def worker():
    for _ in range(1000):
        counter.increment()

# Multiple threads: race condition

# CORRECT: Use Lock or Queue for thread-safe access
from threading import Lock

class ThreadSafeCounter:
    def __init__(self):
        self.value = 0
        self.lock = Lock()
    
    def increment(self):
        with self.lock:
            self.value += 1
```

### C++
```cpp
// WRONG: Shared mutable state without synchronization
#include <thread>
#include <vector>

int counter = 0;

void increment() {
    for (int i = 0; i < 1000; i++) {
        counter++;  // Data race!
    }
}

// Main
std::vector<std::thread> threads;
for (int i = 0; i < 2; i++) {
    threads.emplace_back(increment);
}
for (auto& t : threads) {
    t.join();
}
// counter might not be 2000

// CORRECT: Use mutex
#include <mutex>

int counter = 0;
std::mutex counter_mutex;

void increment() {
    for (int i = 0; i < 1000; i++) {
        {
            std::lock_guard<std::mutex> lock(counter_mutex);
            counter++;
        }
    }
}

// Or use atomic
#include <atomic>

std::atomic<int> counter(0);

void increment() {
    for (int i = 0; i < 1000; i++) {
        counter++;  // Atomic operation
    }
}
```

## How to Fix

1. **Use Locks/Mutexes**: Protect shared data access
2. **Use Atomic Types**: For simple shared state
3. **Use Immutable Objects**: No synchronization needed
4. **Use Thread-Safe Collections**: Queue, ConcurrentHashMap
5. **Minimize Critical Sections**: Lock held briefly
6. **Consistent Lock Ordering**: Prevent deadlock
7. **Use Higher-Level Constructs**: Executors, channels
8. **Avoid Shared Mutable State**: Prefer message passing

## Prevention Tips

- **Assume everything is shared**: In multithreaded code
- **Don't share mutable state**: Unless absolutely necessary
- **Lock consistently**: Same lock order everywhere
- **Use thread-safe collections**: Don't implement yourself
- **Enable ThreadSanitizer**: Detects data races
- **Test with thread checkers**: Available for most languages
- **Code review**: Multithreading bugs need careful review
- **Stress test**: Run with many iterations to expose races

## Real-World Example

```java
// Session counter bug
public class SessionManager {
    private int activeUsers = 0;  // BUG: No synchronization!
    
    public void userLoggedIn() {
        activeUsers++;  // Race condition
    }
    
    public void userLoggedOut() {
        activeUsers--;  // Race condition
    }
    
    public int getActiveCount() {
        return activeUsers;
    }
}

// Multiple requests simultaneously:
// Real count: 47, Reported count: 43

// FIXED: Use atomic
public class SessionManager {
    private AtomicInteger activeUsers = new AtomicInteger(0);
    
    public void userLoggedIn() {
        activeUsers.incrementAndGet();
    }
    
    public void userLoggedOut() {
        activeUsers.decrementAndGet();
    }
    
    public int getActiveCount() {
        return activeUsers.get();
    }
}
```

## Concurrency Patterns

- **Mutex/Lock**: Exclusive access to resource
- **Semaphore**: Allow N threads to access resource
- **Monitor**: Lock + condition variables
- **Queue**: Thread-safe message passing
- **Atomic**: Lock-free operations on single variable
- **ReadWriteLock**: Many readers, exclusive writers
- **Barrier**: Wait for N threads to reach point

## Related Bugs

- **Memory Leak** (#006): Threads holding onto resources
- **Deadlock**: Subset of synchronization issues
- **Infinite Loop** (#007): Thread waiting infinitely

## Key Takeaways

✅ Synchronize access to shared mutable data  
✅ Use atomic types for simple counters  
✅ Minimize critical sections (lock duration)  
✅ Use consistent lock ordering to prevent deadlock  
✅ Prefer immutable objects or message passing  
✅ Use thread-safe collections from library  
✅ Test thoroughly with stress tests  
✅ Enable race condition detection tools
