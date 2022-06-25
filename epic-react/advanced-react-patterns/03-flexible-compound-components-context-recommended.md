# Flexible Compound Components (Recommended)

## 📝 Your Notes

## Background

We're going to take this compound component and make it even more flexible. The
parent at the moment, makes a clone of all children and forwards props that they
need, but what if those children aren't direct, but instead, they're nested.

The problem we're going to face is the children that we have accessible as the
prop children for `Toggle`, don't include all grandchildren (descendants). We've
got the ToggleOn, ToggleOff, and then the `<div>` only.

```jsx
function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  );
}
```

**One liner:** The Flexible Compound Components Pattern only differs from the
previous in that it uses React context API. Use this version more often.

As our parent component can only clone and pass props to immediate children. So
we need some way for our compound components to implicitly accept the on state
and toggle method regardless of where they're rendered within the `Toggle`
component's "posterity" :) with the `React.createContext` API.

**Real World Projects use this pattern:**

- [`@reach/accordion`](https://reacttraining.com/reach-ui/accordion)

## Exercise

The fundamental difference between this exercise and the last one is that now
we're going to allow people to render the compound components wherever they like
in the render "component" tree. Searching through `props.children` for the
components to clone would be futile. _So we'll use context instead._

Your job is to make the `ToggleContext` which will be used to _implicitly_ pass
"share" the state between these components. Then use a custom hook to be the
acting consumer that consumes context in compounded components. Our `<Toggle>`
is still going to get `children` from props, but context values are implicitly
"indirectly" provided by ToggleContext using `React.useContext`.

```jsx
// 1) Define are ToggleContext context API ⚛️:
// https://reactjs.org/docs/context.html#reactcreatecontext
const ToggleContext = React.createContext();

function Toggle({ children }) {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);
  // 2) Setup the ToggleContext `<Provider>` component 👨🏻:
  // Use context store to pass state to consumers via the `value` object.
  // Ensure we enclose the children within the `<Provider>`.
  return (
    <ToggleContext.Provider value={{ on, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
}

// 3) We choosing to consume that context value in a `useToggle` custom 🪝.
// You can create a "helper" function this custom 🪝 to retrieve the context.
// Thanks to that, context won't be exposed to users but just our helper.
// https://reactjs.org/docs/hooks-reference.html#usecontext
function useToggle() {
  return React.useContext(ToggleContext);
}

// 4) Child components can call our custom hook to retrieve the context value.
// Remove props that we we're going to get from the context API instead.
function ToggleOn({ children }) {
  const { on } = useToggle();
  return on ? children : null;
}
function ToggleOff({ children }) {
  const { on } = useToggle();
  return on ? null : children;
}
function ToggleButton({ props }) {
  const { on, toggle } = useToggle();
  return <Switch on={on} onClick={toggle} {...props} />;
}
```

We're still "indirectly" sharing state between components and all children of
the compound component, the companions. But we are doing so that it doesn't care
about the depth of the tree. This is likely the best use case for a context API,
where we can share and expose _implicit_ state for components for use without
them worrying about the state that's being managed in a context module.
