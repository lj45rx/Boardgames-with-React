// TODO memo https://www.w3schools.com/howto/howto_js_snackbar.asp

import React, { useEffect } from 'react';

const COLOR_HIGHLIGHT_WIN = "#00ff00";
const colorConfigurations = [
    //field, empty cell, [player colors], [player highlight colors], [playerNames]
    ["black", "gray", ["red", "blue"], ["rgba(255,0,0,0.33)", "rgba(0,0,255,0.33)"], ["Red", "Blue"]],
    ["rgb(0, 0, 100)", "gray", ["yellow", "blue"], ["rgba(255,255,0,0.66)", "rgba(0,0,255,0.33)"], ["Yellow", "Blue"]],
    ["rgb(200, 120, 0)", "rgb(180, 100, 0)", ["white", "black"], ["rgba(255,255,255,0.33)", "rgba(0,0,0,0.33)"], ["White", "Black"]],
]
const configurations = [
    [3,3,3,false,"TicTacToe"],
    [6,7,4,true,"Four in a row"],
    [15,15,5,false,"Gomoku"]
]

function TicTacToe({props}){
    console.log("create tictactoe with type: ", props)

    const configType = (props.type)? props.type : 0;
    const [rows, cols, winLength, useGravity, title] = configurations[configType];
    const [COLOR_FIELD, COLOR_EMPTY_CELL, playerColors, playerHighlightColors, playerNames] = colorConfigurations[configType]; 

    const widthPercent = 30;
    let nextPlayerId = 0;
    let turnNum = 0;

    const style_cellContainer = {
        gridTemplateColumns: `repeat(${cols}, auto)`,
        width: `${widthPercent}%`,
        display: "grid",
        margin: "auto",
        border: "3px solid black",
        backgroundColor: COLOR_FIELD
    }
    const style_cell = { 
        aspectRatio: "1 / 1",
        border: "1px solid",
        borderRadius: "50%",
        backgroundColor: COLOR_EMPTY_CELL
    }

    const cells = [];
    createCells();
    let cellValues;
    let gameover = false;

    useEffect(() => {
        console.log("load finished")
        onRestart();
    });

    function cellClicked(_, i, x, y){
        if(gameover) return;

        if(useGravity){
            [y,i] = findLowestEmptyYInColumn(x);
            if(y == -1) return;
        } else {
            if(cellValues[y][x] != -1) return; // must be empty field
        }

        cellValues[y][x] = nextPlayerId;
        setCellBackgroundColor(i, playerColors[nextPlayerId]);
        
        turnNum++; // currently used in checkGameover, call before that
        checkGameover(x,y);

        nextPlayerId = (nextPlayerId+1)%2;

        if(gameover) return;
        updateStatusString();
        
        if(useGravity) onMouseOver(null, i, x, y); // dont wait 
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
    }

    function checkGameover(start_x,start_y){
        if(turnNum < 5) return false; //only for 3x3, earliest winning move is 5th

        const directions = [[1,0],  // horizontal
                            [0,1],  // vertical
                            [1,1],  // diagonal \
                            [1,-1]] // diagonal /
        for(let [dx,dy] of directions){
            let count = 1;
            let winningCells = [[start_x, start_y ]];

            // for each direction, count how many of the same type lie in a row
            for(let _ = 0; _ < 2; _++){
                let [x, y] = [start_x,start_y];
                // count "forwards" (ex horizontal->move right)
                x += dx;
                y += dy;
                while(isInBounds(x, y)){
                    if( cellValues[y][x] != nextPlayerId ) break; // empty or of other player
                    count++;
                    winningCells.push([x,y])
                    x += dx;
                    y += dy;
                }
                // reverse direction, then in next step
                // count "backwards" (ex horizontal->move left)
                dx *= -1;
                dy *= -1;
            }

            if( winLength <= count ){
                updateStatusString(`${playerNames[nextPlayerId]} wins (Player ${nextPlayerId})`);
                showSnackbar(`${playerNames[nextPlayerId]} wins`);
                highlightWinningCells(winningCells);
                gameover = true;
                return true;
            }
        }
        
        if( turnNum == (rows*cols) ){
            updateStatusString("DRAW");
            gameover = true;
            return true;
        } 

        return false;
    }

    function isInBounds(x,y){
        return 0 <= x && 0 <= y && x < cols && y < rows;
    }

    function isCellEmpty(x,y){
        return cellValues[y][x] == -1;
    }
    
    function findLowestEmptyYInColumn(x){
        let y = -1
        while( isInBounds(x,y+1) 
            && cellValues[y+1][x] == -1 ) y++;
        let i = y*cols + x;

        return [y,i];
    }

    function getNextPlayerString(){
        return `Next: ${playerNames[nextPlayerId]}'s turn (player ${nextPlayerId})`;
    }

    function updateStatusString(value=""){
        if(value == "") value = getNextPlayerString();
        document.getElementById("status").textContent = value;
    }

    function setCellBackgroundColor(i,color){
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.backgroundColor = color;
    }

    function highlightWinningCells(cellCoords){
        const cells = document.getElementsByClassName("cell");
        for(let [x,y] of cellCoords){
            cells[y*cols + x].style.backgroundColor = COLOR_HIGHLIGHT_WIN;
        }
    }

    function onMouseOver(_,i,x,y){
        if(gameover) return;
        if(useGravity){
            [y,i] = findLowestEmptyYInColumn(x);
            if(y == -1) return;
        }

        if(!isCellEmpty(x,y)) return;
        //console.log(`mouseover ${x} ${y} ${i} ${cellValues[y][x]}`);
        setCellBackgroundColor(i, playerHighlightColors[nextPlayerId]);
    }
    function onMouseOut(_,i,x,y){
        if(gameover) return;
        if(useGravity){
            [y,i] = findLowestEmptyYInColumn(x);
            if(y == -1) return;
        }
        if(!isCellEmpty(x,y)) return;
        //console.log(`mouseout ${x} ${y} ${i} ${cellValues[y][x]}`); 
        setCellBackgroundColor(i, COLOR_EMPTY_CELL);
    }

    function initCellValues(){
        return [...Array(rows)].map(e => Array(cols).fill(-1));
    }
    
    function createCells(){
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < cols; x++){
                let i = y*cols+x;
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
            <div className="backgroundPattern1">
                <h1>{title}</h1>
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

export default TicTacToe;