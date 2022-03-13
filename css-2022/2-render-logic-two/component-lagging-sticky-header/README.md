## Lagging Sticky Header

A normal sticky header configuration would pin the top: 0px but that has no buffer experience, as soon as a user scrolls, the `<header>` sticks - not fancy ☹. A common mistake would be increasing the gap like top: 16px.

That increased distance, an amount that will stick the `<header>` to. That edge is the distance of your element and the `<body>`. That would increase the height of the `<header>` -- not ideal ☹.

> So if positive numbers increase gap, then negative would produce a lagging amount of space.

The buffering can occur if we stick the `<header>` only when a user scrolls down the `<body>` a specified amount. We need a negative edge to present this cushion of (outside) space top: -16px that needs to be scrolled before an element sticks. Now the element scrolls 16px outside the top of the page before it starts sticking.

### Troubleshooting

Unfortunately, it's very common to apply position: sticky to an element, only for nothing to happen. Let's look at some common reasons for this.

A parent is hiding/managing overflow.

This is probably the most common reason in a large, real-world application. This is because it will only stick if the element (that is the containing block) itself is scrollable.

Think about it position: sticky can only stick in one context box. Either it sticks to the main viewport scroll, or it sticks to an ancestor that manages overflow.

### The container isn't big enough

We saw an example of this in the above exercise.

- A sticky element will only follow the viewport as long as it remains inside its parent container.
- Make sure that your sticky element has room to move within its parent container.

The sticky element is stretched

When using Flexbox or Grid, it's possible a sticky element will be stretched along the cross-axis. This, in effect, makes it so that the element as no space to move in its parent container.
