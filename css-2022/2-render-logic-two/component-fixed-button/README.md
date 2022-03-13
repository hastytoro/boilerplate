## Fixed Positioning

Using position: fixed is a close cousin to absolute positioning. The difference is that it's even more rebellious and can only be contained by the viewport.

> They don't care about parent containing blocks and these elements are immune to scrolling.

In very similar principle it's taken **out-of-flow** and positioned according to some sort of parent boundary but that boundary is different compared to absolute elements. Instead of the closest non-position static **ancestor**, it listens to the (initial containing block). The container size and position of the **viewport**.

How does the browser decide which element to render “stacked on-top” or in-front of each other when elements overlap? With a surprisingly complex answer.

If you don't setup anchor/edges your <button> will follow default in-flow direction. This behavior is consistent with absolute positioning.

> In general your fixed elements will be positioned relative to the viewport but there is one exception.

If an ancestor parent uses the transform property, it becomes the (containing block) essentially transforming it into an absolutely positioned element, stack to the wrapper.

NOTE: Just keep that in mind that transformed parents can't have fixed children. And it doesn't have to be a direct ancestor either, it can be a parent element many levels up the DOM tree.
