## Picking breakpoint values

There's no such thing as a universal set of perfect breakpoint(s) and the devices. But we do have some thoughts about how to pick a solid set of values.

Warning: Developers typically pick breakpoints based on common device resolutions. The iPhone 12 has a screen width: 375px, so maybe that'll become our "phone" breakpoint.

**I don't think that this is the right approach.**

The most common device resolutions should sit in the middle of each grouping. A 375px iPhone should probably be in the same bucket as a 320px iPhone SE and a 412px Android phone.

> Important: Place your breakpoint(s) in dead zones, far away from those resolutions as possible. They should be in a “no-device” land. This way all similar devices share the same layout.

This data visualization shows the most popular screen resolutions by platform, according to StatCounter. Focus or hover over the dots to see the devices they represent:

- Mobile 0-550px
- Tablet 550-1100px
- Laptop 1100-1500px
- Desktop 1500-2000px
- Ultra >2000px

Credit: Article from freeCodeCamp.

NOTE: This avoids us bothering and disambiguating between "small" mobile devices (like the iPhone SE, 320px-wide) and "large" mobile devices (like the iPhone X Max, 414px-wide) because we don't generally create distinct layouts for different sizes of phone. Our exact implementation will depend on whether we go mobile-first or desktop-first.
