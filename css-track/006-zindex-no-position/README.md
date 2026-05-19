# Bug #006: The Powerless Z-Index

### The Goal
The red box (`box-1`) should overlap the blue box (`box-2`).

### The Symptoms
The blue box is currently sitting on top of the red box, despite the red box having a `z-index` of 10.

### Hints
1. `z-index` ONLY works on elements that have a `position` value other than `static`.
2. Try adding `position: relative;` to the red box.
