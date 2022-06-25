// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from "react";
import { Switch } from "../switch";

function Toggle(props) {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);
  // Replace this with a call to React.Children and use the map() method.
  // We then can map() each child in `props.children` to a clone of that child.
  // You not able to mutate functions "objects" directly but you can copy.
  /* 
  return React.Children.map(props.children, child => {
    // Remember you con't mutate directly objects ❌!
    child.props.on = on
    child.props.toggle = toggle
    return child
  }) 
  */
  // Instead we iterate and pass in props using the `React.cloneElement`.
  return React.Children.map(props.children, (child) => {
    if (allowedType.includes(child.type)) {
      const newChild = React.cloneElement(child, { on, toggle });
      return newChild;
    }
    return child; // If child is not an allowed type, return child as is.
  });
  // https://reactjs.org/docs/react-api.html#reactchildren
  // https://reactjs.org/docs/react-api.html#cloneelement
}

const ToggleOn = ({ on, children }) => (on ? children : null);
const ToggleOff = ({ on, children }) => (on ? null : children);
const ToggleButton = ({ on, toggle }) => <Switch on={on} onClick={toggle} />;

const allowedType = [ToggleOn, ToggleOff, ToggleButton];

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on (children content)</ToggleOn>
        <ToggleOff>The button is off (children content)</ToggleOff>
        <ToggleButton />
        <span>Hello, I am a span child!</span>
      </Toggle>
    </div>
  );
}

export default App;

/*
eslint
  no-unused-vars: "off",
*/
