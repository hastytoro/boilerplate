// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {Switch} from '../switch'

// 1) Define are ToggleContext context API ⚛️:
// https://reactjs.org/docs/context.html#reactcreatecontext
const ToggleContext = React.createContext()

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  // 2) Setup the ToggleContext `<Provider>` component 👨🏻:
  // Use context store to pass state to consumers via the `value` object.
  // Ensure we enclose the children within the `<Provider>`.
  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {children}
    </ToggleContext.Provider>
  )
}

// 3) We choosing to consume that context value in a `useToggle` custom 🪝.
// You can create a "helper" function this custom 🪝 to retrieve the context.
// Thanks to that, context won't be exposed to users but just our helper.
// https://reactjs.org/docs/hooks-reference.html#usecontext
function useToggle() {
  return React.useContext(ToggleContext)
}

// 4) Child components can call our custom hook to retrieve the context value.
// Remove props that we we're going to get from the context API instead.
function ToggleOn({children}) {
  const {on} = useToggle()
  return on ? children : null
}

function ToggleOff({children}) {
  const {on} = useToggle()
  return on ? null : children
}

function ToggleButton({props}) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
