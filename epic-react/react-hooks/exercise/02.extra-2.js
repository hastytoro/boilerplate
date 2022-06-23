// useEffect: persistent state
// 💯 effect dependencies
// http://localhost:3000/isolated/final/02.extra-2.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  console.log('Greeting: rendering')
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName, // lazy initialization
  )

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
  const [count, setCount] = React.useState(0)
  const handleClick = () => setCount(preCount => preCount + 1)
  console.log('App: rendering')
  return (
    <>
      <button onClick={handleClick}>{count}</button>
      <Greeting />
    </>
  )
}

export default App
