## Photo Viewer

Let’s demonstrate the use of child Flexbox containers. We basically have multiple tiers. Here you will notice we have a lot of nested details, sub-Flexbox layouts. When faced with a challenge like this, its recommended to always start from the outer tier being the main containing block wrapper and work your way to each inner tier down, from the top / down.

NOTE: A good starting point! set img { width: 100% } that solves a problem related to the image scaling when the container size changes. As `<img>` scales within the column or row depending on flex-direction, it will scale based on the parent container’s flex growing or shrinking factors.

Tier 1: The highest parent element is our `<section>`. Let’s set photo-viewer display: flex . Working on the direct children, the first being the `<div>` photo-roll { flex: 0 0 200px } ensures it will not grow or shrink but will clamp to a size. Additionally the sibling `<div>` photo-main { flex: 1 } we set to grow.

As mentioned, if you setup your shorthand like this flex: 1, you need to remember it has remaining and default values. If not explicitly set by you they default to shrink: 1 and basis: 0px. That means that any photo-main item(s) that `<div>` holds, above that is our single main `<img>` element on the page, will grow/shrink based on the whole window.

Re-cap: ensure all images are width: 100% otherwise they would display their intrinsic size and not the constraints set for each flex item.

Tier 2: The above covers broad level behaviour, but now we can move into sub-Flexbox container, that will have flex item(s) also. Doing the opposite and applying more lateral thinking, here we set our photo-roll { display: flex } and we change the flex-direction: column so that it does not stack the default side by side being flex-direction: row but rather top to bottom as column, flipping the primary-axis.

Using the auto margin strategy above, we telling our margin declaration on the 3rd child `<div>` called photo-action { margin: auto } to consume vertical space as our (primary axis) is vertical. As we expand the window, the Flexbox along with margin configuration work together providing a separation effect.

Tier 3: lastly we nest another sub-Flexbox for easy control between our two children `<button>` elements.
