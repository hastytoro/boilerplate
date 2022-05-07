## Linear Gradients

Providing two colors to linear-gradient() will interpolate between them, starting top down. If we want the gradient to run at a different angle(s) we can pass an optional 1st argument.

Somewhat confusingly the default angle for gradients is `180deg`. If we set it to `0deg`, the gradient would run from the bottom to the top. As a neat bit of sugar, we can also specify cardinal directions with the to keyword.

We can pass more than two colors to create richer gradients.

Gradients have **color stops** points along the spectrum where the color is fully applied. By default, these colors will be intermediate between them equally. And we can change their placement though using `%` percentages.

We can use these **color stops** to do something pretty neat and unexpected. We can create sharp lines by positioning them very close together.

Look at the example, by using the same color-stop position by gold 40%, white 40% would overlap each other.

Rather then separate them by a fraction of a percentage, to make it clear what's going on. The visual result is the same, so this is purely a semantic concern.
