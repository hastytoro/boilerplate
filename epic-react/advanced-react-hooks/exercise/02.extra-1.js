// useCallback: custom hooks
// 💯 use useCallback to empower the user to customize memoization
// http://localhost:3000/isolated/final/02.extra-1.js

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

function useAsync(asyncCallback, initialState) {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: "idle",
    data: null,
    error: null,
    ...initialState,
  });

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
  }, [asyncCallback]);
  return state;
}

/* The main takeaway with `useCallback`: only when its dependency changes does
React then return a newer `() => {}` anonymous function, with the `pokemonName`
prop in its closure. This allows us to ensure how we "memoize" and guarantee a
more stable dependency provided, to our custom `useAsync` 🪝. */
function PokemonInfo({ pokemonName }) {
  // 1️⃣ asyncCallback "named" function
  const asyncCallback = React.useCallback(() => {
    if (!pokemonName) {
      console.log(" PokemonInfo: 💔 exit point.");
      return;
    }
    console.log("PokemonInfo: 🐶 fetching promise.");
    return fetchPokemon(pokemonName);
  }, [pokemonName]);
  // You no longer need a dependency argument and we have no linting errors.
  const state = useAsync(asyncCallback, {
    // 2️⃣ initialState
    status: pokemonName ? "pending" : "idle",
  });

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
