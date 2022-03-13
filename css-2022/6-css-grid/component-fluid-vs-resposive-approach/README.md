### The responsive approach

Using `@media` queries we can change grid structure when we get below a threshold. When our viewport is smaller we'll stick with a simple grid layout being a single column in our responsive.html. We'll only use our better grid snippet on larger screens, when we have enough space for it.

We can flip the breakpoint condition at 450px, even though our minimum card width is 400px defined by the minmax() function. You are factoring in the added space for padding of 16px on each side, and the browser scrollbar of +-15px depending on operating system.

### The fluid approach

We can add yet another constraint to our snippet. First evaluate the inner function `min(400px, 100%)`.

> Important: The min() function takes the smaller of the two values.

The 100% refers to the wrapping container's whole width. If you viewing this on a large monitor, the containing wrapper 100% resolves to the window.

```
/* first understand what min() returns: */
.wrapper {
  display: grid;
  padding: 16px;
  gap: 16px;
  grid-template-columns:
    repeat(auto-fill, minmax(min(400px, 100%), 1fr));
}
```

On large monitor's the 400px is returned from this expression. On smaller monitor's the 100% might only for example be a 250px display. In such case, the 100% is returned by the expression, since it's a smaller alternative to the 400px. In other words we get the following outcome:

```
/* minmax() works with larger screens: */
.wrapper {
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}
/* minmax() works with smaller screens: */
.wrapper {
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
}
```

Once we figured out which value is smaller the result is passed "returned" to the minmax() function.
