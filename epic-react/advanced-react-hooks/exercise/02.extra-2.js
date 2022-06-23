// useCallback: custom hooks
// 💯 return a memoized `run` function from useAsync
// http://localhost:3000/isolated/final/02.extra-2.js

import * as React from "react";
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from "../pokemon";

// Reusable generic reducer ✂️:
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

// Reusable generic async custom hook 🪝.
function useAsync(initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: "idle",
    data: null,
    error: null,
    ...initialState,
  });

  const { data, error, status } = state;

  const run = React.useCallback((promise) => {
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
  }, []);

  return { data, error, status, run };
}

function PokemonInfo({ pokemonName }) {
  // We have aliased the destructuring of our returned state 🗽 here:
  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({
    status: pokemonName ? "pending" : "idle",
  });

  React.useEffect(() => {
    if (!pokemonName) {
      console.log(" PokemonInfo: 💔 exit point.");
      return;
    }
    // We provide `run()` a promise which as a function handles for us and keeps
    // our state like data, status, error all up-to-date based on the status of
    // the promise we pass to it. Because the `run` function is coming from our
    // our custom hook, the implementation detail of `useAsync` can ensure that
    // the function only changes when necessary and a consumer component can now
    // add any dependencies it needs for when they want side-effects to trigger.
    // This ensures the custom 🪝 API is tidy and easier to reuse ♻.
    console.log("PokemonInfo: 🐶 fetching promise.");
    return run(fetchPokemon(pokemonName));
  }, [pokemonName, run]);

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
