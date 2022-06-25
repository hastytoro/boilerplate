// Prop Collections
// http://localhost:3000/isolated/exercise/04.js

import * as React from "react";
import { Switch } from "../switch";

// Define a custom 🪝 that holds prop collections and getters.
function useToggle() {
  const [on, setOn] = React.useState(false);
  const toggleHandler = () => setOn(!on);
  return {
    on,
    toggleHandler,
    togglerProps: {
      "aria-pressed": on,
      onClick: toggleHandler,
    },
  };
}

function App() {
  const { on, togglerProps } = useToggle();
  return (
    <div>
      <Switch on={on} {...togglerProps} />
      <hr />
      <button aria-label="custom-button" {...togglerProps}>
        {on ? "on button" : "off button"}
      </button>
    </div>
  );
}

export default App;

/*
eslint
  no-unused-vars: "off",
*/
