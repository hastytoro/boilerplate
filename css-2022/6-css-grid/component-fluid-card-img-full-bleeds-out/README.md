## Full Bleeding Layouts

A common blog layout involves a single, centered column of text. Earlier in the Flow layout we learned about a placeholder max-width wrapper utility <div> that helps us with centering.

```
/* utility <div> with auto margin: */
.max-width-container {
  max-width: 50%;
  padding: 32px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: ...
}
```

Our utility wrapper is a solid approach, but it locks us in. Every child that will be in-Flow is constrained by that container. What if we want only certain children to "break free", and fill the entire window width? Having an element stretch from edge to edge is known as a "full-bleed" element. This term is borrowed from the publishing world when magazine ads would be printed right to the edge of the page. At first this seems like an impossible problem.

Re-cap: If our child is (in-flow) it will be bound by its **containing block** in this case the container. And if we take it (out-of-flow) it will break our **Flow** layout resulting in elements overlapping. Fortunately **Grid** Layout offers a very clever solution to this problem.

```
/* grid configuration: */
.wrapper {
  display: grid;
  grid-template-columns:
    1fr min(30ch, 100%) 1fr;
}

.wrapper > * {
  grid-column: 2;
}
.full-bleed {
  grid-column: 1 / -1;
}
```

Our left column takes up `1fr`. The center content column takes up a range between `min(30ch, 100%)`. The right column takes up `1fr`.

The `ch` unit is equal to the width of the 0 character, in the current font. Let's assume that in the current situation the first zero '0' character is the default 15px wide. This means a `30ch` value translates to 450px. That 450-pixel size is too wide to fit on smaller mobile displays.

So we have the `min()` function that clamps a value so that it never grows above 100% of available space.

**Mobile** phones say 375px-wide display our center column will be around 375px wide, not 450px. So that smaller size will be represented by the 100% parameter.

Lastly our left and right-side columns will share whatever space remains as they assigned the `1fr` unit. Like auto margins, this is a clever way to make sure the middle column is centered.

**Desktop** displays say 750px-wide would see our center column eat up 450px of space, so 200px would be left over. Because both side columns consume `1fr`, each side column would take 100px, pushing the middle column into the center of the screen.

### Column assignments

As we start adding children to this grid they'll be assigned into available cells. However, that doesn't work for us: we want all of our content to be assigned to that middle column by default!
That's where this trick comes in: `.wrapper > _ { grid-column: 2 }`.

The asterisk (\*) is a wildcard: it matches everything. This means that every child we pop into this grid will be lined up inside the 2nd column. See left illustration.

Every new child will create its own implicit row and occupy the center column.

### Full-bleed children

Finally, we need a way to "opt in" to the full-bleed behaviour! See right illustration above. That's where this fella comes in: `.full-bleed { grid-column: 1 / -1 }`.

Any child that applies that class will stretch from the first column line to the last.

This can lead to some very tall images, on very wide screens, so it’s best to combine it with a fixed height and an `object-fit` to cover.
