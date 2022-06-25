# State Reducer

## 📝 Your Notes

## Background

**One liner:** The State Reducer Pattern inverts control over the state
management of your hook and/or component to the developer using it so they can
control the state changes that happen when dispatching events.

The life of a reusable component, a feature request may be made over and over
again to handle different cases and cater to different scenarios.

We could definitely add props to our component and add logic in our reducer for
how to handle these different cases and expand context API to support them, but
there's a never ending list of logical customizations that "people" want out of
a custom hook and we don't want to have to code for every use case.

Read more about this pattern in:
[The State Reducer Pattern with React Hooks](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks)

**Real World Projects that use this pattern:**

- [downshift](https://github.com/downshift-js/downshift)

## Exercise

We demonstrate this here, we want to prevent toggle from updating toggle state
after it's been clicked 4 times in a row before resetting. We could easily add
that logic to our reducer, but instead we're going to apply a computer science
pattern called **inversion of control** where we effectively say: "Here you go!
You have complete control over how this thing works.

> Before React Hooks, this was pretty tricky to implement and resulted in pretty
> weird code, but with useReducer, this is way better, ❤️ hooks.

Your job is to enable people to provide a custom `reducer` so they can have
complete control over how state updates happen in our `<Toggle />`. You will
notice we default to `toggleReducer` should nothing be provided.

```javascript
// Default reducer function ✂️ for `useToggle`:
function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case 'toggle': {
      return {on: !state.on}
    }
    case 'reset': {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  // dispatch functions
  const toggle = () => dispatch({type: actionTypes.toggle})
  const reset = () => dispatch({type: actionTypes.reset, initialState})

  // prop getters:
  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }
  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}
```

Above, all that we had to do is support and accept a `reducer` option for our
custom hook and default that to reducer if nothing was provided. Below our `App`
has a reducer called `toggleStateReducer` that is passed to our custom 🪝.

```jsx
function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  const clickedTooMuch = timesClicked >= 4

  function toggleStateReducer(state, action) {
    switch (action.type) {
      case 'toggle': {
        if (clickedTooMuch) return {on: state.on}
        return {on: !state.on}
      }
      case 'reset': {
        return {on: false}
      }
      default: {
        throw new Error(`Unsupported type: ${action.type}`)
      }
    }
  }

  // We use the custom 🪝 but we provide our "own" reducer to it.
  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {/* conditional rendering: */}
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      {/* resetting button */}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}
```
