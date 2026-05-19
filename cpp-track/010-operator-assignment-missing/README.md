# Bug #010: The Assignment Catastrophe

### The Goal
Safely assign one Counter object to another.

### The Symptoms
The program crashes with a "double delete" error during cleanup.

### Hints
1. Assignment (`=`) is different from copying in constructors.
2. You need to implement the copy assignment operator: `Counter& operator=(const Counter& other)`.
3. In the assignment operator, deallocate the old memory before allocating new memory.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
