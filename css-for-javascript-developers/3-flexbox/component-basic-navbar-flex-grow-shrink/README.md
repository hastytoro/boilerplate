# Growing and Shrinking

There two important sizing constraints that determine distribution of space within our Flexbox:

1. **minimum content size** - the smallest a flex item can get without its own content overflowing.
2. **hypothetical size** - a default size an element would be if not for any act upon it by other forces.

## Key properties and constraints

- Setting `width` in a flex row (or height in a flex column) sets the hypothetical size. It isn't a guarantee, it's a suggestion.
- `flex-basis` has the same effect as width in a flex row (height in a column). You can use them interchangeably, but `flex-basis` will win if there's a conflict.
- `flex-grow` will allow a child to consume any excess space in the container. It has no effect if there isn't any excess space.
- `flex-shrink` will pick which item to consume space from, if the container is too small. It has no effect if there is any excess space.
- `flex-shrink` can't shrink an item below its minimum content size. If all the items are below their minimum content size, this property has no effect.

> Correction: There is one more difference between width and flex-basis. Your `flex-basis` can't scale an element below its minimum content size, but `width` can.
