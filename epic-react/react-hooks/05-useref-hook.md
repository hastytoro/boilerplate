# useRef and useEffect: DOM interaction

## 📝 Your Notes

## Background

Often when working with React you'll integrate with UI libraries. Some of these
need to work directly with the DOM.

Remember `return(<jsx>)` is actually syntactic sugar for a `React.createElement`
call, handled by your Babel compiler. We don't actually have access to DOM nodes
in your function component. They UI descriptor objects "your JSX" React uses to
ultimately render an actual DOM nodes to page.

In fact, DOM nodes aren't created at all until we `ReactDOM.render`. Your
functional component is responsible for defining and returning the React
element, and has nothing to do with the DOM in particular.

However to access the DOM, you need to ask React to access to a particular DOM
node when it renders your component in your JSX syntax. We use a special prop
called `ref={}`. Here is a simple example of using the `ref` prop:

```javascript
function MyDiv() {
  const divRef = useRef()
  useEffect(() => {
    console.log(divRef.current) // work with the actual `<div>` DOM node!
  }, [])
  return <div ref={divRef.current}>hi</div>
}
```

When React renders that DOM node to the page via `ReactDOM.render`, it knows we
want a reference to that DOM node in a placeholder. We set the `current`
property on object to that DOM node

Remember when a component renders, it's (mounted) but we need to consider how to
access that DOM node via a side-effect handler, so that it can be available to
our React component. Using a callback "effect", we can interact with an already
painted DOM nodes. At that point we use the `ref` prop along with the `current`
property set to the DOM node we wish to interact with. So often you'll do direct
DOM interactions/manipulations in your `useEffect` callback.

## Exercise

Here we're going to make a `<Tilt />` component render a div and use the
`vanilla-tilt` library to make it super fancy. The library works directly with
DOM nodes to setup event handlers and stuff, so we need access directly.

With `useRef` 🪝 we return a mutable and referenced object that we "placeholder"
in a variable called tiltRef. It has a `current` property, that's initialized to
the passed initial value. The returned object will persist for the full lifetime
of the component. Using a placeholder variable, React can interact with it.

You can then forward the `current` property (that represents the current HTML
element), to our VanillaTilt instance. Our `ref={}` prop in our JSX definition,
ensures React knows want to reference when the DOM node is painted to the page.
It sets the `current` property on our JSX object, to that DOM node.

```jsx
import VanillaTilt from 'vanilla-tilt'

function Tilt({children}) {
  const tiltRef = React.useRef()
  React.useEffect(() => {
    const tiltNode = tiltRef.current
    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    })
    return function cleanup() {
      tiltNode.vanillaTilt.destroy() // #1 optimize: 💯 cleanup callback
    }
  }, []) // #2 optimize: 💯 empty dependency array
  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}
```

In review, we're not calling `document.createElement` to setup this HTML DOM
node (React does). So we need this process in order to access it. We use a `ref`
prop so React can give us the DOM node to pass to the `vanilla-tilt` function.

We also need to clean-up after ourselves when the component unmounts. Otherwise
we'll have event handlers dangling on top of the DOM nodes that are no longer in
the document that can result in memory leaks, they not garbage collected.

Lastly the dependency array is empty so that the calculation for the vanilla
tilt node is done only once, when the component first renders (mounts).

### Alternate:

If you'd prefer to practice refactoring a class that does this to a hook, then
you can open `src/exercise/05-classes.js` and open that on
[an isolated page](http://localhost:3000/isolated/exercise/05-classes.js) to
practice that.

## 🦉 Feedback

Fill out
[the feedback form](https://ws.kcd.im/?ws=React%20Hooks%20%F0%9F%8E%A3&e=05%3A%20useRef%20and%20useEffect%3A%20DOM%20interaction&em=luigi.lupini%40gmail.com).
