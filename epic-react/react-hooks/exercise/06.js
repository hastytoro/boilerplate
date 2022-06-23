// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
// - PokemonForm: UI buttons for selecting pre-set submission
// - PokemonInfoFallback: UI while we're loading the pokemon info
// - PokemonDataView: UI we use to display the pokemon info
// - fetchPokemon: A helper function we call to get world state
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from "../pokemon";

function PokemonInfo({ pokemonName }) {
  // managed state 📦 (locally)
  const [pokemon, setPokemon] = React.useState(null);
  // fetching is external "world state" 🌐
  React.useEffect(() => {
    if (!pokemonName) return; // exist logic
    setPokemon(null);
    fetchPokemon(pokemonName).then((data) => setPokemon(data));
  }, [pokemonName]);
  // basic `if` conditional rendering:
  if (!pokemonName) return <p>Submit a pokemon</p>;
  else if (!pokemon) return <PokemonInfoFallback name={pokemonName} />;
  else return <PokemonDataView pokemon={pokemon} />;
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");
  const handleSubmit = (newName) => setPokemonName(newName);
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
