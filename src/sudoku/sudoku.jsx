// TODO memo https://www.w3schools.com/howto/howto_js_snackbar.asp

import { useEffect } from 'react';
import SudokuContainer from '/src/sudoku/sudoku.js'


const COLOR_HIHGLIGHT_SELECTED = "rgb(130, 215, 255)";
const COLOR_HIGHLIGHT_BLOCK = "rgb(170, 228, 255)";
const COLOR_HIGHLIGHT_ROWCOL = "rgb(200, 238, 255)";
const COLOR_CELL_BASE = "rgb(220,220,220)";
const COLOR_HIGHLIGHT_VALUE = "rgb(130, 215, 255)";
const EMPTY_FIELD_STRING = "_";


function Sudoku({props}){
    const blockSize = (props.blockSize)? props.blockSize : 3;
    //const blockSize = 3
    const sudokuContainer = new SudokuContainer(blockSize);
    const numCols = blockSize*blockSize;
    const numRows = numCols;
 
    const widthPercent = 30;
    const style_cellContainer = {
        gridTemplateColumns: `repeat(${blockSize}, auto)`,
        width: `${widthPercent}%`,
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
    let cellDivsInitialized = false;
    const cellDivs = [...Array(numRows)].map(e => Array(numCols).fill(null));
    createCells();

    useEffect(() => {
        console.log("use effect -> document is loaded")
        initCellDivs();
        overwriteFieldFromContainer();
        
    });

    let cellListeningForKey = null;
    document.addEventListener('keyup', (e) => {
        if(cellListeningForKey == null) return;
        const [cell, x, y] = cellListeningForKey;

        let keyToNumber = parseInt(e.key);
        if( isNaN(keyToNumber) || keyToNumber < 1 || keyToNumber > 9){
            cell.textContent = "_";
            sudokuContainer.setXY(x,y,-1);
            return;
        }

        cell.textContent = keyToNumber;
        sudokuContainer.setXY(x,y,keyToNumber-1);
        //highlightAllOfValue(x,y);
        clearAllHighlights();
        highlightCell(x, y)
    });

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
                cell.textContent = (val == -1)? EMPTY_FIELD_STRING : val+1;
            }
        }
    }

    function getStatusString(){
        // TODO remove?
        return "";
    }

    function getIndexFromXY(x,y){
        return y*numCols + x;
    }

    function resetCellXYBackgroundColor(x,y){
        setCellXYBackgroundColor(x, y, COLOR_CELL_BASE);
    }

    function setCellXYBackgroundColor(x,y,color){
        if(!cellDivsInitialized){
            initCellDivs()
            cellDivsInitialized = true;
        }
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
        //setCellXYBackgroundColor(x,y, COLOR_HIHGLIGHT_SELECTED);
    }

    function highlightAllOfValue(x, y){
        let value = sudokuContainer.getXY(x,y);
        let positions = sudokuContainer.getPositionsOfValue(value);
  
        for(let [cell_x, cell_y] of positions){
            //console.log(cell_x, " ", cell_y)
            setCellXYBackgroundColor(cell_x, cell_y, COLOR_HIGHLIGHT_VALUE);
        }
    }

    function onMouseOver(_,i,x,y){
        clearAllHighlights();
        highlightCell(x,y);
        setSelectedCell(x,y);
        highlightAllOfValue(x,y);
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

    function createCells_old(){
        for(let y = 0; y < numRows; y++){
            for(let x = 0; x < numCols; x++){
                let i = y*numCols+x;
                // console.log(`creating x: ${x} y: ${y} idx: ${i}`)
                cells.push(
                    <div className="cell"
                            style={style_cell}
                            key={`${x}_${y}`}
                            onClick={(e) => onCellClicked(e, i, x, y)}
                            onMouseOver={(e) => onMouseOver(e,i,x,y)}
                            onMouseOut={(e) => onMouseOut(e,i,x,y)}>{EMPTY_FIELD_STRING}</div>
                )
                //TODO if i is changed onClick also uses new value????
                // eg incrementing single i for each 
                // -----
                // let i = 0; 
                // for ()
                //   for()
                //     ...
                //     .onClick(e,i)
                //     ...
                //     i++
                // -----
                // in the end all use the same value (=rows*cols)
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