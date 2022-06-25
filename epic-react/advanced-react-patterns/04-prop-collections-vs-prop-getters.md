# Prop Collections and Getters

## 📝 Your Notes

## Background

**One liner:** The Prop Collections and Getters Pattern allows your hook to
support common use cases for UI elements with your hook.

In typical UI components, you need to take accessibility into account. For a
button functioning as a toggle, it should have the `aria-pressed` attribute set
to `true` or `false` if it's toggled on or off. In addition to remembering that,
people need to remember to also add the `onClick` handler to call `toggle`.

Lots of this is reusable logic that we can the components flexible. The hooks we
create here have some common use-cases to make it easier to use components the
right way, without requiring people to wire things up for common use cases.

**Real World Projects that use this pattern:**

- [downshift](https://github.com/downshift-js/downshift) (prop getters)
- [react-table](https://github.com/tannerlinsley/react-table) (prop getters)
- [`@reach/tooltip`](https://reacttraining.com/reach-ui/tooltip) (uses prop
  collections)

## Exercise Prop Collections

In our simple example, this isn't too much for folks to remember, but in more
complex components, the list of props that need to be applied to elements can be
extensive, so it can be a good idea to take the common use cases into a reusable
hook that allows us to make objects of props that people "consumers" can simply
(`...`) spread across the UI they render. Note, we not using a context API.

Let's create a collection of props for the most common use case when using our
`useToggle` custom 🪝. That being people using the hook probably want to wire up
some switch or button to the managed state 🗽, within our `useToggle` hook. We
are going to return an object `togglerProps`. These props are going to have all
values "collectively" that we typically would like applied to say a button UI.

```jsx
// Define a custom 🪝 that holds prop collections and getters.
function useToggle() {
  const [on, setOn] = React.useState(false);
  const toggleHandler = () => setOn(!on);
  return {
    on,
    toggleHandler,
    togglerProps: {
      "aria-pressed": on,
      onClick: toggleHandler,
    },
  };
}

function App() {
  const { on, togglerProps } = useToggle();
  return (
    <div>
      <Switch on={on} {...togglerProps} />
      <hr />
      <button aria-label="custom-button" {...togglerProps}>
        {on ? "on button" : "off button"}
      </button>
    </div>
  );
}
```

It probably looks a little bit too simple, but this pattern is very important.
That it demonstrates we should always continue to pass managed state 🗽 `on` and
the `toggleHandler` in the usual way so that developers using our custom 🪝 that
don't understand how to use the returned **prop collection and getter object**
`togglerProps` yet, that we're still providing the usual way for them to access
state and the handler mechanism for updating the state.

For our consumers use case of using the custom 🪝 to get the `togglerProps`.
They (`...`) spread that object across the props attribute position for the
components, giving us a working `<Switch>` and plain HTML toggle button.

## Extra Credit Prop Getters

### 1. 💯 prop getters

Let's talk about how prop collections fall over and where prop getters are
typically a better pattern. Say someone wants to use our `togglerProps` object,
but they need to apply their own `onClick` handler!

Try doing that by updating the `App` component to this:

```javascript
function App() {
  const { on, togglerProps } = useToggle();
  return (
    <div>
      <Switch on={on} {...togglerProps} />
      <hr />
      <button
        aria-label="custom-button"
        {...togglerProps}
        onClick={() => console.info("onButtonClick")}
      >
        {on ? "on" : "off"}
      </button>
    </div>
  );
}
```

Because we overwrite the implementation, it stops working. We can change the API
slightly so that instead of having a object of props "prop collection" returned,
we call a "getter" function instead to get props. Then we can pass that function
the props we want applied, and that function will be responsible for composing
the props together. Let's try that, update the `<App>` component to this:

```javascript
function useToggle() {
  const [on, setOn] = React.useState(false);
  const toggleHandler = () => setOn(!on);
  const propGetterToggle = ({ onClick, ...props } = {}) => {
    return {
      "aria-pressed": on,
      onClick: onClick || toggleHandler,
      ...props,
    };
  };
  return {
    on,
    toggleHandler,
    propGetterToggle,
  };
}

function App() {
  const { on, propGetterToggle } = useToggle();
  return (
    <div>
      <Switch {...propGetterToggle({ on })} />
      <hr />
      <button
        {...propGetterToggle({
          "aria-label": "custom-button",
          onClick: () => console.info("onButtonClick"),
          id: "custom-button-id",
        })}
      >
        {on ? "on button" : "off button"}
      </button>
    </div>
  );
}
```

This allows our consumers to have their own logic, and whatever else they want
to put in here while still being able to get capabilities from the props
returned from our custom 🪝 prop getter called `propGetterToggle`.
