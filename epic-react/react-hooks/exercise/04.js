// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from "react";

// utility helper functions:
// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}
// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? "X" : "O";
}
// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

function Board() {
  // managed state: regular component state that you need to explicitly manage.
  const [squares, setSquares] = React.useState(Array(9).fill(null));
  /*
  Here we return an array called [squares] into our manage state.
  We derive values based on our hook's [squares] state, with multiple utility function calls.
  We are then able to use those returned values in other areas of our component and UI.
  You don't need to worry about updating our derived/calculated values.
  Because they're simply re-done on every render.
  */
  // derived state: values "calculated" based on values like our managed state.
  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);
  const selectSquare = (square) => {
    if (winner || squares[square]) {
      return; // exit logic if winner or already selected!
    }
    const squaresCopy = [...squares];
    squaresCopy[square] = nextValue;
    setSquares(squaresCopy);
  };

  const restart = () => setSquares(Array(9).fill(null));

  const renderSquare = (i) => (
    <button className="square" onClick={() => selectSquare(i)}>
      {squares[i]}
    </button>
  );

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  );
}

export default App;
