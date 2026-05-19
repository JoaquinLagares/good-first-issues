# Bug #002: The Missing Prefix

### The Goal
Greet the user using C++ strings and streams.

### The Symptoms
Compiler errors like: `'string' was not declared in this scope` or `'cout' was not declared in this scope`.

### Hints
1. Standard library components are inside the `std` namespace.
2. Use `std::` before `string`, `cout`, and `endl`.
3. Alternatively, you can add `using namespace std;` at the top (though it's better practice to prefix).
 flagship.
