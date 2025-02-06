import { useEffect } from "react"
import {Maze} from './Maze.js'


const COLOR_OBSTRUCTION = "rgb(51, 51, 51)";
const COLOR_OBSTRUCTION_NEW = "lightgray";
const COLOR_EMPTY_CELL = "rgb(150, 150, 150)";
const COLOR_VISITED_FINISHED_CELL = "rgb(125, 0, 0)";
const COLOR_VISITED_OPEN_CELL = "rgb(150, 150, 0)";

const COLOR_RESULT_CELL = "lime";
const COLOR_START = "cyan";
const COLOR_GOAL = "lime";

const COLOR_BORDER_NORMAL = "black";
const COLOR_BORDER_HIGHLIGHT = "lime";

const COLOR_OUTER_BORDER_RUNNING = "green";
const COLOR_OUTER_BORDER_PAUSED = "red";

const State = Object.freeze({
    DRAWING_OBSTRUCTIONS: 0,
    DRAWING_START: 1,
    DRAWING_GOAL: 2,
});


const UPDATE_MS = 20;

let gol;
let gameRunning = false;
let isMouseDown = false;
function AStar(){
    const rows = 40;
    const cols = 60;
    
    const widthPercent = 50;
    
    const style_cellContainer = {
        gridTemplateColumns: `repeat(${cols}, auto)`,
        width: `${widthPercent}%`,
        display: "grid",
        margin: "auto",
        border: `3px solid ${COLOR_OUTER_BORDER_PAUSED}`,
        backgroundColor: COLOR_VISITED_FINISHED_CELL
    }
    const style_cell = { 
        aspectRatio: "1 / 1",
        //border: "1px solid black",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: COLOR_EMPTY_CELL
    }

    // one time, create timer to setTime every 1000ms
    useEffect(() => {
        //const intervalId = setInterval(useCallback, timeMs);
        const intervalId = setInterval(() => {
            if(gameRunning){
                //gol.update();
                //redrawField();
                doAnimationStep();
            }
        }, UPDATE_MS);

        document.addEventListener('keydown', onKeyDown);

        gol = new Maze(cols, rows);       
        redrawField() 

        return () => { // clear on unmount
            document.removeEventListener('keydown', onKeyDown);
            clearInterval(intervalId);
        }
    }, []);

    function redrawField(){
        let i = 0; 
        let color;

        // i goes NW->SE ( L->R then U->D )
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < cols; x++){
                color = (gol.getXY(x, y) == 1)? COLOR_OBSTRUCTION : COLOR_EMPTY_CELL;
                setCellBackgroundColor(i, color);
                i++;
            }
        }

        // draw start, goal
        const [startX, startY] = [0, rows-1];
        const [goalX, goalY] = [cols-1, 0];

        setCellBackgroundColor( getIndexFromXY(startX, startY), COLOR_START );
        setCellBackgroundColor( getIndexFromXY(goalX, goalY), COLOR_GOAL );
    }

    function getIndexFromXY(x, y){
        return y*cols + x;
    }

    function setCellBackgroundColor(i,color){
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.backgroundColor = color;
    }

    function setCellBorderColor(i, color){
        return; //TODO remove
        const cell = document.getElementsByClassName("cell")[i];
        cell.style.borderColor = color;
    }

    function setOuterBorderColor(color){
        const element = document.getElementById("cellContainer");
        element.style.borderColor = color;
    }

    function setCell(i,x,y){
        setCellBackgroundColor(i, COLOR_OBSTRUCTION_NEW);
        gol.setXY(x,y,1);
    }

    function onMouseOver(_,i,x,y){
        //console.log(`x ${x} y ${y} i ${i}`)
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

    function startGame(){
        gameRunning = true;
        setOuterBorderColor(COLOR_OUTER_BORDER_RUNNING)
    }

    function doAnimationStep(){
        if(gol.solver != null && gol.solver.isFinished){
            if(gol.solver.result == null) return;

            let node = gol.solver.result;

            let idx = getIndexFromXY(node.pos[0], node.pos[1]);
            setCellBackgroundColor(idx, COLOR_GOAL);

            while(node.predecessor != null){
                node = node.predecessor;
                idx = getIndexFromXY(node.pos[0], node.pos[1]);
                setCellBackgroundColor(idx, COLOR_RESULT_CELL);
            }
            idx = getIndexFromXY(node.pos[0], node.pos[1]);
            setCellBackgroundColor(idx, COLOR_START);

            gameRunning = false;
            return;
        }

        const [closed, open] = gol.doSolutionStep();

        //console.log("closed", closed);
        //console.log("open", open);

        for(let el of open.values()){
            const idx = getIndexFromXY(el.pos[0], el.pos[1]);
            setCellBackgroundColor(idx, COLOR_VISITED_OPEN_CELL);
        }

        for(let el of closed.values()){
            const idx = getIndexFromXY(el.pos[0], el.pos[1]);
            setCellBackgroundColor(idx, COLOR_VISITED_FINISHED_CELL);
        }
    }

    function stopGame(){
        gameRunning = false;
        setOuterBorderColor(COLOR_OUTER_BORDER_PAUSED)
        gol.resetRememberedStates();
    }

    function onStartStopButtonPressed(){
        const button = document.getElementById("button_startStop");
        if(gameRunning){
            stopGame()
            button.textContent = "Start"
            return;
        }

        button.textContent = "Stop"
        startGame();

    }

    function onResetButtonPressed(){ //TODO simplify different resets
        gameRunning = false;
        gol.initFieldToRandom();
        redrawField();
        setOuterBorderColor(COLOR_OUTER_BORDER_PAUSED);
        const button = document.getElementById("button_startStop").textContent = "Start";
        gol.resetSolver();
    }

    function onResetEmptyButtonPressed(){ //TODO simplify different resets
        gameRunning = false;
        gol.initFieldToEmpty();
        redrawField();
        setOuterBorderColor(COLOR_OUTER_BORDER_PAUSED);
        const button = document.getElementById("button_startStop").textContent = "Start";
        gol.resetSolver();
    }

    function containerClicked(event, mouseDown){
        event.preventDefault(); // else browser will try to drag 
        isMouseDown = mouseDown;

        if(!mouseDown){
            gol.rememberState()
        }
    }

    function onKeyDown(event){
        if(gameRunning) return;

        if (event.ctrlKey && event.key === 'z') {
            if(gol.revertToLastState()){
                redrawField()
            }
            console.warn("implement or remove ctrl-y")
        }
        if (event.ctrlKey && event.key === 'y') {
            console.warn("implement or remove ctrl-y")
        }
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
        <div className="backgroundPattern1">

            <div id="cellContainer" 
                style={style_cellContainer} 
                onMouseDown={(e) => containerClicked(e, true)}
                onMouseUp={(e) => containerClicked(e, false)}
                onMouseLeave={(e) => containerClicked(e, false)}
            >
                {createCells()}
            </div>
            <div>
                <button id="button_startStop" onClick={onStartStopButtonPressed}>{ gameRunning? "Stop" : "Start" }</button>
                <button onClick={onResetButtonPressed}>reset to random</button>
                <button onClick={onResetEmptyButtonPressed}>reset to empty</button>
            </div>
        </div>
    );
}

export default AStar