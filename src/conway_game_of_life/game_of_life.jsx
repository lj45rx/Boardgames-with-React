import { useEffect } from "react"

import {ConwayGameOfLife} from './ConwayGameOfLife.js'

const COLOR_FIELD = "red";
const COLOR_EMPTY_CELL = "black";

let gol;
let gameRunning = false;
function GameOfLife(){
    const rows = 100;
    const cols = 100;
    
    const widthPercent = 50;
    
    const style_cellContainer = {
        gridTemplateColumns: `repeat(${cols}, auto)`,
        width: `${widthPercent}%`,
        display: "grid",
        margin: "auto",
        border: "3px solid white",
        backgroundColor: COLOR_FIELD
    }
    const style_cell = { 
        aspectRatio: "1 / 1",
        border: "1px solid black",
        backgroundColor: COLOR_EMPTY_CELL
    }

    // one time, create timer to setTime every 1000ms
    useEffect(() => {
        //const intervalId = setInterval(useCallback, timeMs);
        const intervalId = setInterval(() => {
            if(gameRunning){
                gol.update();
                redrawField();
            }
        }, 200);

        gol = new ConwayGameOfLife(cols, rows);       
        redrawField() 

        return () => { // clear on unmount
            clearInterval(intervalId);
        }
    }, []);

    function redrawField(){
        let i = 0; 
        let color;
        for(let x = 0; x < cols; x++){
            for(let y = 0; y < rows; y++){
                color = (gol.getXY(x, y) == 1)? "red" : "black";
                setCellBackgroundColor(i, color);
                i++;
            }
        }
    }

    function setCellBackgroundColor(i,color){
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.backgroundColor = color;
    }

    function onMouseOver(_,i,x,y){
        return;
        setCellBackgroundColor(i, "yellow");
    }
    function onMouseOut(_,i,x,y){
        return;
        setCellBackgroundColor(i, COLOR_EMPTY_CELL);
    }

    function onStartButtonPressed(){
        gameRunning = true;
    }

    function onStopButtonPressed(){
        gameRunning = false;
    }

    function onResetButtonPressed(){
        gameRunning = false;
        gol.initFieldWithRandom();
        redrawField();
    }
    
    function createCells(){
        const cells = [];
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
            }
        }
        return cells;
    }

    return (
        <div className="clock-container">

            <div id="cellContainer" style={style_cellContainer}>
                {createCells()}
            </div>
            <div style={{display: "inline"}}>
                <button onClick={onResetButtonPressed}>reset to random</button>
                <button onClick={onStartButtonPressed}>start</button>
                <button onClick={onStopButtonPressed}>stop/pause</button>
            </div>
        </div>
    );
}

export default GameOfLife