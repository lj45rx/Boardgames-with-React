import { useEffect } from "react"
import {ConwayGameOfLife} from './ConwayGameOfLife.js'

const COLOR_ACTIVE_CELL = "red";
const COLOR_MANUAL_CELL = "yellow";
const COLOR_EMPTY_CELL = "black";

const COLOR_BORDER_NORMAL = "black";
const COLOR_BORDER_HIGHLIGHT = "lime";

const UPDATE_MS = 100;

let gol;
let gameRunning = false;
let isMouseDown = false;
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
        backgroundColor: COLOR_ACTIVE_CELL
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
        }, UPDATE_MS);

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
                color = (gol.getXY(x, y) == 1)? COLOR_ACTIVE_CELL : COLOR_EMPTY_CELL;
                setCellBackgroundColor(i, color);
                i++;
            }
        }
    }

    function setCellBackgroundColor(i,color){
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.backgroundColor = color;
    }

    function setCellBorderColor(i, color){
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.borderColor = color;
    }

    function setCell(i,x,y){
        setCellBackgroundColor(i, COLOR_MANUAL_CELL);
        gol.setXY(y,x,1);
    }

    function onMouseOver(_,i,x,y){
        if(gameRunning) return;

        setCellBorderColor(i, COLOR_BORDER_HIGHLIGHT)
        
        if(!isMouseDown) return;
        setCell(i,x,y);
    }

    function onMouseOut(_,i,x,y){
        if(gameRunning) return;
        setCellBorderColor(i, COLOR_BORDER_NORMAL)
    }

    function onCellClicked(_,i,x,y){
        if(gameRunning) return;
        setCell(i,x,y)
    }

    function onStartButtonPressed(){
        gameRunning = true;
    }

    function onStopButtonPressed(){
        gameRunning = false;
    }

    function onResetButtonPressed(){
        gameRunning = false;
        gol.initFieldToRandom();
        redrawField();
    }

    function onResetEmptyButtonPressed(){
        gameRunning = false;
        gol.initFieldToEmpty();
        redrawField();
    }

    function containerClicked(event, mouseDown){
        event.preventDefault(); // else browser will try to drag 
        isMouseDown = mouseDown;
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
                            onMouseOver={(e) => onMouseOver(e,i,x,y)}
                            onMouseOut={(e) => onMouseOut(e,i,x,y)}
                            onMouseDown={(e) => onCellClicked(e,i,x,y)}>
                    </div>
                )
            }
        }
        return cells;
    }

    return (
        <div className="clock-container">

            <div id="cellContainer" 
                style={style_cellContainer} 
                onMouseDown={(e) => containerClicked(e, true)}
                onMouseUp={(e) => containerClicked(e, false)}
                onMouseLeave={(e) => containerClicked(e, false)}
            >
                {createCells()}
            </div>
            <div style={{display: "inline"}}>
                <button onClick={onResetButtonPressed}>reset to random</button>
                <button onClick={onResetEmptyButtonPressed}>reset to empty</button>
                <button onClick={onStartButtonPressed}>start</button>
                <button onClick={onStopButtonPressed}>stop/pause</button>
            </div>
        </div>
    );
}

export default GameOfLife