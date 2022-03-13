## Holy Grail Page Layout

For a long time, a perfect layout was extremely common, difficult to implement correctly with the tools of the time (tables and floats) that is not modern techniques. But fortunately, Flexbox can handle it without weird hacks!

- First you need to ensure that your markup is done in a way that has two Flexbox containers. A Flexbox wrapper <div> that will hold contents being our <header> <section> <footer> and then another sub-Flexbox being the middle <section> that contents are <nav> <main> <aside>.

- Lets target our outer elements wrapper { display: flex } before working on nested ones. And the default behaviour is what you expect from a row direction. We have the <header> followed by all content enclosed by our <section> and then the <footer>. Below we flip this around. You will notice the size is based on the minimal content size of the flex item(s) our actual content. And as learnt, we can add hypothetical sizing properties.

Now let’s ensure our container spans the entire height of the viewport. As seen in Flow layout, we would size our webpage at height: 100% to our html, body { here }. We manage the content from within Flexbox container, from the highest point being our wrapper <div>.

- Lets work on our nested sub-Flexbox container managed by the middle <section> element. We flex: 1 its element(s) meaning they grow taking all available viewport space based off the window (viewport). Additionally, by leaving out the shrink value, we accept that default value being 1.

Now reach into that nested container and lets ensure that between its children flex item(s) that the <main> element takes majority of growing space by also setting it to flex: 1. Finally, for a better response and design we can use proportions.

- By assigning nav, aside { flex: 1 } and increasing main { flex: 3 } the calculation would be 2 + 3 = 5 call them flex-grow units. Our <main> now takes three 5th of total growing available space.
