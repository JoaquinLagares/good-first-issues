# Bug #001: The Backwards Stream

### The Goal
Print "Welcome to C++!" to the console.

### The Symptoms
Compilation error: `error: no match for 'operator>>' in 'std::cout >> "Welcome to C++!"'`.

### Hints
1. `std::cout` uses the insertion operator `<<`.
2. Think of `<<` as "putting into the stream".
