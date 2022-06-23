# useLayoutEffect: auto-scrolling textarea

## 📝 Your Notes

There two ways to tell React to run side-effects after it renders:

1. `useEffect`
2. `useLayoutEffect`

The difference about these is subtle (they have the exact same API), but
significant. 99% of the time `useEffect` is what you want, but sometimes
`useLayoutEffect` can improve user experience.

## Exercise

Here you just need to replace `useEffect` with `useLayoutEffect`. Add and remove
messages and you'll find that there's a jerky "experience" version because when
we `useEffect` there's a gap between the time the DOM is visually updated, and
when our code runs. [hook flow diagram](https://github.com/donavon/hook-flow).

Remember, when we (mount), we run the lazy initializers, we render, we (update)
the DOM, and then we run **layout effects**. React does't wait for the browser
to paint to screen/page before it runs layout effects. This is important because
the layout effects need to run before browser paints the screen. _Why?_

Because we're making changes to the DOM in a way that will change what the
browser paints. Meaning, when we layout effect, we can change stuff in the DOM
before the browser has a chance to paint screen. The browser only has to paint
the screen once, and the user only will see that render (update) once.

**The simple rule for when you should use `useLayoutEffect`:**

If you are making observable changes to the DOM, then it should happen in
`useLayoutEffect`, otherwise stick with the `useEffect` hook. Anytime you have a
side-effect that's going to manipulate the DOM in a way that's observable to the
end user, you want to do that in a "layout" side-effect.

Otherwise the only other time is if we want to ensure that a effect callback is
called before any other effects are called.

To bring it down to best practice, use the `useEffect` hook all of the time, and
**layout** if the side-effect you are performing makes observable change to the
DOM that requires the browser to paint that update you've made.
