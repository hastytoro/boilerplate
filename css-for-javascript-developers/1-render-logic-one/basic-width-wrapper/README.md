## Max Width Wrapper

A common situations when building layouts is requiring a constrained, centered column of content.
Build a generic utility class that we can drop in to solve this problem wherever we encounter it. Specifically, create a wrapping `<div>` to fulfil these constraints.

- [x] It fills the available space on smaller viewports.
- [x] Horizontally center itself within the parent wrapper `<div>` if it has leftover space.
- [x] Include horizontal padding so children "card" elements aren't pressed against enclosing parent edges.

We have a max-width reusable wrapper `<div>` container that wraps around enclosing children. To ensure we center it we use key Flow layout properties like margin-left and right: auto to ensure we middle it in the body.

Lastly we add side padding to the wrapper so that it does not bleed the content out.
