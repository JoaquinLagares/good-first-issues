# Bug #006: The Partial Cleanup

### The Goal
Properly delete a Dog object through an Animal pointer.

### The Symptoms
When you delete the object, only the Animal destructor runs. The Dog destructor is skipped, leaking Dog-specific resources.

### Hints
1. When using polymorphism (inheritance + virtual functions), mark the base class destructor as `virtual`.
2. This ensures that the correct destructor is called based on the actual object type, not the pointer type.
 flagship.
 flagship.
 flagship.
 flagship.
 flagship.
