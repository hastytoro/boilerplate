// useReducer: simple Counter
// 💯 simulate setState with an object OR function
// http://localhost:3000/isolated/final/01.extra-3.js

import * as React from "react";

const countReducer = (state, action) => {
  console.log(" reducer 🗽: state ", state);
  console.log(" reducer 🎬: action ", action);
  // Now we support both API's in our reducer:
  return {
    ...state,
    ...(typeof action === "function" ? action(state) : action),
  };
};

function Counter({ step = 1, initial = 0 }) {
  const [state, dispatch] = React.useReducer(countReducer, { count: initial });
  console.log("useReducer 🪝 state: ", state);
  const { count } = state;
  const increment = () => {
    console.log("dispatch 📮 handler: ", count + step);
    // We can either submit a object or a function:
    dispatch((currentState) => ({ count: currentState.count + step }));
    dispatch({ count: count + step });
  };
  return <button onClick={increment}>{count}</button>;
}

function App() {
  return <Counter />;
}

export default App;
