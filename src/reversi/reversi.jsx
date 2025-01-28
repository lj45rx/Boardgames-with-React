import React, { useEffect } from 'react';

// TODO memo https://www.w3schools.com/howto/howto_js_snackbar.asp

class Move{
    constructor(x,y,flippedCells){
        this.x = x;
        this.y = y;
        this.flippedCells = flippedCells;
    }
}

const color_highlight_win = "#00ff00";
const playerNames = ["BLACK", "WHITE"];
const playerColors = ["rgb(0,0,0)", "rgb(255,255,255)"];
const playerHighlightColors = ["rgba(0,0,0,0.33)", "rgba(255,255,255,0.85)"];
//const playerHighlightPossibleColors = ["rgba(0,0,255,0.1)", "rgba(255,255,0,0.1)"];
//const playerHighlightPossibleColors = ["rgba(0,0,0,0.6)", "rgba(255,255,255,0.5)"];
//const playerHighlightPossibleColors = ["rgb(75, 75, 75)", "rgb(175, 175, 175)"];
const playerHighlightPossibleColors = ["rgba(75, 75, 75, 0.5)", "rgba(175, 175, 175, 0.5)"];
const COLOR_FIELD = "rgb(0, 125, 0)";
const COLOR_EMPTY_CELL = "rgb(0, 150, 0)";

const EMPTY_CELL_VALUE = -1;

