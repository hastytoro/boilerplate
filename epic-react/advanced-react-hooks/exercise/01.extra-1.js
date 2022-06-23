// useReducer: simple Counter
// 💯 accept the step as the action
// http://localhost:3000/isolated/final/01.extra-1.js

import * as React from 'react'

// The first argument is called "state" which is the current 🪝 state being `[count]`.
// Next we pass an "action" to our 🪝 state updater function `[setCount]` defined in the component.
// Within the component we trigger these actions passed to our "dispatch()" state updater function.
// Whatever "action" we pass in here, is generally your newState.
function countReducer(state, newState) {
  console.log(state)
  console.log(newState)
  return newState
}

function Counter({initialValue, step}) {
  // The first argument we pass to our 🪝 is the JS reducer function.
  // The above helper function accepts our current state and then an "action".
  // The action is whatever the "dispatch()" (state updater function) is called with.
  // The second argument is the initial value for our state, which happens to be a number.
  const [count, setCount] = React.useReducer(countReducer, initialValue)

  const increment = () => setCount(count + step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter initialValue={0} step={2} />
}

export default App
