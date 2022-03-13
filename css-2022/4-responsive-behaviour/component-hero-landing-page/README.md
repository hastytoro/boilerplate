## Hero/Landing Page

Here we have a "hero" container that will hold content that may not fit on smaller devices. Now instead of using breakpoints, we can ensure the parent container expands for flex items to contain them on mobile displays. But, if the "hero" content does fit say on desktop and higher displays, lets ensure the Flexbox container is capped at `500px` tall, to make it look better on taller monitors.

> We need a solution that allows content to grow as needed but also default to a size on taller monitors.

- Using `min()` we provide multiple and possible values for our Flexbox `min-height` property ✅.

**Warning:** Using a @media query to condition for say a min-height of large screen devices in targeting the Flexbox, is a bloated, confusing, and not a workable approach here ❌.

We can start by making sure `80vh` is for most situations and that also a minimum of `500px` is applied when a device is either in a super zoomed out mode or large display.

When the stylesheet is phased it will first read the function expression and evaluate it.

- `min()` will return the smaller of the two values.
- Whatever it resolves between the two values will be passed back to the property min-height as the return value.
- A 2000px display will evaluate the `min()` expression by determining that `80vh` is 1600px.
- So between the two values, `500px` is returned as the minimum value for the Flexbox container!.

> We have **dynamic scaling** because `80vh` will be a smaller value below anything with 700px as (20% of 700) is 500.