function Reversi(){
    const [rowCount, columnCount] = [8,8]; // four in a row
 
    const widthPercent = 30;
    const cellWidthPercent = widthPercent/columnCount;
    const widthPx = 225;
    const widthCell = widthPx/columnCount;

    let nextPlayerId = 0;
    let turnNum = 0;

    const style_cellContainer = {
        gridTemplateColumns: `repeat(${columnCount}, auto)`,
        width: `${widthPercent}%`,
        //width: `${widthPx}px`,
        display: "grid",
        margin: "auto",
        border: "3px solid black",
        backgroundColor: COLOR_FIELD
    }
    const style_cell = { // looks best without and width/height???
        aspectRatio: "1 / 1",
        //width: `${cellWidthPercent}%`,
        //width: "100%", //TODO why??
        //width: `${widthCell}px`,
        //height: `${widthCell}px`,
        //margin: "1px", // dont have the cells touch
        backgroundColor: COLOR_EMPTY_CELL,
        border: "1px solid",
        borderRadius: "50%" // 
    }

    const cells = [];
    createCells();
    let cellValues = initCellValues();
    let gameover = false;
    let possibleMoves = null;

    useEffect(() => {
        console.log("load finished")
        temp_init_othello();
    }, []);

    function temp_init_othello(){
        setTile(3,3,0);
        setTile(4,3,1);
        setTile(4,4,0);
        setTile(3,4,1);
        console.log(cellValues)

        possibleMoves = findAllLegalMoves();
    }
    
    function getMapKeyFromXY(x,y){
        return `${x}_${y}`;
    }

    function getIndexFromXY(x,y){
        return y*columnCount + x;
    }

    function findAllLegalMoves(){
        let res = new Map();

        for(let x = 0; x < columnCount; x++){
            for(let y = 0; y < rowCount; y++){
                let subRes = findLegalMovesForCell(null, x, y);
                if(subRes.length){
                    res.set(getMapKeyFromXY(x,y), new Move(x,y,subRes));
                }
            }
        }

        for(let val of res.values()){
            setCellBackgroundColor(
                getIndexFromXY(val.x, val.y),
                playerHighlightPossibleColors[nextPlayerId])
        }

        return res;
    }

    function findLegalMovesForCell(i,start_x,start_y){
        // cell is already occupied
        if(cellValues[start_y][start_x] != -1){
            //console.log(`x:${start_x} y:${start_y} already occupied`)
            return [];
        }

        let flippedCells = [];
        const directions = [[1,0],  // horizontal
                            [0,1],  // vertical
                            [1,1],  // diagonal \
                            [1,-1]] // diagonal /

        for(let [dx,dy] of directions){

            // for each direction, count how many of the same type lie in a row
            for(let _ = 0; _ < 2; _++){
                let [x, y] = [start_x,start_y];
                let possibleFlips = [];
                // count "forwards" (ex horizontal->move right)
                x += dx;
                y += dy;
                // move while is not empty or own 
                // memorize enemy cells
                // 
                while(isInBounds(x, y)){
                    if( cellValues[y][x] == -1 ) break; // ended on empty - nothing to flip
                    
                    if( cellValues[y][x] == nextPlayerId ){
                        //found own, all cells between start and here can be filpped
                        if(possibleFlips.length) flippedCells = flippedCells.concat(possibleFlips);
                        break;
                    }

                    // was enemy cell, might be flipped if followed by own celllater
                    possibleFlips.push([x,y]);
                    x += dx;
                    y += dy;
                }
                // reverse direction, then in next step
                // count "backwards" (ex horizontal->move left)
                dx *= -1;
                dy *= -1;
            }
        }

        //console.log(`x:${start_x} y${start_y} would flip\n    ${flippedCells}`)

        return flippedCells;
    }

    function cellClicked(_, i, click_x, click_y){
        console.log(`cell clicked x:${click_x} y:${click_y} i:${i}`);
        if(gameover) return;

        const mapKey = getMapKeyFromXY(click_x,click_y);
        if(!possibleMoves.has(mapKey)) return;

        cellValues[click_y][click_x] = nextPlayerId;
        
        //console.log(`cell set x:${x} y:${y} i:${i} to val:${cellValues[y][x]}`);
        //setCellBackgroundColor(i, playerColors[nextPlayerId]);
        setTile(click_x,click_y,nextPlayerId);
        for(let [tx, ty] of possibleMoves.get(mapKey).flippedCells){
            console.log("flipping: ", tx, " ", ty)
            setTile(tx,ty,nextPlayerId)
        }
        
        console.log(cellValues)

        turnNum++; // currently used in checkGameover, call before that

        nextPlayerId = (nextPlayerId+1)%2;

        clearAllHighlights(); // hide old possible
        possibleMoves = findAllLegalMoves();

        if (possibleMoves.size == 0){
            console.log(`${playerNames[nextPlayerId]} could not move`)
            nextPlayerId = (nextPlayerId+1)%2;
            updateStatusString("last player passed")

            // check for other player
            clearAllHighlights(); // hide old possible
            possibleMoves = findAllLegalMoves();
            showSnackbar(`${playerNames[(nextPlayerId+1)%2]} cannot move`);

            // other player also cant move
            if(possibleMoves.size == 0) {
                gameover = true;
                updateStatusString(getGameoverString());
                showSnackbar(`${playerNames[(nextPlayerId+1)%2]} cannot move`);
                return;
            }
        }

        updateStatusString();
    }

    function setTile(x,y,playerId){
        let i = getIndexFromXY(x,y);
        cellValues[y][x] = playerId;
        console.log(`setting x:${x} y:${y} to:${playerId}`)
        setCellBackgroundColor(i, playerColors[playerId]);
    }

    function onRestart(){
        console.log("on restart")
        for(let cell of document.getElementsByClassName("cell")){
            cell.style.backgroundColor = COLOR_EMPTY_CELL; // "none" does not work
        }
        cellValues = initCellValues();
        updateStatusString();
        turnNum = 0;
        gameover = false;
        temp_init_othello();
    }

    function isInBounds(x,y){
        return 0 <= x && 0 <= y && x < columnCount && y < rowCount;
    }

    function isCellEmpty(x,y){
        return cellValues[y][x] == -1;
    }
    
    function findLowestEmptyYInColumn(x){
        let y = -1
        while( isInBounds(x,y+1) 
            && cellValues[y+1][x] == -1 ) y++;
        let i = y*columnCount + x;

        return [y,i];
    }

    function getNextPlayerString(){
        return `Next: ${playerNames[nextPlayerId]}'s turn (player ${nextPlayerId})`;
    }

    function getGameoverString(){
        let counts = [0,0];
        for(let y = 0; y < rowCount; y++){
            for(let x = 0; x < rowCount; x++){
                let value = cellValues[y][x];
                if( value == EMPTY_CELL_VALUE ) continue;
                counts[value]++;
            }
        }

        let whoWins = (counts[0] == counts[1])? "DRAW" 
                        : ((counts[0] > counts[1])? playerNames[0] : playerNames[1]) + " wins";

        return `${whoWins} - Score ${counts[0]} vs ${counts[1]}`;
    }

    function updateStatusString(value=""){
        if(value == "") value = getNextPlayerString();
        document.getElementById("status").textContent = value;
    }

    function setCellBackgroundColor(i,color){
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.backgroundColor = color;
    }

    function clearAllHighlights(){
        const cells = document.getElementsByClassName("cell");

        for(let x = 0; x < columnCount; x++){
            for(let y = 0; y < rowCount; y++){
                // skip non-empty cells
                if(cellValues[y][x] != -1) continue;

                const i = getIndexFromXY(x,y);
                cells[i].style.backgroundColor = COLOR_EMPTY_CELL;
            }
        }
    }

    function highlightWinningCells(cellCoords){
        const cells = document.getElementsByClassName("cell");
        for(let [x,y] of cellCoords){
            cells[y*columnCount + x].style.backgroundColor = color_highlight_win;
        }
    }

    function onMouseOver(_,i,x,y){
        
        findLegalMovesForCell(i,x,y);
        if(gameover) return;
        if(!isCellEmpty(x,y)) return;
        //console.log(`mouseover ${x} ${y} ${i} ${cellValues[y][x]}`);
        setCellBackgroundColor(i, playerHighlightColors[nextPlayerId]);
    }
    function onMouseOut(_,i,x,y){
        if(gameover) return;
        if(!isCellEmpty(x,y)) return;
        //console.log(`mouseout ${x} ${y} ${i} ${cellValues[y][x]}`); 

        // reapply color in onMouseOver 
        if(possibleMoves.has(getMapKeyFromXY(x,y))){
            setCellBackgroundColor(i, playerHighlightPossibleColors[nextPlayerId]);
            return;
        }

        setCellBackgroundColor(i, COLOR_EMPTY_CELL);
    }

    function initCellValues(){
        return [...Array(rowCount)].map(e => Array(columnCount).fill(-1));
    }
    
    function createCells(){
        for(let y = 0; y < rowCount; y++){
            for(let x = 0; x < columnCount; x++){
                let i = y*columnCount+x;
                // console.log(`creating x: ${x} y: ${y} idx: ${i}`)
                cells.push(
                    <div className="cell"
                            style={style_cell}
                            key={`${x}_${y}`}
                            onClick={(e) => cellClicked(e, i, x, y)}
                            onMouseOver={(e) => onMouseOver(e,i,x,y)}
                            onMouseOut={(e) => onMouseOut(e,i,x,y)}>
                    </div>
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
                <h1>reversi</h1>
                <div id="cellContainer" style={style_cellContainer}>
                    {cells}
                </div>
                <div>
                    <h2 id="status">{getNextPlayerString()}</h2>
                    <button onClick={onRestart}>restart</button>
                </div>
            </div>
        </>
    );
}

export default Reversi;