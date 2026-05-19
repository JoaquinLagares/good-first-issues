# Bug #002: The Pointer Pitfall

### The Goal
Read an integer from the user and print it back.

### The Symptoms
The program crashes (Segfault) when you enter a value, or prints garbage numbers.

### Hints
1. `scanf` needs to know *where* in memory to store the value.
2. Use the address-of operator `&` before the variable name.
