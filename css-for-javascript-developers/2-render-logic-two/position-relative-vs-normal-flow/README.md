## Static positioning

The default value of the position property is static. Occasionally, you'll see people refer to statically positioned elements. This really means is elements are not positioned layout, they're using some other layout mode, like normal Flow. And if your element is currently using Position, you want to opt-out. You can set position to either the default static or initial.

## Relative positioning

Of all the positioned layout sub-genres relative is the most refined of the bunch. You can often slap position: relative on an element and observe zero difference. It appears to have no effect! In fact, it does two things:

- Constrains certain children "will cover shortly".
- Enables additional and supporting properties to be used.

> NOTE: When we opt-in in positioned layout we enable new properties like top, left, right, bottom. We can use those edge directional properties to shift the element around. With relative positioning, those values are then relative from its natural position. The big difference position doesn't impact layout.

Notice the box's (representing sibling elements) don't move.

They don't get pulled along for the ride, as they do with margin. In terms of normal Flow, the browser acts like the element is still in its original position.

Whether we use position: relative and top, the pink box winds up lower than its natural position.

With margin-top in-flow the (disadvantage/behavior) is that black boxes below the pink get shuffled along too, changing the placement of the html elements.

With position: relative we can apply settings to both display: block and inline elements. Allowing us to nudge inline elements that was not possible with other (layout modes).
