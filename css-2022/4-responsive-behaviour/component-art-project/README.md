## Art project

Attached we have 16 boxes drawn in a **Flexbox** container. You could provide a gradient to each flex item individually, but that would be smelly code ☹.

Instead setup **CSS variables** globally accessible throughout the stylesheet and we also define a local variable(s) that is isolated within each flex item.

We can use the :nth-of-type(n) selector that matches every element that is the nth child, of a particular type, of its parent. n can be a number, a keyword, or a formula. Or we can use the :nth-child(n) selector to select the element that is the nth child, regardless of type, of its parent.

> Using those CSS variables, we produce a unique patten for each flex item.

We changing the value of the custom property which are a reactive variable(s). All var() functions are going to re-run and discover that they have a new value, updating the css declarations.

For example, we set the :root { --ratio: 0 } that would produce a flex container with only red items. Remember 0° on the color wheel is "red". Change that to --ratio: -7 or --ratio: -1700.

The second patten makes sense because `calc(var(--index) * var(--ratio)` is cycling through the color wheel much further for each flex item, producing colors that are not adjust to each other, unless we setup our --hue to 0.

Additionally we can access each box `<div>` with a local/isolated `--index` variable value. We reactive calc() alongside the --ratio that will produce a different degree within the hsl() for each sibling flex item.

Jumping ahead, let’s add an animation to a property. By using a `@keyframe` we determine with the from keyword the initial transforming point, toward the end using the to keyword.

Our keyframe called spinner will transform a property with no rotation from 0deg to complete rotation toward 360deg. We apply it using the animation: spinner property to each flex item(s).

And there too we can apply the calc() with variables to produce complex animations.

```
animation: spinner calc(500ms + var(--index) * 500ms) 2 linear;
```
