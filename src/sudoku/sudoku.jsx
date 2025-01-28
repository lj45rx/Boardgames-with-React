// TODO memo https://www.w3schools.com/howto/howto_js_snackbar.asp

import { useEffect } from 'react';
import SudokuContainer from '/src/sudoku/sudoku.js'

const COLOR_HIHGLIGHT_SELECTED = "rgb(130, 215, 255)";
const COLOR_HIGHLIGHT_BLOCK = "rgb(170, 228, 255)";
const COLOR_HIGHLIGHT_ROWCOL = "rgb(200, 238, 255)";
const COLOR_CELL_BASE = "rgb(220,220,220)";
const COLOR_HIGHLIGHT_VALUE = "rgb(130, 215, 255)";
const EMPTY_FIELD_STRING = "_";

const directionMap = new Map([
    ["ArrowUp", [0,-1]],
    ["ArrowDown", [0,1]],
    ["ArrowLeft", [-1,0]],
    ["ArrowRight", [1,0]]
]);

function Sudoku({props}){
    const blockSize = (props.blockSize)? props.blockSize : 3;
    const sudokuContainer = new SudokuContainer(blockSize);
    const numCols = blockSize*blockSize;
    const numRows = numCols;
 
    const widthPercent = 30;
    const style_cellContainer = {
        gridTemplateColumns: `repeat(${blockSize}, auto)`,
        //width: `${widthPercent}%`,
        width: "70vh",
        display: "grid",
        margin: "auto",
        border: "3px solid black"
    }
    const style_cellBlock = {
        gridTemplateColumns: `repeat(${blockSize}, auto)`,
        display: "grid",
        border: "1px solid black",
    }
    const style_cell = {
        aspectRatio: "1 / 1",
        border: "1px solid",
        verticalAlign: "center",
        textAlign: "center",
        fontSize: "2em",
        backgroundColor: COLOR_CELL_BASE
    }

    const cells = [];
    const cellDivIndices = [];
    let cellDivsInitialized = false; //TODO can be removed if no problems appear (also see setCellXYBackgroundColor())
    const cellDivs = [...Array(numRows)].map(e => Array(numCols).fill(null));
    createCells();

    let cellListeningForKey = null;
    useEffect(() => { 
        console.log("use effect -> document is loaded")
        initCellDivs();
        overwriteFieldFromContainer();

        // if not put here new eventlisteners will be produced and duplicated events sent
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keyup', onKeyUp);
            console.log("use effect -> destroyed");
        };
    });

    function onKeyUp(e){
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)){
            onArrowKey(e.key);
            return;
        }
        if(cellListeningForKey == null) return;

        const [cell, x, y] = cellListeningForKey;

        if(!sudokuContainer.setXY(x,y,e.key)){
            // clear cells on invalid keys
            cell.textContent = "_";
            return;
        }
        cell.textContent = e.key;
        highlightCell(x, y)
    }
    
    function onArrowKey(directionString){
        if( !directionMap.has(directionString) ){
            console.error("unknown value for directin: " + directionString);
            return;
        }
        const [dx, dy] = directionMap.get(directionString);

        let [_, x, y] = [null, 0, 0];
        if(cellListeningForKey != null){
            [_, x, y] = cellListeningForKey;
        }
        
        const [new_x, new_y] = [x+dx, y+dy];
        if(!isInBounds(new_x, new_y)) return;

        highlightCell(new_x,new_y);
        setSelectedCell(new_x,new_y);
    }

    function setSelectedCell(x,y){
        cellListeningForKey = [cellDivs[y][x], x, y];
    }

    function onCellClicked(_, i, x, y){
        console.log(`cell x:${x} y:${y} i:${i} clicked`)
        return;
    }

    function overwriteFieldFromContainer(){
        for(let x = 0; x < numCols; x++){
            for(let y = 0; y < numCols; y++){
                let cell = cellDivs[y][x];
                let val = sudokuContainer.getXY(x,y);
                cell.textContent = (val == -1)? EMPTY_FIELD_STRING : val;
            }
        }
    }

    function getStatusString(){
        // TODO remove?
        return "";
    }

    function isInBounds(x,y){
        return 0 <= x && 0 <= y && x < numCols && y < numRows;
    }

    function getIndexFromXY(x,y){
        return y*numCols + x;
    }

    function resetCellXYBackgroundColor(x,y){
        setCellXYBackgroundColor(x, y, COLOR_CELL_BASE);
    }

    function setCellXYBackgroundColor(x,y,color){
        /*
        // TODO should not be necessary anymore - after putting init in useEffect
        if(!cellDivsInitialized){
            initCellDivs()
            cellDivsInitialized = true;
        }
        */
        const cell = cellDivs[y][x];        
        cell.style.backgroundColor = color;
    }

    function clearAllHighlights(){
        for(let x = 0; x < numCols; x++){
            for(let y = 0; y < numRows; y++){
                resetCellXYBackgroundColor(x, y);
            }
        }
    }

    function highlightCell(x,y){
        clearAllHighlights();

        // block
        let blockX = Math.floor(x/blockSize);
        let blockY = Math.floor(y/blockSize);
        for(let tx = 0; tx < blockSize; tx++){
            for(let ty = 0; ty < blockSize; ty++){
                setCellXYBackgroundColor(blockSize*blockX+tx, blockSize*blockY+ty, COLOR_HIGHLIGHT_BLOCK);
            }
        }
        
        // row 
        for(let tx = 0; tx < numCols; tx++){
            setCellXYBackgroundColor(tx,y, COLOR_HIGHLIGHT_ROWCOL);
        }
        // col 
        for(let ty = 0; ty < numRows; ty++){
            setCellXYBackgroundColor(x,ty, COLOR_HIGHLIGHT_ROWCOL);
        }

        // all cells of same value
        highlightAllOfValue(x,y);
        
        // cell under mouse
        setCellXYBackgroundColor(x,y, COLOR_HIHGLIGHT_SELECTED);
    }

    function highlightAllOfValue(x, y){
        let value = sudokuContainer.getXY(x,y);
        let positions = sudokuContainer.getPositionsOfValue(value);
  
        for(let [cell_x, cell_y] of positions){
            setCellXYBackgroundColor(cell_x, cell_y, COLOR_HIGHLIGHT_VALUE);
        }
    }

    function onMouseOver(_,i,x,y){
        highlightCell(x,y);
        setSelectedCell(x,y);
    }

    function onMouseOut(_,i,x,y){
        cellListeningForKey = null;
        clearAllHighlights();
        return;
    }

    function onSolveButton(){
        let wasSolved = sudokuContainer.solve()
        if(wasSolved){
            overwriteFieldFromContainer()
            return;
        }

        showSnackbar("could not find valid solution")
    }

    function onRestartButton(){
        sudokuContainer.initToEmpty();
        overwriteFieldFromContainer();
    }

    function initCellDivs(){
        const cells = document.getElementsByClassName("cell");
        let i = 0;
        for(let [x,y] of cellDivIndices){
            cellDivs[y][x] = cells[i++];
        }
    }

    function createCellsForBlock(block_x, block_y){
        let cells = []
        for(let y = 0; y < blockSize; y++){
            for(let x = 0; x < blockSize; x++){
                let grid_x = block_x*blockSize + x;
                let grid_y = block_y*blockSize + y;
                let i = grid_y*numCols + grid_x;
                cells.push ( 
                    <div className="cell"
                            style={style_cell}
                            key={`${grid_x}_${grid_y}`}
                            onClick={(e) => onCellClicked(e,i,grid_x, grid_y)}
                            onMouseOver={(e) => onMouseOver(e,i,grid_x,grid_y)}
                            onMouseOut={(e) => onMouseOut(e,i,grid_x,grid_y)}>_</div>
                );
                cellDivIndices.push([grid_x,grid_y]); // remember for later
            }
        }
        return cells;
    }

    function createCells(){
        for(let y = 0; y < blockSize; y++){
            for(let x = 0; x < blockSize; x++){
                cells.push(
                    <div className='cellBlock' key={`blk${x}_${y}`} style={style_cellBlock}>
                        {createCellsForBlock(x, y)}
                    </div>
                )
            }
        }
    }

    function showSnackbar(message){
        var x = document.getElementById("snackbar");
        x.textContent = message;

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    return (
        <>
            <div id="snackbar">Some text some message..</div> {/* seems position doesnt matter */}
            <div className="gameContainer">
                <h1>Sudoku</h1>
                <div id="cellContainer" style={style_cellContainer}>
                    {cells}
                </div>
                <div id="controls">
                    <h2 id="status">{getStatusString()}</h2>
                    <button onClick={onRestartButton}>restart</button>
                    <button onClick={onSolveButton}>solve</button>
                </div>
            </div>
        </>
    );
}

export default Sudoku;