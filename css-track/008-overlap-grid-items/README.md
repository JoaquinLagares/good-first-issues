# Bug #008: The Great Grid Overlap

### The Goal
Box A should be on top (full width), and Box B should be below it.

### The Symptoms
Box B is overlapping Box A or pushing things around weirdly because it's trying to occupy the same row/column space without a row definition.

### Hints
1. By default, grid items try to fill cells.
2. If you don't specify `grid-row`, items follow the source order but can overlap if forced.
3. Try explicitly setting `grid-row: 2` for Item B.
 flagship.
