# useEffect: persistent state

## 📝 Your Notes

## Background

`useEffect` is a built-in 🪝 that allows you to run some custom code after React
renders (and re-renders) your component to the DOM. It accepts a callback which
React will call after the DOM has been updated:

```javascript
React.useEffect(() => {
  // Your side-effect callback code here.
  // Example you can make HTTP requests or interact with browser APIs.
})
```

## Exercise

Below we're going to enhance our `<Greeting />` component to get its initial
state value from `localStorage` (if available) and keep it updated.

```jsx
function Greeting({initialName = ''}) {
  // We initialize the state to the value from localStorage.
  const [name, setName] = React.useState(
    window.localStorage.getItem('name') || initialName,
  )
  const handleChange = event => setName(event.target.value)
  // Here's where you'll use `React.useEffect` 🪝.
  // The callback should set the `name` state in localStorage.
  React.useEffect(() => window.localStorage.setItem('name', name))
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Bond" />
}
```

In review our side effect runs synchronized with our external world state. That
outer state, is from our `localStorage` and our inner state from our `<App />`.
Every time our component re-renders (updates), a effect callback gets called to
do that synchronization of state. And above when our component initializes, we
need to get that initial value out of localStorage.

## Extra Credit

### 1. 💯 lazy state initialization

Right now, every time our component function is run, our function reads from
external `localStorage`. This is problematic because it could be a performance
bottleneck (reading from localStorage can be slow).

And we only actually need to know the value from `localStorage` the first time
this component is rendered! So the additional reads are not optimal.

To avoid, React's `useState` hook allows you to pass a function instead of the
actual value, and then it will **only** call that function to get the state
value when the component is rendered, the first render (mount). So you can go
from this: `useState(someExpensiveComputation())` to this:

`useState(() => someExpensiveComputation())` the lazy callback function will
only be called when it's needed! Make `useState` call use lazy initialization to
avoid a performance bottleneck of reading into `localStorage` on every render.

```jsx
function Greeting({initialName = ''}) {
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName, // 💯 lazy initialization
  )
  ...
}
```

### 2. 💯 effect dependencies

The callback we're passing to `useEffect` is called after every render (mount)
of our component, including re-renders (updates). This is what we want, because
we want to make sure that state like `name` is saved whenever it changes. What
is sub-optimal, there are various reasons a component can be re-rendered. Like
when a parent component in the application tree gets re-rendered (updated).

To improve this we only want `localStorage` to get updated when state actually
changes. It doesn't need to re-run, called, rendered every time. Luckily for us,
`useEffect` allows you to pass a second argument, called **dependency array**.

```jsx
function Greeting({initialName = ''}) {
  console.log('Greeting: rendering')
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName,
  )
  const handleChange = event => setName(event.target.value)

  React.useEffect(() => {
    console.log('  Greeting: effect 🪝 (🔫 all the time until unmount)')
    window.localStorage.setItem('name', name)
  })

  React.useEffect(() => {
    console.log('  Greeting: effect 🪝 (🔫 on initial mount only)')
    window.localStorage.setItem('name', name)
  }, [])

  React.useEffect(() => {
    console.log('  Greeting: effect 🪝 (🔫 only on dependency change)')
    window.localStorage.setItem('name', name)
  }, [name])
  ...
}
```

That will signal to React that your effect callback function should be called
when dependencies changes only. We can use this to avoid unnecessary work! Add a
dependency to avoid the effect callback from being called too frequently.

### 3. 💯 custom hook

The best part, if you find your logic inside your component "function" can be
useful elsewhere, you can put that in another function and call it from other
components that need it (just like regular JS).

These functions you create are called "custom hooks". Create a custom 🪝 called
`useLocalStorageState`, for reusability of all this logic.

```jsx
function useLocalStorage(key, value) {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || value,
  )
  React.useEffect(() => {
    console.log('  useLocalStorage: effect 🪝 (🔫 on dependency change)')
    window.localStorage.setItem(key, state)
  }, [key, state])
  return [state, setState]
}

function Greeting({initialName = ''}) {
  console.log('Greeting: rendering')
  const [name, setName] = useLocalStorage('name', initialName)
  const handleChange = event => setName(event.target.value)
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}
```

### 4. 💯 flexible localStorage hook

Take your custom hook and make it generic to support any data type. Remember
localStorage needs you to serialize objects to strings. That means you will use
the `JSON.stringify` and `JSON.parse` methods for the passing value in our hook.

For example, what if the value is a number, then its going to get coerced into a
string when we set that item into localStorage. Then when we try to get it out,
it's going to be a string as well. We need to `parse` (deserialize) this out and
`stringify` (serialize) into JSON storage when needed.

**Serialization** is the process of converting an object into a stream bytes so
that it can be stored. Above we wish to store/convert it into JSON format, which
that encodes objects in a _string_. We then transmit this to memory, a database,
or a file. Its main purpose is to save the state of an object in order to be
able to recreate it when needed. **Deserialization** is the reverse process that
would be converting our JSON formatted object (the _string_), into JS object.

A handy way to do this in reusable function, is by providing a optional argument
that is pre-configured. Now anyone using our custom 🪝 can override the optional
argument or by doing nothing it's defaulted to an empty object literal.

That prevents errors and ensures anyone consuming our hook does't have to worry
about this options argument. And they can pretty much do whatever they want to
these serialize and deserialize "destructured" parameter variables.

Note, you need to include `serialize` method as part of the effect dependency.
The reason its important is that if the serialized function itself changed, then
that would probably need to serialize again our data before saving into storage.
If the `serialize` function changed, then the value that we're setting into
`localStorage`, probably be changed as well.

```jsx
function useLocalStorageState(
  key,
  defaultValue = '',
  // Here we are supplying optional argument an "options" config object.
  // Using {serialize, deserialize } with = {} fixes the error.
  // If you do not pass an argument, then destructuring would error.
  // https://jacobparis.com/blog/destructure-arguments for detail.
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const value = window.localStorage.getItem(key)
    // Here we try/catch in case the localStorage value was set before.
    // If truthy `parse` to retrieve the value and falsy we remove previous key.
    if (value) {
      try {
        return deserialize(value)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return value
  })

  const prevKeyRef = React.useRef(key)
  React.useEffect(() => {
    if (prevKeyRef.current !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}
```

To keep track of the previous `key` value argument, we can ensure we remove any
older records that can be stale with the use of the React `useRef` hook. Notice
we using the hook not only for interacting with DOM nods.

Again we removing the older `key` value from the previous rendering, and then
setting a the new one it its not the same. We'll do this for every single time
this `useEffect` is called/rendered.

That way, we tracking what the previous key was through the entire lifecycle of
this component. Then we set the item to have that `key`.

## Notes

If you'd like to learn more about when different hooks are called and the order
in which they're called, then open up `hook-flow.png` and `hook-flow.js`.

Play around with that a bit and hopefully that will help solidify this for you.
Note that understanding this isn't absolutely necessary for you to understand
hooks, but it _will_ help you in some situations so it's useful to understand.
