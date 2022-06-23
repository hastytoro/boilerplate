// 💯 make safeDispatch with useCallback, useRef, and useEffect
// http://localhost:3000/isolated/exercise/03.js

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
function useSafeDispatch(dispatch) {
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  return React.useCallback(
    (...args) => {
      if (mountedRef.current) dispatch(...args);
    },
    [dispatch]
  );
}

// Reusable generic async custom hook 🪝.
function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: "idle",
    data: null,
    error: null,
    ...initialState,
  });

  const dispatch = useSafeDispatch(unsafeDispatch);

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

  return { ...state, run };
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
