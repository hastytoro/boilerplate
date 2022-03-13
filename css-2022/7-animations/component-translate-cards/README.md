## Translated cards

A common animation bug where an element jumps up and down quickly in an unpleasant way.

Take care where you apply the `transform` property when you `:hover` an element. Otherwise transition only triggers when you hover over the `<a>` element(s) but then stops when you pass that area of the DOM tree.

```
<div class="wrapper">
  <a href="/" class="card-link">
    <article class="card">
      <img alt="Chrome" src="/logos/chrome.svg" />
    </article>
  </a>
  <!-- etc... -->
</div>
```

```
/* solution */
.card {
  transition: transform 250ms;
}
.card-link:hover .card {
  transform: translateY(-16px);
}
```

**Solution**, make sure the `:hover` selector and transform/transition actions are separated. Above the `<a>` tag here is not the element moving, it’s only the child `<article>` that we lifting up.
