## Overlapping background shapes

Our gradients can be used for nifty background patterns by overlapping multiple gradients. We stack them over each other applying transparency at specific color-stop section(s).

Lets make sure that the base background `<div>` is the darkest element that is absolute positioned in all 4 possible edges of our application at the max width and height of the page.

Using our secondary selector(s) we layer additional colors to the already stretched background class. Select the linear-slops `<div>` and set background property to layer a linear-gradient().

We apply transparent 'syntactic sugar for opacity zero' the start 0% and middle 49.99 color-stops. The remaining middle 50% and end 100% color-stops are var(--dark-slop), completing the full range.

When we angle gradients they move clockwise from top to bottom.

Important: Remember linear gradients take angles (45deg) and radial take position (circle at 50% 100%). But conic takes both (from `<angle>` at `<position>`).

Our radial-gradient() color is defined by its center.

To create a radial we must define at least two color-stops. We switch them around as the color assignment starts from the inner 0% which is the very center of our circle.

- With radial the color-stops are from the center outwards so the last two are transparent.

We also specify circle because default is ellipse. And lastly as mentioned, the radial size information is additionally its position.

For example, we want the 'center point' of our first circle to be at the right/bottom corner of the page. Above we consume 100% horizontal and 120% vertical space.

The second circle center is 20% of the horizontal axis followed by 100% vertical.
