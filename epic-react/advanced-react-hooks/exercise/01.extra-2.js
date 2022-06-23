// useReducer: simple Counter
// 💯 simulate setState with an object
// http://localhost:3000/isolated/final/01.extra-2.js

import * as React from "react";

const countReducer = (state, action) => {
  console.log(" reducer 🗽: state", state);
  console.log(" reducer 🎬: action", action);
  // We'll return a new `object` a combination of the current state and action.
  // Any additional properties that the action has, will override the state.
  // Best practice we not mutating state directly but returning a spread copy.
  return { ...state, ...action };
};

function Counter({ step = 1, initial = { count: 0 } }) {
  const [state, dispatch] = React.useReducer(countReducer, initial);
  console.log("useReducer 🪝: state", state);
  // You would need to match that return object signature with an action object.
  // Are action will contain the destructured value from the current state.
  // You then pass that expression directly into your "action" object.
  // However for demonstration and understanding, lets use a action variable.
  const { count } = state;
  const action = count + step;
  const increment = () => {
    console.log("dispatch 📮: handler", action);
    dispatch({ count: action }); // dispatch calls reducer!
  };
  return <button onClick={increment}>{count}</button>;
}

function App() {
  return <Counter />;
}

export default App;
