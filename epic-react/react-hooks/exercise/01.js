// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function Greeting() {
  // The below is only going to function call on initial render (mount).
  // Our callback handler will also not be re-called on changes.
  // Without hooks, React will not re-render any new JSX based on state changes.
  "let name = '' // this will not re-render our component"
  'const handleChange = event => name = event.target.value'
  // React.useState 🪝 returns a pair of values.
  // It does this by returning an array with two elements (and we use destructuring syntax).
  // The first of the pair is the state value and the second is a state updater function we can call.
  // Common convention is any name for the state variable, then prefix set for the updater function.
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

function App() {
  return <Greeting />
}

export default App
