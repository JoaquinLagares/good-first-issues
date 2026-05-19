# Bug #009: The Object Eraser

### The Goal
Save the user object to local storage and retrieve the name later.

### The Symptoms
When you load the profile, it says "Loaded: undefined". If you check local storage, the value is just `[object Object]`.

### Hints
1. LocalStorage cannot store actual JavaScript objects.
2. You must convert the object to a string using `JSON.stringify()` before saving.
3. Don't forget to use `JSON.parse()` when you load it back!
 flagship.
