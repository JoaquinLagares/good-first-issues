# Bug #021: Iterator Invalidation

## What is it?

Iterator invalidation occurs when modifying a collection while iterating over it, causing the iterator to become invalid or point to wrong elements. This leads to skipped elements, exceptions, or undefined behavior. Common in C++ STL, Java collections, and Python iterators.

## Why It Happens

1. **Modifying During Iteration**: Adding/removing elements changes collection structure
2. **Reallocation**: Vector resize invalidates iterators in C++
3. **Stale Pointers**: Iterator points to deleted or moved memory
4. **Concurrent Modification**: Multiple threads changing collection
5. **Position Shift**: Removing element shifts remaining elements

## Symptoms

- `ConcurrentModificationException` (Java)
- Segmentation fault (C++)
- Elements skipped during iteration
- Iterator points to wrong elements
- Program crash mid-iteration
- Data corruption

## Examples in Multiple Languages

### Python
```python
# WRONG: Modifying list during iteration
for item in my_list:
    if item > 5:
        my_list.remove(item)  # RuntimeError!

# CORRECT: Iterate over copy
for item in list(my_list):  # Create copy
    if item > 5:
        my_list.remove(item)  # Modifies original

# CORRECT: Collect items first
to_remove = [item for item in my_list if item > 5]
for item in to_remove:
    my_list.remove(item)

# WRONG: Dictionary iteration with modification
for key in data:
    if data[key] > 100:
        del data[key]  # RuntimeError!

# CORRECT: Iterate over keys copy
for key in list(data.keys()):
    if data[key] > 100:
        del data[key]
```

### Java
```java
// WRONG: Modifying collection during iteration
List<Integer> numbers = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
for (Integer n : numbers) {
    if (n > 3) {
        numbers.remove(n);  // ConcurrentModificationException!
    }
}

// CORRECT: Use iterator's remove method
Iterator<Integer> it = numbers.iterator();
while (it.hasNext()) {
    Integer n = it.next();
    if (n > 3) {
        it.remove();  // Safe removal
    }
}

// CORRECT: Collect and remove separately
List<Integer> toRemove = new ArrayList<>();
for (Integer n : numbers) {
    if (n > 3) {
        toRemove.add(n);
    }
}
numbers.removeAll(toRemove);

// WRONG: Map iteration with modification
Map<String, Integer> map = new HashMap<>();
for (String key : map.keySet()) {
    if (map.get(key) > 100) {
        map.remove(key);  // ConcurrentModificationException!
    }
}

// CORRECT: Iterator or stream
map.keySet().removeIf(key -> map.get(key) > 100);
```

### C++
```cpp
// WRONG: Inserting invalidates iterators
std::vector<int> vec = {1, 2, 3, 4, 5};
for (auto it = vec.begin(); it != vec.end(); ++it) {
    if (*it == 3) {
        vec.insert(it, 0);  // Invalidates iterator!
    }
}

// CORRECT: Use returned iterator
std::vector<int> vec = {1, 2, 3, 4, 5};
for (auto it = vec.begin(); it != vec.end(); ) {
    if (*it == 3) {
        it = vec.insert(it, 0);  // insert returns new iterator
        ++it;  // Move past inserted element
    } else {
        ++it;
    }
}

// WRONG: Erasing invalidates iterator
std::vector<int> vec = {1, 2, 3, 4, 5};
for (auto it = vec.begin(); it != vec.end(); ++it) {
    if (*it > 3) {
        vec.erase(it);  // Invalidates iterator!
    }
}

// CORRECT: Use returned iterator from erase
std::vector<int> vec = {1, 2, 3, 4, 5};
for (auto it = vec.begin(); it != vec.end(); ) {
    if (*it > 3) {
        it = vec.erase(it);  // erase returns next iterator
    } else {
        ++it;
    }
}

// WRONG: Resizing vector invalidates all iterators
std::vector<int> vec = {1, 2, 3};
auto it = vec.begin();
vec.push_back(4);  // Might reallocate, invalidates it!
std::cout << *it;  // Undefined behavior!

// CORRECT: Understand vector reallocations
std::vector<int> vec = {1, 2, 3};
auto it = vec.begin();
vec.push_back(4);  // Safe if capacity > size
std::cout << *it;  // If reallocation happened, undefined!
```

### JavaScript
```javascript
// WRONG: Modifying array during forEach
arr.forEach((item, index) => {
    if (item > 5) {
        arr.splice(index, 1);  // Modifies underlying array
    }
});
// Behavior is unpredictable

// CORRECT: Filter instead
const filtered = arr.filter(item => item <= 5);

// CORRECT: Use for loop with caution
for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] > 5) {
        arr.splice(i, 1);  // Iterate backwards to avoid issues
    }
}
```

## How to Fix

1. **Collect Changes First**: Build list of modifications before applying
2. **Use Iterator Remove**: Use safe removal methods
3. **Iterate Over Copy**: Create copy before modifying
4. **Iterate Backwards**: Avoids index shifts for forward iteration
5. **Use Functional Methods**: map, filter, reduce instead of loops
6. **Use Returned Iterators**: C++ returns new iterator from insert/erase
7. **Synchronize Access**: Locks for concurrent modification
8. **Use Concurrent Collections**: Java's CopyOnWriteArrayList

## Prevention Tips

- **Assume iterators are invalid after modification**: Don't rely on old iterators
- **Collect modifications first**: Use separate lists for removals
- **Use language utilities**: removeIf, filter, etc.
- **Iterate backwards**: For removal operations
- **Enable compiler warnings**: Some can detect iterator issues
- **Test concurrent scenarios**: What if modified during iteration
- **Code review**: Specifically look for iterator invalidation
- **Use const iteration**: When you don't need modification

## Real-World Example

```java
// Cache cleanup bug
public void removeExpiredEntries() {
    // BUG: Concurrent modification exception
    for (String key : cache.keySet()) {
        CacheEntry entry = cache.get(key);
        if (entry.isExpired()) {
            cache.remove(key);  // Exception!
        }
    }
}

// FIXED: Use iterator
public void removeExpiredEntries() {
    Iterator<String> it = cache.keySet().iterator();
    while (it.hasNext()) {
        String key = it.next();
        CacheEntry entry = cache.get(key);
        if (entry.isExpired()) {
            it.remove();  // Safe
        }
    }
}

// FIXED: Use removeIf
public void removeExpiredEntries() {
    cache.entrySet().removeIf(entry -> entry.getValue().isExpired());
}
```

## Related Bugs

- **Exception Handling** (#019): Handle concurrent modification exceptions
- **Resource Cleanup** (#020): Clean up proper iterators
- **Race Condition** (#009): Multiple threads modifying collection

## Key Takeaways

✅ Never modify collection while iterating  
✅ Collect modifications first, apply after  
✅ Use iterator's remove() method if available  
✅ Understand which operations invalidate iterators  
✅ Iterate over copies if need to modify  
✅ Use functional methods (map, filter) when possible  
✅ Be careful with concurrent collections  
✅ C++: Use returned iterator from insert/erase
