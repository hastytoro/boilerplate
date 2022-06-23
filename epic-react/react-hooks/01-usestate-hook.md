# useState: greeting

## 📝 Your Notes

## Background

Normally an interactive application will need to hold state somewhere. In React,
you use special functions called "hooks" to do this.

Common built-in hooks include:

- `React.useState`
- `React.useEffect`
- `React.useContext`
- `React.useRef`
- `React.useReducer`

Each of these is a special function that you can call inside your custom React
component function to store data (state) or perform actions (side-effects).

There are a few more built-in hooks that have special use cases, but the ones
above are what you'll be using most of the time.

Each hook has a unique API. Some return a value (`useRef` and `useContext`),
others return a pair of values (`useState` and `useReducer`), and others return
nothing at all (`useEffect`). Here's an example of a component that uses the
`useState` hook and an onClick handler to update state.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(count + 1)
  return <button onClick={increment}>{count}</button>
}
```

Our `useState` is a function that accepts a single argument. That argument is
the initial state for the instance of the component/function.

`useState` returns a pair of values. It does this by returning an array with two
elements (and we use destructuring syntax to assign each of those values to
distinct variables). The first of the pair is the state value and the second is
a function we can call to state updater function. We can name these variables
whatever we want. Common convention is to choose a name for the state variable,
then prefix `set` in front of that for the updater function.

**State can be defined as:** data that changes over time. So how does this work
over time? When the button is clicked, our `increment` function will be called
at which time we update the `count` by calling `setCount`.

When we call `setCount`, that tells React to re-render (update) our component.
Then the entire `Counter` component/function is re-run/re-called.

So when `useState` is called, the value we get back is the value that we called
`setCount` with. And it continues like that until `Counter` is unmounted
(removed from the application), or the user closes the application.

## Exercise

In this exercise we have a form where you can type in your name and it will give
you a greeting as you type. Fill out the `Greeting` component so that it manages
the state of the name and shows the greeting as the name is changed.

```jsx
function Greeting() {
  // Without hooks, React will not re-render any new JSX based on state changes.
  // The below is only going to function call on our the initial render (mount).
  // That means our callback handler will not be re-called on changes.
  "let name = '' // this will not re-render our component"
  'const handleChange = event => name = event.target.value'
  // That is why we need state managed by a 🪝 here!
  const [name, setName] = React.useState('')
  const handleChange = event => setName(event.target.value)
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}
```
