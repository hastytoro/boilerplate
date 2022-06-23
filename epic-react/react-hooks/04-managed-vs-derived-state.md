# useState: tic tac toe

## Background

Often you need more than one element of state in your component, so you'll call
`useState` more than once. Remember each call to `useState` in a given component
will give you a unique state and updater function.

## Exercise

Here we have a tic-tac-toe application (with localStorage support)! This is from
the React official tutorial and includes the following:

- **Managed State:** state you need to explicitly manage
- **Derived State:** state you calculate based on other state

For example `squares` is **managed** state and it's the state of the board in a
single-dimensional array:

```
[
  'X', 'O', 'X',
  'X', 'O', 'O',
  'X', 'X', 'O'
]
```

This will start out as an empty array, as its the start of the game. And
`nextValue` is either the string `X` or `O` and is **derived** values and based
on the values of our **managed** `[squares]` state. We determine whose turn it
is based on how many `X` and `O` squares there are.

Our `winner` is either the string `X` or `O` and is calculated from **derived**
state. That's determined and based on values of **managed** `[squares]` state,
that we provide with the `calculateWinner` function to get that value.

```jsx
function Board() {
  // managed state: regular component state that you need to explicitly manage.
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  // derived state: values "calculated" based on values like our managed state.
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)
  ...
}
```

Application logic is handled by helper function calls. We **derive** values
based on our `[squares]` state. This will return **derived** state in areas of
our component UI that does not trigger component re-renders (updates).

We don't need to worry about updating these calculated values, as we are not
mutating our **managed** state data directly.

```javascript
// utility helper functions:
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return xSquaresCount === oSquaresCount ? 'X' : 'O'
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
```

The `<Board />` component is the main function. Here we return an array of state
called `[squares]` into our **managed** state.

These helper functions that calculate **derived** state values for us, they're
re-run on every render/call. That being each time our component/function itself
is called, that section of code is being read.

This is the interesting point, we have **managed** state that we're going to be
managing and then we have **derived** state/values, kind of all put together
That isolated copy/mutated data is then used in our state updater, updating our
**managed** state `[squares]`, triggering a component re-render (update). Our
state gets the updated values as copy from **derived** values.

Each square is represented by a `renderSquare` method, which simply renders a
`<button>` with that index position in our `[squares]` state/array. When that
button is clicked, we're going to call the `handleSquare` with that index.

Here the **derived** values help determine things like early exit logic or
ensure users can't do anything additional to the UI, see `handleSquare` method.
We copy our state with a (`...`) spread into a placeholder `squaresCopy`. This
ensures again that we do not mutate our React **managed** state, directly.

```jsx
function Board() {
  // managed state: regular component state that you need to explicitly manage.
  const [squares, setSquares] = React.useState(Array(9).fill(null))
  // derived state: values "calculated" based on values like our managed state.
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  const handleSquare = index => {
    if (winner || squares[index]) return // function exist logic
    const squaresCopy = [...squares]
    squaresCopy[index] = nextValue
    setSquares(squaresCopy)
  }

  const restart = () => setSquares(Array(9).fill(null))

  const renderSquare = i => (
    <button className="square" onClick={() => selectSquare(i)}>
      {squares[i]}
    </button>
  )

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}
```

In review, this is good practice as it prevents mutating of actually **managed**
React state data, directly. Keeping components "pure" like pure functions.

Remember in developing applications, data mutation is a problem. You don't want
to mutate state/data directly that's being managed in part. Rather isolate it by
copying/separating that state that its **derived**.

Otherwise you can have some unexpected bugs as React pretty much relies on the
fact that anytime there's a state change, you're triggering a render. If you're
mutating things, then you could have some stale closures that are referencing
mutated values, and in general, mutation leads to hard bugs to track down.

## Extra Credit

### 1. 💯 preserve state in localStorage

Here the `useEffect` 🪝 is used to JSON `stringify` our state `[squares]`, which
is an array object, into localStorage using the setItem method. The action is a
side-effect, outside of our React application managed state.

We initialize our state with either the default empty array or we `parse` JSON
values out of localStorage with the getItem method.

```jsx
function Board() {
  // managed state: regular component state that you need to explicitly manage.
  const [squares, setSquares] = React.useState(
    () =>
      JSON.parse(window.localStorage.getItem('squares')) || Array(9).fill(null),
  )
  React.useEffect(
    () => window.localStorage.setItem('squares', JSON.stringify(squares)),
    [squares],
  )
  ...
}
```

Lastly we optimize with a lazy initializer function and ensure our effect only
triggers a render when our managed state changes.

### 2. 💯 useLocalStorageState

Refactor your code to use that custom hook instead.

```javascript
function useLocalStorageState(
  key,
  value = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return value
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}
// Using the custom hook in our component:
function Board() {
  // managed state: regular component state that you need to explicitly manage.
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  ...
}
```
