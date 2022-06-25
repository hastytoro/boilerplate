# Compound Components

## 📝 Your Notes

## Background

The Compound Components Pattern enables you to provide a set of components that
_implicitly_ share state for a simple yet powerful declarative API for reusable
components. Compound components work together to form a complete UI. The classic
example of these `<select>` and `<option>` in native HTML:

```html
<select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

Think of a **compound components** as these HTML `select` and `option` elements
that by themselves, they both useless. Together, they're very useful, and they
share implicit state between each other. That's precisely what we build when we
create these compound components.

The `<select>` is the element responsible for managing state of the UI, and the
`<option>` elements are essentially more configuration for how the select should
operate (specifically, which options are available and their values). Imagine we
were going to implement this native control manually.

A typical implementation would look something like this in React:

```jsx
<CustomSelect
  options={[
    {value: '1', display: 'Option 1'},
    {value: '2', display: 'Option 2'},
  ]}
/>
```

This works fine, but it's less flexible than a compound component API. For
example, what if we want to supply additional attributes on the `<option>` that
is rendered, or we want `display` to change based on whether it's selected?

We can easily add API surface area to support these use cases, but that's just
more for us to code and more for users to learn.

That's where compound components come in really handy!

**Real World Projects that use this pattern:**

- [`@reach/tabs`](https://reacttraining.com/reach-ui/tabs)
- Actually most of [Reach UI](https://reacttraining.com/reach-ui)

## Exercise

Every reusable component starts out as a simple implementation for a specific
use case. It's advisable to not overcomplicated components. Don't try solve
every conceivable problem that you don't yet have.

As changes come (they always do), then you'll want the implementation of your
component to be flexible and changeable.

This is why we're starting with a super simple `<Toggle />` component. We're
going to make `<Toggle />` the parent of a few compound components:

- `<ToggleOn />` renders/returns children when `on` state is `true`.
- `<ToggleOff />` renders/returns children when `on` state is `false` (off).
- `<ToggleButton />` renders/returns `<Switch />` depending on `on` prop.

```jsx
function Toggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return <Switch on={on} onClick={toggle} />
}
const ToggleOn = () => null
const ToggleOff = () => null

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <ToggleButton />
      </Toggle>
    </div>
  )
}
```

The `<Toggle />` component manages state, and we want to render different parts
of the UI. We want control over presentation of the UI. But the fundamental
challenge you face with an API like this is the state shared between components
is "implicit", meaning the developer using your component cannot actually see or
interact with the state (`on`) or the mechanisms for updating that state
(`toggle`) that are being shared between the components.

```jsx
const ToggleOn = ({on, children}) => (on ? children : null)
const ToggleOff = ({on, children}) => (on ? null : children)
const ToggleButton = ({on, toggle}) => <Switch on={on} onClick={toggle} />
```

**Problem:** We have these components ready to go, but we don't have any way to
pass the `on` or `toggle` as props to these because we don't have access. They
are _managed_ state within the "parent" `<Toggle>` component itself only.

Back to `<Toggle>`, how do we take state values that its managing itself and
share it "implicitly" to its `props.children`, the components it encloses over?
That being the ToggleOn, ToggleOff, and ToggleButton?

We say implicitly because as a user of these compound components, we don't have
any way of knowing in these children components whether the parent `<Toggle>`'s
`[on]` state is true or false as its passing it as props to `<Switch>` render.

Instead, we'll solve this problem by providing those props **implicitly** via
using `React.cloneElement`. We can refactor the code to the following pattern of
compounding components. An important thing to remember, one of the props a we
are receiving is `{children}` via props.children.

So within the parent `Toggle` component we're going to take that children prop,
and use `React.Children` to iterate changes into "cloned" objects. We map() pass
in children as the first argument and second the function, which will get called
with every iteration in the array. And that is now the return value.

React makes it so that you cannot modify the props directly. Instead, they want
you to `React.cloneElement`. We will make a brand new copy of the child element,
and then followed by the props to apply `cloneElement(child, { here })`.

```javascript
function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  // Replace this with a call to React.Children and use the map() method.
  // We then can map() each child in `props.children` to a clone of that child.
  // You not able to mutate functions "objects" directly but you can copy.
  return React.Children.map(props.children, child => {
    // Remember you con't mutate directly objects ❌!
    child.props.on = on
    child.props.toggle = toggle
    return child
  })
  // Instead we iterate and pass in props using the `React.cloneElement` ✅.
  return React.Children.map(props.children, child => {
    const newChild = React.cloneElement(child, {on, toggle})
    return newChild
  })
  // https://reactjs.org/docs/react-api.html#reactchildren
  // https://reactjs.org/docs/react-api.html#cloneelement
}
```

We now get a new child returned by `cloneElement`. Remember those two children
"objects" are different. We have one thats at the original "object" reference in
memory. The one that was created by `<App>` as it rendered/called `Toggle`. And
now a new child cloned from that original object and returned.

## Extra Credit

### 1. 💯 Support DOM component children

A DOM component is a built-in component like `<div>`, `<span>`, or `<blink>`. A
composite component is a custom component like `<Toggle />` or `<App />`.

Try updating the `App` to this:

```javascript
function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}
```

Notice the error message in the console and try to fix it. The problem is we
passing props (that is state) in `<Toggle>` to its children and that includes
now a cloned copy of this `<span>` element but its not a type `react-element`
which is really a complex functional object.

```javascript
return React.Children.map(props.children, child => {
  if (typeof child.type === 'string') return child // if true return original
  const newChild = React.cloneElement(child, {on, toggle})
  return newChild
})
```

And if you wanted to define allowed types:

```javascript
return React.Children.map(props.children, child => {
  if (allowedType.includes(child.type)) {
    const newChild = React.cloneElement(child, {on, toggle})
    return newChild
  }
  return child // If child is not an allowed type, return child as is.
})
const allowedType = [ToggleOn, ToggleOff, ToggleButton]
```
