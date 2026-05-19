# Bug #008: The ID Identity Crisis

### The Goal
Both titles should be uniquely identifiable, and IDs must be unique per page.

### The Symptoms
Standard HTML rules say IDs must be unique. The CSS or JS trying to target "Section Two" might fail or behave unexpectedly because "Page One" also has the same ID.

### Hints
1. IDs are unique identifiers. Classes are for groups.
2. Change one of the IDs to something unique (e.g., `secondary-title`).
