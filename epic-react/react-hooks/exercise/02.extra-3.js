/* eslint-disable react-hooks/rules-of-hooks */
// useEffect: persistent state
// 💯 custom hook
// http://localhost:3000/isolated/final/02.extra-3.js

import * as React from 'react'
/* The best part of 🪝 is that if you find a bit of logic inside your component/function, you can extract it.
Make it a function call from the component that needs it (just like regular JavaScript).
What is recommended is to make it more generic, so that it's more reusable.
To follow convention custom functions/hooks are to be defined and prefixed with “use”.
Our custom hook called useLocalStorageState is more reusable and holds all logic.
What makes a custom hook, isn't that it starts with use, but that has 🪝 inside of it. 🪝 */

function useLocalStorage(key, value) {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || value, // lazy initialization
  )

  React.useEffect(() => {
    console.log('  useLocalStorage: effect 🪝 (🔫 on dependency change)')
    window.localStorage.setItem(key, state)
  }, [key, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName)

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
