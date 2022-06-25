# Context Module Functions

## 📝 Your Notes

Elaborate on your learnings here in `src/exercise/01.md`

## Background

**One liner:** The Context Module Functions Pattern allows you to encapsulate a
complex set of state changes into a utility function which can be tree-shaken
and lazily loaded. Here we have a simple context and a reducer combo:

```javascript
// src/context/counter.js
const CounterContext = React.createContext()

function CounterProvider({step = 1, initialCount = 0, ...props}) {
  const [state, dispatch] = React.useReducer(
    // reducer inline:
    (state, action) => {
      const change = action.step ?? step
      switch (action.type) {
        case 'increment': {
          return {...state, count: state.count + change}
        }
        case 'decrement': {
          return {...state, count: state.count - change}
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
      }
    },
    {count: initialCount},
  )

  const value = [state, dispatch]
  return <CounterContext.Provider value={value} {...props} />
}

function useCounter() {
  const context = React.useContext(CounterContext)
  if (context === undefined) {
    throw new Error(`useCounter must be used within a CounterProvider`)
  }
  return context
}

export {CounterProvider, useCounter}
```

Lastly our component ⚙️ makes use of the `useCounter` custom hook.

```jsx
// src/components/counter.js
import {useCounter} from 'context/counter'
function Counter() {
  const [state, dispatch] = useCounter()
  const increment = () => dispatch({type: 'increment'})
  const decrement = () => dispatch({type: 'decrement'})
  return (
    <div>
      <div>Current Count: {state.count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}

// src/index.js
import {CounterProvider} from 'context/counter'
function App() {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  )
}
```

> You can pull this example up here:
> http://localhost:3000/isolated/examples/counter-before.js

Focus on the user/consumer of our reducer (the `Counter` component). Notice that
they have to create their own `increment` and `decrement` functions above which
call the `dispatch`, and thats not a super great API.

