
# A list of boardgames created using React
* [TicTacToe and variations](#variations-of-tictactoe)
* [Sudoku](#sudoku)
* [Reversi](#reversi)
* [Conway's game of life](#conway)
* [Maze solving with A*](#a-star)

## Select game from dropdown menu<br>
![temp1](https://github.com/user-attachments/assets/6b08e778-fd20-4aed-9e64-6b57b154dc9b)


## Variations of TicTacToe
* detect winning conditions 

TicTacToe            |  Four in a row         |  Gomoku 
:-------------------------:|:-------------------------:|:-------------------------:
![temp2](https://github.com/user-attachments/assets/e8cedfb8-1c82-44a3-bc97-1719c4211b38)  |  ![temp3](https://github.com/user-attachments/assets/cf2556f3-a688-447e-b7c3-dfb590b1f980) | ![temp4](https://github.com/user-attachments/assets/50ef4ce5-019d-46de-8efd-becbf7d8d84d)
3x3 field <br> 3 in a row wins | 7x6 field <br> 4 in a row wins, tiles have "gravity" | 15x15 field <br> 5 in a row wins


<a name="sudoku-section"></a>
## Sudoku
### with button to automatically solve
* select a cell via mouse-over or using the arrow keys
* enter a value by typing a key
* valid keys are set, invalid keys clear the selected cell
* highlight, row, column, block and other cells with the same value

2x2            |   3x3         | 4x4
:-------------------------:|:-------------------------:|:-------------------------:|
  ![temp7](https://github.com/user-attachments/assets/3ad8ebcd-eec2-4119-94bd-d6eada65e5a2) |![temp6](https://github.com/user-attachments/assets/7cd30ca8-15a2-4108-974a-eb5177f89aa4) | ![temp8](https://github.com/user-attachments/assets/2bb1df22-1fb9-4de8-8248-7cc8f72dde0d)
2x2 <br> (using numbers 1-4) | 3x3 <br>(highlighting for mouse over 1 in top-left field)  | 4x4 field <br>(using 0-9 and a-f)


<a name="reversi-section"></a>
## Reversi
* highlight possible moves
* skip players who have to pass
* count tiles and find winner in the end

![temp5](https://github.com/user-attachments/assets/3551bee7-b93c-4174-9528-b219f87155e9)


<a name="conway"></a>
## Conway's game of life
* init to example, empty or random
* draw by clicking and dragging the mouse, crtl-z to undo last draw

standard rules -> living cell dies with less than 2, more than 3 living neighbours; dead cell comes to life with exactly 3 neighbours

![temp2](https://github.com/user-attachments/assets/bd08f06b-9c5f-45d9-ad5f-3135705dc39d) | ![temp3](https://github.com/user-attachments/assets/b467243d-6f72-4437-8e56-5e091f08066b)
:-------------------------:|:-------------------------:|
running the example field | user drawn fields 


<a name="a-star"></a>
## Maze solving with A*
* init to example, empty or random
* draw by clicking and dragging the mouse, crtl-z to undo last draw
* start/pause to show animated solving of the maze with A*
<br>(for now start is always bottom left, goal is always top right)

![temp4](https://github.com/user-attachments/assets/6409bc93-be45-4e33-8e51-64bf8da4be7c) | ![temp5](https://github.com/user-attachments/assets/416a05f6-ed8b-4605-a221-e623fc185375) | ![temp6](https://github.com/user-attachments/assets/09ed1f4c-9f5e-40e6-9fa9-cbab13d03202)
:-------------------------:|:-------------------------:|:-------------------------:
draw obstacles with the mouse | visited fields are highlighted during execution | path to goal is shown
