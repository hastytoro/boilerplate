// useEffect: persistent state
// 💯 flexible localStorage hook
// http://localhost:3000/isolated/final/02.extra-4.js

import * as React from "react";

function useLocalStorageState(
  key,
  defaultValue = "",
  // Here we are supplying an optional configuration object.
  // Using {serialize, deserialize } with = {} fixes the error.
  // If you do not pass an argument, then destructuring would error.
  // https://jacobparis.com/blog/destructure-arguments for detail.
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, setState] = React.useState(() => {
    const value = window.localStorage.getItem(key);
    // Here we try/catch in case the localStorage value was set before.
    // If truthy `parse` to retrieve the value and falsy we remove previous key.
    if (value) {
      try {
        return deserialize(value);
      } catch (error) {
        window.localStorage.removeItem(key);
      }
    }
    return value;
  });

  const prevKeyRef = React.useRef(key);
  React.useEffect(() => {
    if (prevKeyRef.current !== key) {
      window.localStorage.removeItem(prevKeyRef.current);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}

function Greeting({ initialName = "" }) {
  const [name, setName] = useLocalStorageState("name", initialName);

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : "Please type your name"}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
