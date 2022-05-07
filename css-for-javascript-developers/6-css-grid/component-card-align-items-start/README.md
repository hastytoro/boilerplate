## Self-alignment

**Re-cap**: In Flexbox, align-items is used on the parent to control the cross-axis position for all of the elements. But we also have `align-self`, which allows a specific child to overrule it.

Now `align-self` works much the same way when applied to a specific grid child it changes their vertical position in the grid cell. And `justify-self` changes an element horizontal position in the cell.

Instead of **default** stretching that fills available space in each cell, rather align from the start. The only way we style asymmetrical cards not in proportion, is with either align or justify items.

> Remember as a default all Grid container columns are the same (width) and grid rows are additionally all the same (height). They stretch filling all available space.

Note the above has asymmetrical items, you would likely tweak those items within each cell. Again that is handled by either the align or justify-items properties. Changing where the whole group is positioned, we define that via content property on the whole wrapping grid container.
