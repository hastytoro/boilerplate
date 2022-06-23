// useEffect: persistent state
// 💯 lazy state initialization
// http://localhost:3000/isolated/final/02.extra-1.js

import * as React from 'react'
/* Right now, every time our component function is run, our function reads from `localStorage`.
This is problematic because it could be a performance bottleneck (that reading can be slow).
We only actually need to know the value from `localStorage` the first time this component is rendered!
- The additional reads are wasted effort.
To avoid this problem, React’s `useState` 🪝 allows you to pass a function instead of the actual value.
It will only call that function to get the state value when the component is rendered the first time.
Our expensive computation will only be called when it’s needed!
Make `useState` call use a lazy initialization to avoid wasteful re-rendering, on every state change. */
function Greeting({initialName = ''}) {
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName, // 💯 lazy initialization
  )

  React.useEffect(() => {
    window.localStorage.setItem('name', name) // 💯 persistent state
  })

  function handleChange(event) {
    setName(event.target.value)
  }

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
  return <Greeting />
}

export default App
