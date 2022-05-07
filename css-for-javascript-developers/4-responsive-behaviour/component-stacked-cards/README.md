## Stacked cards

We handling the response with desktop-first in mind. Our media queries catch other screen resolution.

The idea is that as the window shrinks, instead of assigning separate settings, we rather reactive the individual global property(s). Now in addition to assigning the variable by using the var() function in our Flexbox configuration, below we do that reactive modification of `--spacing` per breakpoint!

We changing the value of the custom property only, which is a reactive variable. All our var() functions are going to re-run and discover that they have a new value(s), updating the css declarations.
