// Lifting state
// 💯 co-locating state
// http://localhost:3000/isolated/final/03.extra-1.js

import * as React from "react";

function Name() {
  const [name, setName] = React.useState("");
  const handleChange = (event) => setName(event.target.value);
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={handleChange} />
      <h3>{`Hi my name is ${name}.`}</h3>
    </div>
  );
}

function Pet() {
  const [pet, setPet] = React.useState("");
  const handleChange = (event) => setPet(event.target.value);
  return (
    <div>
      <label htmlFor="pet">Pet: </label>
      <input id="pet" value={pet} onChange={handleChange} />
      <h4>{`My favorite pet is: ${pet}!`}</h4>
    </div>
  );
}

function App() {
  return (
    <form>
      <Name />
      <Pet />
    </form>
  );
}

export default App;
