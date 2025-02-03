import { useEffect, useState } from "react"

import TicTacToe from "./tic_tac_toe/TicTacToe.jsx"
import Reversi from "./reversi/reversi.jsx"
import Sudoku from "./sudoku/sudoku.jsx"
import TestComp from "./test_coposition/test.jsx"
import GameOfLife from "./conway_game_of_life/game_of_life.jsx"

const PlaceholderComponent = () => {
  return ( <><p>select a game</p></>)
}

const games = {
  "select game...":         [PlaceholderComponent, ""],
  "TicTacToe":              [TicTacToe, {type: 0}],
  "Four in a row":          [TicTacToe, {type: 1}],
  "Gomoku":                 [TicTacToe, {type: 2}],
  "Reversi":                [Reversi, ""],
  "Sudoku":                 [Sudoku, ""],
  "Sudoku 2x2":             [Sudoku, {blockSize: 2}],
  "Sudoku 4x4":             [Sudoku, {blockSize: 4}],
  "Conway's Game of Life":  [GameOfLife, ""],
}

function fillDropdownMenu(){
  let options = []
  for(let key of Object.keys(games)){
    options.push(
      <option key={`${key}`} value={key}>
        {key}</option>
    )
  }
  return options;
}

function App() {
  const [currentGame, setCurrentGame] = useState("select game...");
  
  useEffect(() => {
      document.getElementById("gameSelecter").onchange = onSelectionChanged;
  }, []);

  function onSelectionChanged(event){
    var value = event.target.value;
    setCurrentGame(value)
  }

  let Component = games[currentGame][0]
  let Props = games[currentGame][1]
  return (
    <>
      <select id="gameSelecter">
        {fillDropdownMenu()}
      </select>
      <Component props={Props} />
    </>
  )
}

export default App
