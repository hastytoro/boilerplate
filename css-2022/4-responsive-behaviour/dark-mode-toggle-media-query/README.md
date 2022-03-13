## Dark Mode

Let's use CSS variables to create a dark mode, a more variant UI! Using the @media query we can condition for either `prefers-color-scheme: dark or light` for alternative styling. Your colors should use the same values for “hue” and “saturation” but we only need to change the “lightness” values to be dark-mode appropriate.

> When **Contrast ratio** is a failing, the number we looking to achieve is `4.5` and higher.

The ratio is how much contrast there is, “the difference in colors between the foreground text and your background”. Tweak them directly in the DevTools till you reach improvement!
