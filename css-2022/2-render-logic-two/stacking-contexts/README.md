## Stacking Contexts

How does the browser decide which element to render “stacked on-top” or in-front of each other when elements overlap? With a surprisingly complex answer.

> It depends on the layout mode **algorithm** used.

In normal **Flow** an elements don't overlap much. You could force it with negative margin but generally the DOM order matters.

See attached code, the pink box comes after the silver in DOM order and so it's painted on top. But there is one catch, in flow layout notice (content) is painted separately from the background. What do you notice when adding text to these sibling boxes?

In **Flow** layout background and border properties are truly meant to be in the background. The “content” however will float on top. That's why the letter A shows up on top of the pink box. Toggle the commented out relative position declaration.

> As a general rule positioned elements will always render on top of your non-positioned ones.

We can think of the rendering process as two-stage:

1. All non-positioned layout mode elements are rendered first being normal flow, flex, grid etc...
2. Then all position elements are rendered on top being your relative, absolute, fixed, sticky.

What if we set both elements to use relative positioning? In that case the DOM order wins!

### In Summary:

- When all siblings are rendered in normal Flow layout your DOM order controls how background elements overlap. But (content) will always float to the front.
- If one sibling uses any Position layout it will appear above its sibling that is non-positioned, no matter what the DOM order is.
- If both siblings use Position layout then your DOM order controls which element will be on top. Unlike in normal Flow layout mode the (content) does not float to the front.

That's how the stacking order is calculated by default without considering properties like z-index. And it only works with positioned elements, again that element is in a Position layout.

The default value of the property is z-index: auto, which is equivalent to the number 0. Therefore, any value greater than 0 can be used to promote an element to sit in-front of its siblings.

> Warning: negative z-indexes introduce additional complexity without offering much benefit.

For additional information see https://web.dev/learn/css/z-index/.

Example, if `<main>` has a z-axis increase by z-index: 1 that is lower than the comparable sibling `<header>` z-index: 2. That would then place that sibling more forward/ahead.

- Our child of `<main>` can do nothing to break above its staking context.
- Creating a staking context occurs only on position elements that are not static.
- An element needs to have a z-index and is either a position of relative, absolute, sticky, or fixed.
- Here we have created a staking context!

```
<style>
  /* These styles are purely cosmetic */
  * {
    font-family: 'Wotfard', sans-serif;
    font-weight: bold;
  }
  body {
    margin: 0;
    padding: 0;
    background: #eee;
  }
  header {
    position: relative;
    height: 60px;
    line-height: 60px;
    background: pink;
    text-align: center;
    z-index: 2;
  }
  main {
    position: relative;
    padding: 32px;
    z-index: 1;
  }
  .tooltip {
    position: absolute;
    top: -12px;
    left: 0px;
    right: 0px;
    margin: 0 auto;
    width: 90px;
    text-align: center;
    padding: 8px;
    background: white;
    box-shadow: 1px 2px 8px hsl(0deg 0% 0% / 0.25);
    border-radius: 6px;
  }
</style>
<body>
  <header>Application Header</header>
  <main>
    <div class="tooltip">tooltip</div>
    <p>Main content here...</p>
  </main>
</body>
```

## Other ways in creating new contexts

We demonstrated how to create staking context(s) by combining non-position static elements with z-index. This isn't the only way! Here are some other declarations creating new stacking context:

- Setting opacity: here to a value less than 1.
- Setting position: fixed or sticky and z-index is needed for these values.
- Applying a mix-blend-mode other than normal mode.
- Adding a z-index to a child inside a display: flex or display: grid container.
- Using transform, filter, clip-path, or perspective.
- Explicitly creating a context with isolation: isolate.

> If you're curious, you can see the full list of how stacking contexts are created on mozilla MDN.
