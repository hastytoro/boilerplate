// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from "react";
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from "../pokemon";

// Reusable generic reducer ✂️
function asyncReducer(state, action) {
  console.log("    asyncReducer: 🗽 state", state);
  console.log("    asyncReducer: 🎬 action", action);
  switch (action.type) {
    case "pending": {
      return { status: "pending", data: null, error: null };
    }
    case "resolved": {
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useAsync(asyncCallback, initialState, dependencies) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: "idle",
    data: null,
    error: null,
    ...initialState,
  });
  // Here we provide a mechanism for consumers of this custom 🪝.
  // They can side step the asynchronous steps by exiting early.
  // Or the accepted `asyncCallback` that returns a promise can we invoked.
  // The callback needs to return a `Promise` for any farther activity.
  // Or as mentioned, return early by passing a null or undefined.
  React.useEffect(() => {
    const promise = asyncCallback();
    if (!promise) {
      console.log("  useAsync: ❗ exited early.");
      return;
    }
    console.log("  useAsync: 📮 dispatch() pending");
    dispatch({ type: "pending" });
    promise.then(
      (data) => {
        console.log("  useAsync: 📮 dispatch() data");
        dispatch({ type: "resolved", data });
      },
      (error) => {
        console.log("  useAsync: 📮 dispatch() error");
        dispatch({ type: "rejected", error });
      }
    );
    /// Below looking at `useCallback` as a solution, lets use a **workaround**.
    // Disable the ESLint plugin as its unsure if we included all dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  return state;
}

function PokemonInfo({ pokemonName }) {
  // All that logic we would have required in the component is now extracted.
  // Now we pass what is needed as parameters, to the "reusable" custom 🪝.
  // The `fetchPokemon` utility returns a promise that we pass on.
  // But on every render/invoke this `fetchPokemon` is going to be read/run.
  // * remember the workaround is to pass a dependency.
  const state = useAsync(
    // 1️⃣ asyncCallback
    () => {
      if (!pokemonName) {
        console.log(" PokemonInfo: 💔 exit point.");
        return;
      }
      console.log(" PokemonInfo: 🐕 fetch return Promise.");
      return fetchPokemon(pokemonName);
    },
    // 2️⃣ initialState
    { status: pokemonName ? "pending" : "idle" },
    // 3️⃣ dependencies
    [pokemonName]
  );
  // We have aliased the destructuring of our state 🗽 here:
  const { data: pokemon, status, error } = state;

  switch (status) {
    case "idle": {
      console.log(" PokemonInfo: 🍿 render 'idle' component");
      return <span>Submit a pokemon</span>;
    }
    case "pending": {
      console.log(" PokemonInfo: 🍿 render 'pending' component");
      return <PokemonInfoFallback name={pokemonName} />;
    }
    case "rejected": {
      console.log(" PokemonInfo: 🍿 render 'rejected' component");
      throw error;
    }
    case "resolved": {
      console.log(" PokemonInfo: 🍿 render 'resolved' component");

      return <PokemonDataView pokemon={pokemon} />;
    }
    default:
      throw new Error("This should be impossible");
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const handleSubmit = (newPokemonName) => setPokemonName(newPokemonName);
  const handleReset = () => setPokemonName("");
  console.log("App: 🍿 render started");
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  );
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true);
  console.log("AppWithUnmountCheckbox: 🍿 render started");
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={(e) => setMountApp(e.target.checked)}
        />{" "}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  );
}

export default App;
