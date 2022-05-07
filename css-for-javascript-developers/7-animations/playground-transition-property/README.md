## CSS Transitions

In your animation toolbox comes the most fundamental property used with `transform`. That would be `transition` that allows us to smooth out the changes/distorts by our **transform** in our application.

Instead of an element appearing jumpy/jerky from one spot to another, it rather glides. In order for us to use `transition`, we need elements that **transform**, meaning it changes/distorts.

The code here has a :hover state, that we apply a transform that shifts the element up. The moment the cursor crosses our button, it gets repainted in its new position.

> We can instruct the browser to interpolate from one state to another with transition. This property is highly configurable and only two values are required.

- The name of the property we wish to animate above that is transform.
- And also the duration of the animation.
- If you plan on animating multiple properties you can pass it a comma-separated list.

Warning: It can be tempting to use this value, as it saves us a good chunk of typing if we're animating multiple properties, but its recommend not to be used.

Being specific is better in avoiding any unintended animations.
