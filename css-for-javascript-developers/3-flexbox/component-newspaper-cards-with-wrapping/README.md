## Newspaper Cards - continued with wrapping.

**Re-cap:** images are set to `width: 100%` otherwise they would display their intrinsic size for each flex item.
Next setting `flex: 1` ensures elements (grow) when available space or (shrink) when limited space as equally as possible. Keep in mind, that on its own, the flex items will explicitly set the other two properties being `flex: 1 1 0px` should you not set them.

The fundamental benefit to **Flexbox** wrapping is to avoid the situations when shrinking occurs:

1. The Flexbox algorithm will try fit everything in a single direction.
2. The items get to a point where they don’t fit evenly.
3. And overflow will occur producing a horizontal scrollbar.

Introduce `flex-wrap: wrap` on the `<main>` container to avoid the above.

> As soon as we hit that point where the items don’t fit anymore, meaning we hit **minimum content size** and possible **overflow**, then the container pushes the last item onto a new line.

### But how can we better this UX?

We seeing very narrow cards as we shrink, then as we wrap each item, they grow very large.

Dealing with what we covered earlier, flex: 1 standalone sets default settings for flex-basis to 0px. That means the **hypothetical** width size is zero. As recommended before, lets rather be explicit here. Now when an element shrinks below 150px it wraps because we have defined a **hypothetical** (width).

Our `flex-grow` value is setup using the shorthand declaration of `flex: 1`. That means we have a lot of extra free space when the single item wraps into its own row. That’s because the flex spacing calculation happens to work on a per row basis. In short it grows to large!

If we don’t **constraint** them however, items will all grow as much as they can using available space. We manage this by defining a `max-width: 250px` in each flex item.

### Content vs items

In the world of Flexbox, your content has a different definition to your item. Its important to learn why the specifications had chosen to use these two words.

- `justify-content` has two meanings: **justify** relates to the (**primary-axis**) the nature of the alignment. Were **content** refers to the fact that we are positioning a group of items, you can move all these items to the center, start, end or space them between etc... In a nutshell, you positioning a group of units not individually but as a cohesive group.

- `align-content` has the same principles “values” as justify-content but all items in the (**cross axis**) alignment. The property modifies behaviour when items are wrapping so the `flex-wrap` property would need to be set on the container. Again similar to align-items, it works on the (**cross axis**). But instead of aligning each flex item, it aligns flex lines. There must be multiple lines of items “wrapping” for this property to have any effect -- this property is used more in Grid layouts.

- `align-items` relates to the (**cross-axis**) as items refers to the fact that every item is being positioned kind of on its own. Each item will be managed individually either at the start, stretch, end, center etc... within its containing box (content box).
