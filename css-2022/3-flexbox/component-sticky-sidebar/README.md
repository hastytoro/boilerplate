## Sticky sidebar

What you’ll notice is that the border of the <nav> runs all the way to the bottom of the container. This makes sense
because align-items is stretch and that would apply as a default on the container.

So if you have two elements in a **Flexbox** container it’s going to stretch the shortest being the <nav>. And remember that a `position: sticky` element can only move within the scope of its parent container. And in this case it has no room, it’s already the full height of its parent our <section> wrapper.

We can change this be setting our <section> to `align-items: flex-start` that will ensure border shrinks to tightly surround the actual content. Remember!

- `justify-content `represents the positioning of flex items along the primary-axis. The content has two meanings: justify relates to the (primary-axis) the nature of the alignment. Were content refers to the fact that we are positioning a group of items, you can move all these items to the center, start, end or space them between etc...

- `align-items` is for item direction within the cross-axis, also known as secondary axis. The items relates to the (cross-axis) as items refers to the fact that every item is being positioned kind of on its own. Each item will be managed individually either at the start, stretch, end, center etc... within its containing box, content-box.

Beware of the **default** configuration, if we do not explicitly set it the container will then `align-items` to stretch all flex items(s). And a stretched item, that is taking all available space in its own assigned column, well then can’t stick to any different position within that filled lane of space.

> Warning: the above solution is heavy handed in setting all items to flex-start within a container. Say instead of 2 columns, we had 4 columns of content. You would be aligning all their items ☹.

A better approach would be targeting just that individual item instead of all of them. Use `align-self` for the alignment of a selected item inside the whole flexible container. NOTE: The property overrides the flexible container's align-items property.
