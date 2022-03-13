## Solution 1: Moving overflow to grid child

We can move the `overflow: auto` property to the grid child directly that can be used as via a in-Flow placeholder <div>. We moving the overflow up to the direct grid child.

Why does this work?

We its likely fr has an exception built-in: if the grid child has `overflow: auto`, it gives the column permission to shrink below the natural width of that element.

```
img {
  display: block;
  /* remove constraint */
  /* width: 100%; */
  height: 200px;
  object-fit: cover;
}

.grid {
  display: grid;
  grid-template-columns: 175px 1fr;
  gap: 16px;
}
/* move overflow to placeholder grid child: */
.placeholder {
  max-width: 100%;
  overflow: auto;
}
.img-list {
  display: flex;
  gap: 16px;
}
```

But this doesn't work recursively: it has to be on the direct grid child, not toward descendant. So we can use a placeholder element to assist.

## Solution 2: Setting a minimum width

We've specified that our second column should have a width of `1fr`. With a clever use of `minmax()` we can specify that we're **OK** with the column shrinking below the child's width completely to zero.

By using 0 in `minmax(here, 1fr)`, we're telling the column that it can be as small as possible. And when the cell is growing it can be as large as possible, represented by the `1fr` unit. Remember to remove the width by 100% at the img definition.

The minimum size of an `fr` is auto and grid looks at the **minimum content size** of the item. If the item has a size like a given width or has something like an <img> that has an intrinsic size. Then the **minimum content size** might be much bigger than the share of available space `1fr` would give you.

- It’s easy to think of `1fr` as being one part of the space in the grid container.
- When it is really one part of the available space **left-over**.
- If there is space to grow, the track will grow from that **minimum content size** and assign space.
- Using `minmax()` is the best thing to do if you want to forcibly have equal width tracks.

```

.grid {
  display: grid;
  grid-template-columns: 175px minmax(0, 1fr);
  gap: 16px;
}
.img-list {
  display: flex;
  gap: 16px;
  max-width: 100%;
  overflow: auto;
}
```

Above means you want the track to have a min-content size of 0 in `minmax(here, 1fr)`, potentially in that situation you end up with overflows.
