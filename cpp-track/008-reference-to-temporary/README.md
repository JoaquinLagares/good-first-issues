# Bug #008: The Dangling Reference

### The Goal
Return a message from a function.

### The Symptoms
The program might crash or print garbage. Behavior is unpredictable (undefined behavior).

### Hints
1. Never return a reference to a local variable.
2. Local variables are destroyed when the function exits.
3. Either return by value (`std::string`) or ensure the object outlives the function.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
