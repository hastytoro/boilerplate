## Containing Blocks

**Flow** layout uses containing blocks to figure out where on screen to place an element. Remember an element position as static is by default and even your relative elements follow that normal _Flow_ of the document how its written, how your HTML is written, resulting where elements are placed.

BUT when it comes to position: absolute these containing blocks work a bit differently.

When we set the position of an element using top, left, right, bottom, we're positioning the element based on the element(s) containing block. Meaning an element set with top: 0, left: 0 has it nestled in the top, left corner of its parent containing block.

> Question: So how does an absolute element containing block get calculated?

As covered before unlike normal Flow layout mode, an absolutely-positioned element is not necessarily contained by their direct parent as its (out-of-flow),

Below demonstrates an absolute element ignoring its ancestor “content-box” parenting containing-block.

> Important: your absolute element can only be contained by other elements using **Positioned** layout mode.

This is a really vital point and a really common source of confusion. In the attached example, if we add position: relative to the parent class, it flips the child(s) containing block.

### How does this algorithm work?

When deciding where to place an absolutely-positioned element, it crawls up the DOM tree, looking for a **Positioned** layout ancestor.

- Meaning the first positioned ancestor it finds will provide this needed containing block.
- What if it doesn't find one? the element will be positioned according to the (initial containing block).
- The box the size of the viewport, right at the top, left of the document.

The ancestor doesn't have to be relative but it has to be **Positioned** absolute, fixed, or sticky to work.
