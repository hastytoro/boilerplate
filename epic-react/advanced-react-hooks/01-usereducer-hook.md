# useReducer: simple Counter

## 📝 Your Notes

## Background

With `useState` you can get really long way with React state management. You can
to separate state logic from the component in functions, from state changes.

In addition, if you have multiple elements of state that typically change
together, then having an object that contains elements of state can be quite
helpful. This is where `useReducer` 🪝 comes in handy.

Typically, you'll use `useReducer` with an object holding all your state, but
we're going to start by managing a single number (a `count`). We're doing this
to learn slowly the difference between the convention, and the actual API.

Important thing to note here is that the reducer (called `countReducer`) is
called with two arguments:

1. Your current state, that we do not mutate directly.
2. Whatever we action is dispatched (`setCount` as example).

- This newer state we dispatch is often called an "action".

## Extra Credit

### 1. 💯 accept the step as the action

The API works differently when working with objects. When the 🪝 initialized, it
had already been passed initial state to the JS reducer "state" argument.

So in dispatching an "action", how do we support it? Firstly, our reducer needs
to return an object to meet that initial requirement.

```jsx
// The first argument "state" which is the current `[count]` state.
// Next we pass an "action" to our `[setCount]` state updater function.
// From the component we trigger actions via a "dispatch" function.
// Whatever "action" we pass is generally newState or also called action.
function countReducer(state, newState) {
  console.log('current state: ', state)
  console.log('action (newer state): ', newState)
  return newState
}

function Counter({step, initial}) {
  // The first argument we pass to our is the reducer function.
  // Reducer accepts our current state and then  newState "action".
  // Action is whatever we "dispatch" (state updater function).
  // The second argument is the initial value for our state.
  const [count, setCount] = React.useReducer(countReducer, initial)
  const increment = () => setCount(count + step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter initial={0} step={2} />
}
```

This one is just to show that you can pass anything as the action.

### 2. 💯 simulate setState with an object

See if you can figure out how to make the state updater (`dispatch`) behave in a
similar way by changing our `state` to an object like `{count: 0}`. Then calling
the state updater with an object which merges with the current state.

So here's how I want things to look now:

```javascript
const [state, setState] = React.useReducer(countReducer, {
  count: initialCount,
})
const {count} = state
const increment = () => setState({count: count + step})
```

How would you need to change the reducer to make this work?

```jsx
const countReducer = (state, action) => {
  console.log(' reducer 🗽: state', state)
  console.log(' reducer 🎬: action', action)
  // We'll return a new `object` a combination of the current state and action.
  // Any additional properties that the action has, will override the state.
  // Best practice we not mutating state directly but returning a spread copy.
  return {...state, ...action}
}

function Counter({step = 1, initial = {count: 0}}) {
  const [state, dispatch] = React.useReducer(countReducer, initial)
  console.log('useReducer 🪝: state', state)
  // You would need to match that return object signature with an action object.
  // Are action will contain the destructured value from the current state.
  // You then pass that expression directly into your "action" object.
  // However for demonstration and understanding, lets use a action variable.
  const {count} = state
  const action = count + step
  const increment = () => {
    console.log('dispatch 📮: handler', action)
    dispatch({count: action}) // dispatch calls reducer!
  }
  return <button onClick={increment}>{count}</button>
}
```

Our reducer will just return an object that is a (`...`) spread combination of
current state and the action object. Any properties the action object has will
override the state properties within our return value.

```
useReducer 🪝: state {count: 0}
dispatch 📮: handler
reducer 🗽: state {count: 0}
reducer 🎬: action {count: 1}
useReducer 🪝: state {count: 1} /* 🥳 yes! */
```

This returned object literal does not mutate the React managed object directly.
We have now simulated are earlier `useState` implementation that managed more
complex state objects, with a `useReducer` 🪝 instead.

The state processed by a reducer function is immutable. That means the incoming
state (coming in as argument) is never directly changed. Because our reducer
function always has to return a new state object.

Remember React holds an immutable state data structure and again we use the
(`...`) spread syntax to create a newer copy of that state object from incoming
state, and the part we want to change within our component, the action.

### 3. 💯 simulate setState with an object OR function

Did you know the `dispatch` state updater (returned by our useReducer) can pass
a function to our reducer as an action. Below that function signature accepts a
current state that it then returns a object value. Here we're demonstrating how
functions in JavaScript are first class citizens. That you can pass functions,
to other higher order functions (HOF), as arguments.

