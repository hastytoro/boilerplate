// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from "react";

// 1) First we need to create are context with `React.createContext`.
const CountContext = React.createContext();

// 2) Next we need the acting `<Provider>` function "component" that:
// - Gets the state and state updater with React.useState.
// - Used to define the `value` array that would generally hold state.
// - We return a `Context.Provider` with a value prop or forward all available.
// - But more specifically we need the `children` prop forwarded.
// - This wrapper component "wraps" component(s) and provides context `value`.
function CountProvider(props) {
  const [count, setCount] = React.useState(0);
  const value = [count, setCount];
  return <CountContext.Provider value={value} {...props} />;
}

// A sibling example:
function CountDisplay() {
  // 4) Consumer value from `useContext` API into our context.
  // We demonstrate not destructing the value props.
  const value = React.useContext(CountContext);
  const count = value[0];
  return <div>{`The current count is ${count}`}</div>;
}
// A sibling example:
function Counter() {
  // 4) Consumer value from `useContext` API into our context.
  // We demonstrate destructing the value props and ignoring the first one.
  const [value, setCount] = React.useContext(CountContext);
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>Increment</button>;
}

// 3) Here we wrap "descendant" consuming components within the <Provider>.
// We could have defined the <Context.Provider value={} {...props }> directly.
// But its cleaner to put everything into its own component (recommended).
// So that it can manage its own state, take props, side-effect etc...
function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  );
}

export default App;
