## Auto-Sizing Columns in CSS Grid: `auto-fill` vs `auto-fit`

To summarize, the repeat() function allows you to repeat columns/rows as many times as needed. For example, if you’re creating a 12-column grid, you could write the following:

```
.grid {
   display: grid;
  /* define the number of grid columns */
  grid-template-columns: repeat(12, 1fr);
}
```

The `1fr` is what tells the browser to distribute the space between the columns/rows so that each column equally gets one fraction of that space. That is, they’re all **fluid**, equal-width columns. And the grid will, in this example, always have 12 columns regardless of how wide it is. This, as you have probably guessed, is not good enough as the content will be too squished on smaller viewports.

So we need to start by specifying a minimum width for the columns, making sure they don’t get too narrow. We can do that using the `minmax()` function.

```
.grid {
  /* ... */
  grid-template-columns: repeat( 12, minmax(250px, 1fr) );
}
```

This will cause overflow in the row. The columns will not wrap into new rows if the viewport width is too narrow to fit them all with the new minimum width requirement, because we’re explicitly telling the browser to repeat the columns 12 times per row. To achieve wrapping, we can use the `auto-fit` or `auto-fill` keywords.

```
.grid {
  /* ... */
  grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
}
```

> These keywords tell the browser to handle the column sizing and element wrapping for us so that the elements will wrap into rows when the width is not large enough to fit them in without any **overflow**. The `1fr` fraction unit we used also ensures that in case the width allows for a fraction of a column to fit but not a full column, that space will instead be distributed over the column or columns that already fit, making sure we aren’t left with any empty space at the end of the row.

At first glance of the names, it might seem like `auto-fill` and `auto-fit` are opposites. But in fact, the difference between is quite subtle.

Let’s take a look at what is really happening under the hood.

- `auto-fill` FILLS the row with as many columns as it can fit. So it creates implicit columns whenever a new column can fit, because it’s trying to FILL the row with as many columns as it can. The newly added columns can and may be empty, but they will still occupy a designated space in the row.

- `auto-fit` FITS the CURRENTLY AVAILABLE columns into the space by expanding them so that they take up any available space. The browser does that after FILLING that extra space with extra columns (as with auto-fill ) and then collapsing the empty ones.

### Summary

The difference between `auto-fill` and `auto-fit` for sizing columns is only noticeable when the row is wide enough to fit more columns in it.

If you’re using `auto-fit`, the content will stretch to fill the entire row width. Whereas with `auto-fill`, the browser will allow empty columns to occupy space in the row like their non-empty neighbors — they will be allocated a fraction of the space even if they have no grid items in them, thus affecting the size/width of the latter.

> Which behavior you want or prefer is completely up to you. CSS Tricks have yet to think of a use case where `auto-fill` would make more sense than `auto-fit`.

https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/
