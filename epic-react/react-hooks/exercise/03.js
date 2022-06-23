// Lifting state
// http://localhost:3000/isolated/exercise/03.js

import * as React from "react";

function Name({ name, onChange }) {
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={onChange} />
    </div>
  );
}

function Pet({ pet, onChange }) {
  return (
    <div>
      <label htmlFor="pet">Favorite pet: </label>
      <input id="pet" value={pet} onChange={onChange} />
    </div>
  );
}

function Display({ name, pet }) {
  return <div>{`Hey ${name}, your favorite pet is: ${pet}!`}</div>;
}

function App() {
  const [name, setName] = React.useState("");
  const [pet, setPet] = React.useState("");
  return (
    <form>
      {/* sibling components */}
      <Name name={name} onChange={(event) => setName(event.target.value)} />
      <Pet pet={pet} onChange={(event) => setPet(event.target.value)} />
      <Display name={name} pet={pet} />
    </form>
  );
}

export default App;
