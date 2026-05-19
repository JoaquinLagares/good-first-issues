# Bug #004: The Persistent Leak

### The Goal
Allocate an array, use it, and clean up.

### The Symptoms
While the program runs fine, it's wasting RAM. In a large program, this would eventually cause a crash.

### Hints
1. For every `new`, there must be a `delete`.
2. For an array (`new[]`), use `delete[] data;`.
 flagship.
 flagship.
 flagship.
 flagship.
