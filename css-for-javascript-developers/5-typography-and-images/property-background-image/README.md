## Background Images

CSS has evolved and `<img>` has grown more flexible, but there's one thing that it can't do -- **tile image**. When we repeating a pattern, use a `background-image`.

By default `background-image` will be rendered at its native size and then tiled across the element.
Warning: As discussed, monitors support "high DPI" and if we render an image at its natural size it'll appear blurry/fuzzy, since a single software px is stretched across multiple x3 hardware px(s).

Ensuring images are crisp we provide different resolutions for different devices. We scaling-up based on the pixel ratio and with the `@media` query we use the `min-resolution` condition to trigger.

```
/* default background configuration */
body {
  background-image: url('/geometric-pattern.png');
  background-size: 450px;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  body {
    background-image: url('/geometric-pattern@2x.png');
  }
}
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
  body {
    background-image: url('/geometric-pattern@3x.png');
  }
}
```

With `min-resolution` we support across all major browsers except Safari. We can support Safari with an alternative syntax being `-webkit`. We also need to specify a `background-size: 450px` in pixels. Otherwise our **high-DPI** images will render in their native size, producing much larger images, without any additional clarity. The background-size should match the width of the standard x1 image.

### Fit and positioning

The `background-size` also accepts certain keyword values, like object-fit. We can choose to cover the background instead of tiling. It appears as if the image is growing, not repeating tiles.

```
body {
  background-image: url('/geometric-pattern.png');
  background-size: cover;
}
```

In fact the `object-fit` was inspired by `background-size`.

It was added to the specification when the authors realized that developers were using background images instead of <img> tags specifically for the `background-size` property.

There's also position property which works just like object position counterpart.
