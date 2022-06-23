// Hook flow
// https://github.com/donavon/hook-flow
// http://localhost:3000/isolated/examples/hook-flow.js

// PLEASE NOTE: there was a subtle change in the order of cleanup functions
// getting called in React 17:
// https://github.com/kentcdodds/react-hooks/issues/90

import * as React from 'react'

// https://github.com/donavon/hook-flow
// useEffect(() => ,no deps) - setup 🌐 compared to both (componentDidMount and componentDidUpdate)
// useEffect(() => ,[empty deps]) - setup 🌐 compared to (componentDidMount)
// useEffect(() => ,[with deps]) - setup 🌐 compared to (componentDidUpdate)
function Child() {
  console.log('%c    Child: render - start 🎬', 'color: MediumSpringGreen')

  const [count, setCount] = React.useState(() => {
    console.log(
      '%c    Child: useState - state 📦 [count, setCount]',
      'color: tomato',
    )
    return 0
  })

  React.useEffect(() => {
    console.log(
      '%c    Child: useEffect(() => ,no deps) - setup 🌐 (runs all the time)',
      'color: hsl(210, 100%, 80%)',
    )
    return () => {
      console.log(
        '%c    Child: useEffect(() => ,no deps) - cleanup 🧹 (runs all the time)',
        'color: hsl(210, 100%, 80%)',
      )
    }
  })

  React.useEffect(() => {
    console.log(
      '%c    Child: useEffect(() => ,[empty deps]) - setup 🌐 (runs initial render/mount)',
      'color: hsl(210, 100%, 70%)',
    )
    return () => {
      console.log(
        '%c    Child: useEffect(() => ,[empty deps]) - cleanup 🧹 (runs initial render/mount)',
        'color: hsl(210, 100%, 70%)',
      )
    }
  }, [])

  React.useEffect(() => {
    console.log(
      '%c    Child: useEffect(() => ,[with dep]) - setup 🌐 (runs re-render/updates)',
      'color: hsl(210, 100%, 60%)',
    )
    return () => {
      console.log(
        '%c    Child: useEffect(() => ,[with dep]) - cleanup 🧹 (runs re-render/updates)',
        'color: hsl(210, 100%, 60%)',
      )
    }
  }, [count])

  const handleClick = () => {
    console.log(
      '%c    Child: handleClick - event 🔥',
      'color: MediumSpringGreen',
    )
    setCount(previousCount => previousCount + 1)
  }
  const element = <button onClick={handleClick}>{count}</button>

  console.log('%c    Child: render - end 🏁', 'color: MediumSpringGreen')

  return element
}

function App() {
  console.log('%cApp: render - start 🎬', 'color: MediumSpringGreen')

  const [showChild, setShowChild] = React.useState(() => {
    console.log(
      '%cApp: useState - state 📦 [showChild, setShowChild]',
      'color: tomato',
    )
    return false
  })

  React.useEffect(() => {
    console.log(
      '%cApp: useEffect(() => ,no deps) - setup 🌐 (runs all the time)',
      'color: hsl(210, 100%, 80%)',
    )
    return () => {
      console.log(
        '%cApp: useEffect(() => ,no deps) - cleanup 🧹 (runs all the time)',
        'color: hsl(210, 100%, 80%)',
      )
    }
  })

  React.useEffect(() => {
    console.log(
      '%cApp: useEffect(() => ,[empty deps]) - setup 🌐 (runs initial render/mount)',
      'color: hsl(210, 100%, 70%)',
    )
    return () => {
      console.log(
        '%cApp: useEffect(() => ,[empty deps]) - cleanup 🧹 (runs initial render/mount)',
        'color: hsl(210, 100%, 70%)',
      )
    }
  }, [])

  React.useEffect(() => {
    console.log(
      '%cApp: useEffect(() => ,[with dep]) - setup 🌐 (runs re-render/updates)',
      'color: hsl(210, 100%, 60%)',
    )
    return () => {
      console.log(
        '%cApp: useEffect(() => ,[with dep]) - cleanup 🧹 (runs re-render/updates)',
        'color: hsl(210, 100%, 60%)',
      )
    }
  }, [showChild])

  const handleChange = event => {
    console.log('%cApp: handleChange - event 🔥', 'color: MediumSpringGreen')
    setShowChild(event.target.checked)
  }

  const element = (
    <>
      <label>
        <input type="checkbox" checked={showChild} onChange={handleChange} />{' '}
        show child
      </label>
      <div
        style={{
          padding: 10,
          margin: 10,
          height: 30,
          width: 30,
          border: 'solid',
        }}
      >
        {showChild ? <Child /> : null}
      </div>
    </>
  )

  console.log('%cApp: render - end 🏁', 'color: MediumSpringGreen')

  return element
}

export default App
