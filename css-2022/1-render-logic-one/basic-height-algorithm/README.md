## Recommendation

- [x] Place height: 100% on every element before your main container, so html, body { here }.
- [x] Use min-height: 100% on your wrapper <div> container.
- [x] Don’t use % percentage-based heights on elements within your wrapper.

Now <html> with height: 100% it takes up all the height of the viewport, that serves as our base. The <body> tag is also 100% making sure that (base size) we need is well covered.

Next when we get to our wrapper class we use a min-height, this way its min size is equal to the complete viewport height. And it can overflow taking up more space depending on its children content.

- A elements height looks "down" the tree for values based on the natural size of its contents.
- A elements width looks "up" the tree for values based on the space available offered in the parent.

### What about the vh unit?

Warning: you may be familiar with the vh unit, a unit designed exactly for this purpose. If you set height: 100vh, your element will inherit its height from the viewport size -- not recommended.

Important: its recommended to use the html, body { height: 100% } method described above. It produces a better experience in most cases compared to vh units.

### What about footers

A common UI challenge of having a <footer> that stays at the bottom. A modern way to solve this problem would be to use Flexbox.