As that becomes even more of an annoyance when you have a sequence of `dispatch`
functions that need to be called (like you'll see in our exercise). The first
urge would be creating "helper" functions and include them in context. Placing
them in a `useCallback` so we can list our "helpers" as dependency:

```javascript
const increment = React.useCallback(
  () => dispatch({type: 'increment'}),
  [dispatch],
)
const decrement = React.useCallback(
  () => dispatch({type: 'decrement'}),
  [dispatch],
)
const value = {state, increment, decrement}
return <CounterContext.Provider value={value} {...props} />

// now users can consume it like this:
const {state, increment, decrement} = useCounter()
```

This isn't a _bad_ solution necessarily but
[as Dan says](https://twitter.com/dan_abramov/status/1125758606765383680):

> Helper methods are object junk that we need to recreate and compare for no
> purpose other than superficially nicer looking syntax.

Dan recommends (what Facebook does) is pass dispatch as you originally had. And
to solve the annoyance, they use importable "helpers" that accept `dispatch`.
Let's take a look at how that would look:

```javascript
// src/context/counter.js
const CounterContext = React.createContext()
function CounterProvider({step = 1, initialCount = 0, ...props}) { ... }
function useCounter() { ... }

// We introduce importable "helper" functions that accept dispatch:
const increment = dispatch => dispatch({type: 'increment'})
const decrement = dispatch => dispatch({type: 'decrement'})

export {CounterProvider, useCounter, increment, decrement}
```

Lastly our component ⚙️ makes use of the `useUser` custom hook and **now** the
helper importable functions that accept dispatching.

```jsx
// src/screens/counter.js
import {useCounter, increment, decrement} from 'context/counter'

function Counter() {
  const [state, dispatch] = useCounter()
  return (
    <div>
      <div>Current Count: {state.count}</div>
      <button onClick={() => decrement(dispatch)}>-</button>
      <button onClick={() => increment(dispatch)}>+</button>
    </div>
  )
}
```

This may look like overkill, **and it is.** However, in some situations this
pattern can not only help you reduce duplication, but it also
[helps improve performance](https://twitter.com/dan_abramov/status/1125774170154065920)
and helps you avoid mistakes in dependency lists.

Its not recommended all the time, but sometimes it can be a help! If you need to
review the context API ⚛️, here are the docs:

- https://reactjs.org/docs/context.html
- https://reactjs.org/docs/hooks-reference.html#usecontext

**Recommended:** You may notice that the context provider/consumers in React
DevTools just display as `Context.Provider` and `Context.Consumer`. That doesn't
do a good job differentiating itself from other contexts that may be in your
App. Luckily, you can set the context `displayName` and it'll display that name
for the `Provider` and `Consumer`. Hopefully in the future this will happen
automatically ([learn more](https://github.com/babel/babel/issues/11241)).

```javascript
const MyContext = React.createContext()
MyContext.displayName = 'MyContext'
```

## Exercise

We have a user settings page where we render a form for the user's information.
We'll be storing the user's information in context and we'll follow patterns for
exposing ways to keep that context updated as well as interact with a backend.

Below our context API holds the context value, reducer, provider and a custom
hook as the consumer. Note UI components in basic designs are also consumers,
meaning they interact with providers directly.

But to remove duplicated code and make this process more reusable, we have a
custom 🪝 that is an acting "middleman/middleware" for UI components.

```javascript
// 1) Firstly lets define our context API with `createContext`.
// We going to store our context values 📦.
const UserContext = React.createContext()
UserContext.displayName = 'UserContext'

// 2) Our information managed state is controlled by a reducer ✂️:
// Depending on the action dispatched we match a case returning a object.
function userReducer(state, action) {
  switch (action.type) {
    case 'start update': {
      return {
        ...state,
        user: {...state.user, ...action.updates},
        status: 'pending',
        storedUser: state.user,
      }
    }
    case 'finish update': {
      return {
        ...state,
        user: action.updatedUser,
        status: 'resolved',
        storedUser: null,
        error: null,
      }
    }
    case 'fail update': {
      return {
        ...state,
        status: 'rejected',
        error: action.error,
        user: state.storedUser,
        storedUser: null,
      }
    }
    case 'reset': {
      return {
        ...state,
        status: null,
        error: null,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// 2) Here we define a <Provider> 👨🏻 that will reducer into our context values.
// The dispatch will reduce and match the action to determine returned state.
// Following that we insert the returned dispatched object into context `value`
function UserProvider({children}) {
  const {user} = useAuth()
  const [state, dispatch] = React.useReducer(userReducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  })
  const value = [state, dispatch]
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// 3) Here we `useContext` as consumer 🛍 of our <Provider> component.
// This custom 🪝 and the above "collectively" will be used from the same file.
function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return context
}
```

Currently the `UserSettings` component is calling the dispatch directly. Your
job is to move that to a module-level "helper" function. That accepts dispatch
as well as the rest of the info needed to execute a sequence of dispatches.

```jsx
function UserSettings() {
  const [{user, status, error}, userDispatch] = useUser()
  const isPending = status === 'pending'
  const isRejected = status === 'rejected'
  const [formState, setFormState] = React.useState(user)
  const isChanged = !dequal(user, formState)

  const handleChange = (e) =>
    setFormState({...formState, [e.target.name]: e.target.value})

  const handleSubmit = (event) => {
    event.preventDefault()
    // As explained, the following logic should move out into a helper function.
    userDispatch({type: 'start update', updates: formState})
    userClient.updateUser(user, formState).then(
      updatedUser => userDispatch({type: 'finish update', updatedUser}),
      error => userDispatch({type: 'fail update', error}),
    )
  }

  return ( ... )
}
```

Our goal is to take that `handleSubmit` logic inside our consumer component, the
`UserSettings` and move that into a separate "importable" helper function that
accepts a `dispatch`, that we expose within context API module.

```javascript
function updateUser(dispatch, user, update) {
  dispatch({type: 'start update', updates: update})
  return userClient.updateUser(user, update).then(
    updatedUser => dispatch({type: 'finish update', updatedUser}),
    error => dispatch({type: 'fail update', error}),
  )
}
```

Or we can use an `async...await` version of the above helper.

```javascript
async function updateUser(dispatch, user, update) {
  dispatch({type: 'start update', updates: update})
  try {
    const updatedUser = await userClient.updateUser(user, update)
    dispatch({type: 'finish update', updatedUser})
    return updatedUser
  } catch (error) {
    dispatch({type: 'fail update', error})
    throw error
  }
}
```

We can assume that it can take a `dispatch` as our helper will be part of our
`userContext` module/script. Additionally we going to pass in arguments needed
for the dispatching action, and promise call.

Finally we going to export that as part of the context module. That means the
context has the following: `export {UserProvider, useUser, updateUser}`.This is
typically the way you would do it, put all of these functions within a single
module, and then export all, and then import where they're needed.

> To keep things simple we're leaving everything in one file, but normally
> you'll put the context in a separate module.

The benefit to this way, when we have multiple `dispatch` calls, if we just
leave that up to the user/consumer of our context, its possible they may miss a
dispatch call or use the wrong order. It's better to pass that `dispatch` to
this context module function, so it can ensure we're calling the dispatches.

A common thing that people will do instead is they'll put the `updateUser` logic
inside of their consuming hook or maybe even inside of the value, but then you
have to worry about memorizing a whole bunch of stuff to make sure that you can
use these functions inside of a `useEffect` dependency list or a `useCallback`
dependency list. That can have a spider effect across your entire code base.

```javascript
function UserProvider({children}) {
  const {user} = useAuth()
  const [state, dispatch] = React.useReducer(userReducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  })
  const value = [state, dispatch]
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
```

Typical pattern, where they take the state returned from the `useReducer`. Also
expose the dispatch within context `value = [state, dispatch]`. Then dispatches
themselves within context, is available to be used directly by consumers.

In review, we allow consumers to have multiple dispatch calls as needed to make
for asynchronous UI updates as seen above. We made the exporting context module
available to accept a dispatch, as well as anything else that's needed. That
will manage the calls to dispatching correctly.
