## Sticky Positioning

Now with sticky elements the idea is that as you scroll an element that can stick to an edge. In addition you must pick an **edge** to stick to (top, left, right, bottom). Most commonly is top: 0px.

The main aspect of position: sticky is that the element will never follow scroll outside of its wrapping and enclosing parent container. Sticky elements only stick while their parent containing box is in view.

Notice in the example code that when you scroll all the way to the bottom, the pink circle never leaves the block rectangle.

> Keep in mind that each **Position** layout mode changes the way your _edge_ properties (top, left, right, bottom) react based on the mode chosen.

- Relative, the element is shifted from its natural, in-flow position.
- Absolute, the element is distanced from its containing block edges.
- Fixed, the element is adjusted based on the viewport window.
- Sticky, the element is adjusted based on the viewport window while the container is in-view/in-frame.

We can set it to 0px if we want it to stick right against an edge, or we can pick a bigger number to give it a bit of breathing room. We can even use negative numbers.

Remember absolute and fixed elements don't block any space out like holograms. If they have any static or relative siblings, those siblings will be positioned as if the absolute/fixed elements don't exist. Sticky elements are like relative or static elements in this regard, they're laid out (in-flow).

They take up real-space, that remains taken even when the element is stuck to an edge during scrolling. Toggle the main box between fixed and sticky, notice how its siblings and parent containers change.

```
<style>
  .wrapper {
    border: 2px solid;
    margin-bottom: 100vh;
  }
  .box {
    border: 4px solid silver;
    width: 40px;
    height: 40px;
  }
  .main {
    /* toggle with fixed! */
    position: sticky;
    top: 0;
    border-color: deeppink;
    height: 80px;
  }
</style>

<body>
  <div class="wrapper">
    <div class="main box"></div>
    <div class="box"></div>
    <div class="box"></div>
  </div>
</body>

```

Above sticky elements are considered normal (in-flow) while fixed elements aren’t.

Changing our main box to position: fixed takes the element (out-of-flow) and the sibling boxes move up to fill available space in the wrapper container. Lastly the parent wrapper shrinks in height.

> The container isn't big enough

- A sticky element will only follow the viewport as long as it remains inside its parent container.
- Make sure that your sticky element has room to move within its parent container.
