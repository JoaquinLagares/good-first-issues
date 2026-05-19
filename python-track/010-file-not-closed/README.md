# Bug #010: The Unclosed Handle

### The Goal
Read from a file and print its contents.

### The Symptoms
The file remains open and locked. If you try to modify or delete it, you may get a "permission denied" error. In long-running programs, this causes resource leaks.

### Hints
1. Always close files after you're done with them: `file.close()`.
2. Better yet, use a context manager (with statement): `with open("data.txt", "r") as file: content = file.read()`.
3. The `with` statement automatically closes the file when done.
 flagship.
 flagship.
 flagship.
