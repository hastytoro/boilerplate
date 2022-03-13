## Clamping values

The `clamp()` function returns a value between an upper and lower bound. It enables the selecting of a middle value within a range of units between a defined minimum and maximum. `clamp()` can be used anywhere a `<length>`, `<frequency>`, `<angle>`, `<time>`, `<percentage>`, `<number>`, or `<integer>` is allowed.

The function takes 3 values:

- A minimum value
- An ideal value
- A maximum value

It works quite like a trio and combines as a single return value. In other words these two rules are functionally identical.

```
/* Method 1 */
.column {
  min-width: 500px;
  width: 65%;
  max-width: 800px;
}
```

```
/* Method 2 */
.column {
  width: clamp(500px, 65%, 800px);
  max-width: 100%;
}
```

By moving those built-in constraints to the `clamp()` we free-up max-width for usage! Now your solutions can combine them.

Above, we're essentially applying 2 times the maximum width on properties with 800px and 100%. That ensures the column `<div>` element will never be larger than 800px and will consume 100% of available space.

This is handy but it's only one example of the cool things `clamp()` can do.

> It works with other properties!

Till now we've only been able to place limits on width and height properties. Unless you used tons of breakpoints that is smelly code. We never had a way to set min/max padding or font-size. However `clamp()` since it’s a function, it returns a value to a property.
