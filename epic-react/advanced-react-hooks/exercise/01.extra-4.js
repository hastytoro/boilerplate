// useReducer: simple Counter
// 💯 traditional dispatch object with a type and switch statement
// http://localhost:3000/isolated/final/01.extra-4.js
// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from "react";

function Counter({ step = 1, initial = 0 }) {
  const [state, dispatch] = React.useReducer(countReducer, { count: initial });
  console.log("useReducer 🪝 state: ", state);
  const { count } = state;

  const increment = () => {
    console.log("dispatch 📮 handler: INCREMENT");
    dispatch({ type: "INCREMENT", step });
  };
  const decrement = () => {
    console.log("dispatch 📮 handler: DECREMENT");
    dispatch({ type: "DECREMENT", step });
  };

  return (
    <div>
      <button onClick={increment}>➕</button>
      <h1>{count}</h1>
      <button onClick={decrement}>➖</button>
    </div>
  );
}

// Here we provide a `switch` statement to handle state management. Now depending
// on the `action.type` 🎬, our switch will run and return different operations.

const countReducer = (state, action) => {
  console.log(" reducer 🗽: state ", state);
  console.log(" reducer 🎬: action ", action);
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + action.step };
    case "DECREMENT":
      return { count: state.count - action.step };
    default:
      throw new Error(`Unsupported action type: ${action.type}.`);
  }
};

function App() {
  return <Counter />;
}

export default App;
