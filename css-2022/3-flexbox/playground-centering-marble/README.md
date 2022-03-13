## Centered marble

All properties are declared being the justify-content: center for horizontal (primary-axis) direction, however regarding the vertical (cross-axis) alignment with align-items: center is not centering.

The problem is we are centering horizontally but if the wrapping container `<div>` is without any sizing being width or height, remember by default block elements are explicitly sized via children content.

Important: The container is following all the normal in Flow layout rules. Earlier, we mentioned that setting display: flex on a wrapping container would be changing the applied rendering and layout mode algorithm used for all enclosed children -- NOT that of the parent container.

Remember block elements on page their (content box) is greedy and expands. Filling the entire horizontal available space. Adding a white background to just wrapper, would demonstrate this. We can use a min-height: 100vh/100% on the wrapper and that would be sized related to the viewport.

**How this works:** The parent `<body>` element has an explicit height: 100% declaration that will figure out how tall it should be based on its content(s) being children content. Additionally the actual child `<div>` is applying its min-height: 100% size based on the height of the parent.

Both our html, body tags need to be set to height: 100%. Since your html element does not have a parent, as it’s the very top-level, it has no choice but to fall back to the default viewport height. The `<body>` looks to its parent `<html>` for how to scale the dynamic % unit, so both elements need to have height set as well. This ensures your body can continue to grow when the content is taller than the viewport.
Using percentage values requires the element reference its parent to base its percentage on.

In turn the `<html>` element references the viewport which has a height value equal to the visible viewport height. Without setting the html to height: 100% also, that would mean the body element has no parent height value to reference when deciding what 100% is equal to.
