## Newspaper Cards

We require columns of equal width/height as our viewport (shrink/grow) to scale images. Remember default behaviour for <img> are at full intrinsic size. They also overflow when the viewport is minimized to the point “touching” the edge of the image(s).

A good place to start would be targeting the <img> within the article(s). Setting the img { width: 100% } solves the biggest problem that ensures the image scales occurring to its container. This setting ensures that the <img> scales with the column, and the column is then scaled based on the parent.

```
.card img {
  display: block;
  width: 100%;
  object-fit: cover;
}
```

### The next requirement is to size the images based on the Flexbox.

Let’s change the <main> `display: flex` as it holds children we want to implement in a **Flexbox** layout. And just like that we have introduced 3 columns because the <main> container has x3 <article> elements that by default (row) are now side-by-side everything fits, and there is no overflow.

A common problem with asymmetric image, is that the (content) is of different sizes. There isn’t enough space to fit them equally because each of these columns are big so it has to (shrink) them. Shrinking them according to their intrinsic sizes. Now if we want them to be equally sized, well that is where our new `flex` shorthand can assist. We can target all flex items being the <article> element(s) and then set `article { flex: 1 }`.

> NOTE: why just setting flex-grow: 1 would not work is because you require those other properties provided by the flex shorthand that have default settings for growing, shrinking and basis.

Additionally `flex: 1` essentially is like resetting all width to `0px`. It looks at how much available space is left-over within the container, to distribute between elements equally.

### Constraints

We've seen how properties like flex-grow, flex-shrink, and flex-basis can be used to control the proportions between siblings in a flex container.

- What if we want to set hard limits, though, rather than ratios?

Fortunately, a familiar set of properties can help: `min-width`/`max-width` and `min-height`/`max-height`as **constraints**.

For example in a `flex-direction: row` container configuration, the `flex-basis` works just like width. That means we can use both the min-width and max-width features to ensure we also respect them as **constraints** also.

You could clamp child items to a minimum width of 75px in a container.

> Effectively we changing the minimum content size to be a hardcoded value.

Rather than relying on the size of the element's children when they shrink, we can also clamp an element(s) growth by using `max-width` as **constraint**. Keep in mind that in a `flex-direction: column` your `max-height` would be used instead. As mentioned the primary axis in that direction is then turned to vertical.
