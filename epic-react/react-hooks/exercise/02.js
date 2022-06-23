// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from "react";

function Greeting({ initialName = "" }) {
  // We initialize the state to the value from localStorage.
  const [name, setName] = React.useState(
    window.localStorage.getItem("name") || initialName
  );
  // Here's where you'll use `React.useEffect` 🪝.
  // The callback should set the `name` in localStorage.
  React.useEffect(() => window.localStorage.setItem("name", name));

  const handleChange = (event) => setName(event.target.value);
  // In review our side effect we wanted to run synchronized with our state of the world.
  // That outer state is from our localStorage and our inner state is from our application.
  // Every time our component re-renders, a effect callback will get called to do that synchronization.
  // Then as our component is initialized, we need to get that initial value out of localStorage.
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
  return <Greeting initialName="Bond" />;
}

export default App;
