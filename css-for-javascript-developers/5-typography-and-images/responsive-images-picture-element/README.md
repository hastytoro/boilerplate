## `<picture>` element

### The srcset attribute

The quickest way to get up and running with responsive images is to use the `srcset` `<img>` attribute. Using `srcset` is essentially a plural version of src. The browser scans and applies the first matching.

We keep src as a redundant property strictly for older browsers but the `srcset` attribute enjoys universal browser support amongst modern browsers. But the src attribute ensures that IE users will still see our images. DevTools will show you which source is being served if you hover over the `srcset` url.

> NOTE: React expects all html (JSX) attributes as camelCase. This means attributes should be written as `srcSet`, not `srcset`. If you forget, a helpful console warning will appear.

### The picture element

Another way to solve the same problem with the 1 element! Structurally, this looks pretty similar to our `srcset` solution. Essentially the new 1 element is wrapped by the 1. The benefit to this approach is that we can specify multiple sources. This allows us to supply different file formats.

The `avif` image format dramatically creating smaller compressed files. A `avif` version of your image 3x smaller is 75% reduction than the .png! At the time of writing, only chrome/opera support `avif`.

- If we tried to use an `avif` image in an 1tag, it would render as a broken image icon in other browsers.
- 1 allows us to use modern image formats in a safe way, by providing fallbacks for other browsers.

When the browser encounters a 1 tag, it scans through the 1 children, and the individual paths within `srcset`. The order matters! When the browser finds a match, it will download the image from the server and show it to the user. \* The smallest files (`avif`) should be on the top.

There's no doubt 1 can do some pretty cool stuff.

> But it can friction, if you need to support x3 media types and x3 pixel ratios, then you need to generate 9 images for every image. That can get tedious without an automatic process.

NOTE: there are projects that solve these problems for you, like next/image and gatsby-image. They do have some trade-offs of their own, but they can reduce a lot of friction.
