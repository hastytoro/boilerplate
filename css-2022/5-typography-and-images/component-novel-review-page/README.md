## Images and Flexbox

Because the <img> tag is quite weird, it doesn't always behave the way we expect when it interacts with other layout modes. This is especially true when it comes to Flexbox. Here we have an <img> as a flex item, in a Flexbox container. As we resize the window, notice what happens.

The flex item <img> has a flex: 1 shortcut declared. Which by default sets the flex-basis to 0 if left standalone. So why is it overflowing the container on smaller window sizes?

We have two <img> in the same Flexbox container, one consumes twice as much space as the other. Most developers assume that setting flex: 2 will cause the image to scale up, twice as fast. But that is not the case, so to resolve this we need to remember how your Flexbox algorithm works and what rules are being applied here.

> Why is the first <img> so distorted? What is so tricky?

1. Our default display: flex configuration is row, meaning primary-axis is horizontal and the cross-axis is vertical. And the default alignment for our flex items is stretch.

2. Whenever flex items "children" are of different height, by default your align-item stretches them. That would ensure that the shorter one is the height of its taller sibling. Flexbox algorithm does not discriminate between children, they all treated the same. Whether they’re images or not. We resolve this by changing align-items or self to flex-start.

3. The next thing to consider is the hypothetical and minimum content width or height of your flex item. It turns out <img> will have a minimum width set by its intrinsic size. We can override that behaviour with a constraint min-width: 0. Allowing flex item to shrink below its minimum content width.

**Warning:** We solve <img> conflicts with Flexbox principles but you can sidestep those issues all together.

> > **Solution**, by wrapping images in nested container, we conveniently sidestep all of these strange issues and can apply the flex shorthand on these inner **placeholder** <div> children instead.

Remember, your Flexbox container controls placement/distribution among blocks of stuff. An image is treated the same as text etc as flex content. They don’t belong as a direct children alone.

A good way to think about it, we have a Flexbox container that has blocks of content, that those item(s) also have their own content inside it like <img> <h1> <p> etc...

```
<main>
  <div class="placeholder">
    <img alt="" src="/size-200-300.jpeg" />
  </div>
  <div class="placeholder twice-as-big">
    <img alt="" src="/size-200-300.jpeg" />
  </div>
</main>
```

```
main {
  display: flex;
  gap: 4px;
}
.placeholder { flex: 1 }
.twice-as-big { flex: 2 }

img { width: 100% }

```

Now instead of applying your flex shorthand directly to <img>, we’ve got this container in the way. The containers will be stretched, not the <img> as flex item(s). They not being positioned according to Flexbox but rather positioned back to normal inner Flow layout mode containers. By declaring that <img> take width: 100%, they filling that nested container space, not the available parent space.

Is adding additional superfluous markup as placeholders considered bad practice? Each DOM Node is a cost when rendering but you would need 1000s on a page before its problematic.

NOTE: Developers may feel you mixing concerns with a <div> that hold child <img> but containers actually are meant to group items as seen above. The whole point of a <div> is to divide content. So in terms of semantics the above is semantically correct! 😊
