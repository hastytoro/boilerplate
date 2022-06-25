// Prop Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from "react";
import { Switch } from "../switch";

// Define a custom 🪝 that holds prop collections and getters.
function useToggle() {
  const [on, setOn] = React.useState(false);
  const toggleHandler = () => setOn(!on);

  const propGetterToggle = ({ onClick, ...props } = {}) => {
    return {
      "aria-pressed": on,
      onClick: onClick || toggleHandler,
      ...props,
    };
  };
  return {
    on,
    toggleHandler,
    propGetterToggle,
  };
}

function App() {
  const { on, propGetterToggle } = useToggle();
  return (
    <div>
      <Switch {...propGetterToggle({ on })} />
      <hr />
      <button
        {...propGetterToggle({
          "aria-label": "custom-button",
          onClick: () => console.info("onButtonClick"),
          id: "custom-button-id",
        })}
      >
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
