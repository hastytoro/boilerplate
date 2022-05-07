## Broken rectangles

Here we use a CSS variable called `--box-width` that holds a width value for all rectangles. We change and divide that measurement for the cells individually.

Let’s define a selector that will target the odd "numbered" child items within our grid container. So if we want target everything in the first column of a two columned container, we select odd children.

NOTE: Using a `:nth-of-type()` selector allows us to select one or more elements based on their order, according to a formula or we could use keywords like odd or even.

**Pseudo-classes** are used to style content based on its relationship with parent and sibling elements. We don’t want to change any content row/column structure position, that is fine.

**Important:** we looking to change the position of the child elements within the cells so we use properties like `justify-self`. We selecting the child elements themselves not the items parent with `justify-items` or the structure of the grid that would be setup with `justify-content`.

Here we change the grid structure being its content vertically using the `align-content` property. Finally to give that staggered appearance we can `calc()` the width of each cell, differently.

```
.box.one {
  background-color: pink;
  width: calc(var(--box-width) * 0.25);
}
.box.two {
  background-color: pink;
  width: calc(var(--box-width) * 0.75);
}
.box.three {
  background-color: lavender;
  width: calc(var(--box-width) * 0.5);
}
.box.four {
  background-color: lavender;
  width: calc(var(--box-width) * 0.5);
}
.box.five {
  background-color: honeydew;
  width: calc(var(--box-width) * 0.75);
}
.box.six {
  background-color: honeydew;
  width: calc(var(--box-width) * 0.25);
}
```
