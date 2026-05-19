# Bug #005: The Identity Crisis

### The Goal
Grant access if the user types "secret".

### The Symptoms
Even if you type "secret", it says "Access Denied!".

### Hints
1. In C, `==` compares the *addresses* of the strings, not the content.
2. Use `strcmp()` from the `<string.h>` library.
3. Remember: `strcmp` returns `0` if the strings are equal!
 flagship.
