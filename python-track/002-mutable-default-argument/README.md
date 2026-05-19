# Bug #002: The Persistent Default

### The Goal
Add items to a list and return the list.

### The Symptoms
Each call unexpectedly accumulates items from previous calls. The list is never empty.

### Hints
1. Mutable default arguments (lists, dicts, sets) are created once when the function is defined, not each time it's called.
2. Use `None` as the default and create a new list inside the function: `if items is None: items = []`.
 flagship.