```javascript
const increment = () =>
  setState(currentState => ({count: currentState.count + step}))
```

The API is still an object regarding initial setup. We're still plucking that
count value off of the state, but our increment handler will call the dispatch
with a function as our action, rather than an object. Now that anonymous arrow
function is responsible for handling how that state is returned.

See if you can figure out how to make your reducer support a function also.
Above we spreading `{...state, ...action}` both the current state and new
incoming state, known as action. Notice the action has a signature.

```
useReducer 🪝: state {count: 0} /* initial component render (mount) */
dispatch 📮: handler
reducer 🗽: state {count: 0}
reducer 🎬: action () => {} /* 🧐 */
useReducer 🪝: state {count: 0}
```

You would need to match up that returned object signature, with the action. You
could also pass an **expression** directly into your "action" we spreading.

Instead of just spreading the action, we need to determine whether that action
argument is equal `===` to a type of function, and if so invoke it. Otherwise,
we'll just return the action as an object, and just go ahead and spread it. In
either case, we're going to get back an object, that we (`...`) spread.

```jsx
const countReducer = (state, action) => {
  console.log(' reducer 🗽: state ', state)
  console.log(' reducer 🎬: action ', action)
  // We support both API's in our reducer:
  return {...state, ...(typeof action === 'function' ? action(state) : action)}
}

function Counter({step = 1, initial = 0}) {
  const [state, dispatch] = React.useReducer(countReducer, {count: initial})
  console.log('useReducer 🪝 state: ', state)
  const {count} = state
  const increment = () => {
    console.log('dispatch 📮 handler: ', count + step)
    // Submit either a function or object:
    dispatch(currentState => ({count: currentState.count + step}))
    dispatch({count: count + step})
  }
  return <button onClick={increment}>{count}</button>
}
```

There benefits to this type of an API. Which is why `this.setState` in class
components supported it. All we needed to change to support both a function or
object as the action is pass a needed expression and then spread the value in
either case. Using a `condition ? function : object` ternary operator.

### 4. 💯 traditional dispatching object switch statement (recommended)

Finally now we can see what most do conventionally (thanks to Redux). Here we
have Redux ⚛️ like version that is the recommended convention. The state updater
function is just known as `dispatch` 📮 handler. Each dispatch call passes a
different `action.type` 🎬 to our reduce function.

Our component still holds our state object. But different actions "calculations"
are re-located out of the component. The reducers ✂️ "reducing down", returning
different object variants based on the action required. Once a case matches it
returns new state, and that update results in a component render.

```jsx
function Counter({step = 1, initial = 0}) {
  const [state, dispatch] = React.useReducer(countReducer, {count: initial})
  console.log('useReducer 🪝 state: ', state)
  const {count} = state

  const increment = () => {
    console.log('dispatch 📮 handler: INCREMENT')
    dispatch({type: 'INCREMENT', step})
  }
  const decrement = () => {
    console.log('dispatch 📮 handler: DECREMENT')
    dispatch({type: 'DECREMENT', step})
  }

  return (
    <div>
      <button onClick={increment}>➕</button>
      <h1>{count}</h1>
      <button onClick={decrement}>➖</button>
    </div>
  )
}
```

Here we provide a `switch` statement to handle state management. Now depending
on the `action.type` 🎬, our switch will run and return different operations.

```javascript
const countReducer = (state, action) => {
  console.log(' reducer 🗽: state ', state)
  console.log(' reducer 🎬: action ', action)
  switch (action.type) {
    case 'INCREMENT':
      return {count: state.count + action.step}
    case 'DECREMENT':
      return {count: state.count - action.step}
    default:
      throw new Error(`Unsupported action type: ${action.type}.`)
  }
}
```

Because our reducer ✂️ function will always return a newer state object and your
React state 🗽 holds the more immutable data structure, again its recommended to
return a (`...`) spread copy and newer object. The `type` will determine the
part we want to change within our component.

## Other notes

### lazy initialization

This one's not an extra credit, but _sometimes_ lazy initialization can be
useful, so here's how we'd do that with our original hook:

```javascript
function init(initialStateFromProps) {
  return {
    pokemon: null,
    loading: false,
    error: null,
  }
}
...
const [state, dispatch] = React.useReducer(reducer, props.initialState, init)
```

So, if you pass a third function argument to `useReducer`, it passes the second
argument to that function and uses the return value for the initial state.

This could be useful if our `init` function read into localStorage or something
else that we wouldn't want happening every re-render.
