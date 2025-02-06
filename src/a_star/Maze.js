import { GridWithStates } from "./grid";
import { SimplestPriorityQueue } from "./queue";

//https://bost.ocks.org/mike/shuffle/
/**
 * in-place shuffle array contents
 * @param {Array} array 
 */
function shuffleArray(array) {
	var m = array.length, t, i;
  
	// While there remain elements to shuffle…
	while (m) {
  
	  // Pick a remaining element…
	  i = Math.floor(Math.random() * m--);
  
	  // And swap it with the current element.
	  t = array[m];
	  array[m] = array[i];
	  array[i] = t;
	}
}

class AStarSolver{
    constructor(field, startXY, goalXY, width, height){
        this.field = field;
        this.startXY = startXY;
        this.goalXY = goalXY;
        this.width = width;
        this.height = height;

        this.openNodesQueue = new SimplestPriorityQueue(); // hold keys and order 
        this.openNodesMap = new Map();  // hold nodes
        this.closedNodesSet = new Map();

        this.goalNode = this.getNode(this.goalXY[0], this.goalXY[1]);
        this.startNode = this.getNode(this.startXY[0], this.startXY[1], true); // add to map

        this.isWorking = false;
        this.isFinished = false;
        this.result = null;
    }

    distanceToGoal(x, y){
        const dx = Math.abs(this.goalXY[0] - x);
        const dy = Math.abs(this.goalXY[1] - y);
        const distance = Math.sqrt(
            dx*dx + dy*dy        
        );

        //console.log(`dist for x ${x} y ${y} is ${distance}`)
        return distance;
    }

    getKeyXY(x,y){
        return `${x}_${y}`;
    }

    getKey(pos){
        return this.getKeyXY(pos[0], pos[1]);
    }

    #isInBounds(x, y){
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    // get is exists, create if not
    getNode(nodeX, nodeY, add=false){
        const key = this.getKeyXY(nodeX, nodeY);
        if(this.openNodesMap.has(key)){
            return this.openNodesMap.get(key);
        }

        this.directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1,0], [-1,-1]];
        //this.directions = [[0,-1], [1,0], [0,1], [-1,0]]; // ohne diagonale
        
        const neighbours = [];
         for(let [dx,dy] of this.directions){
             let x = nodeX + dx;
             let y = nodeY + dy;
 
             if(!this.#isInBounds(x, y)) continue;
             if(this.field[y][x] == 1) continue; // is obstacle

             const dist = Math.sqrt( Math.abs(dx)+Math.abs(dy) ); // = 1 for horizontal/vertical; sqrt(2) for diagonal
             neighbours.push({key: this.getKeyXY(x,y), neighbourDist:dist, x:x, y:y});
         }

        const newNode = {key: this.getKeyXY(nodeX, nodeY), pos:[nodeX, nodeY], nodeDist: 0, distanceToGoal: this.distanceToGoal(nodeX, nodeY), neighbours: neighbours, predecessor: null};
        if(add) this.openNodesMap.set(newNode.key, newNode);
        return newNode;
    }

    isAtGoal(pos){
        return pos[0] == this.goalNode.pos[0] && pos[1] == this.goalNode.pos[1];
    }

    // do one step
    // return true if finished
    step(){
        if(this.isFinished) return true;

        if(!this.isWorking){
            this.isWorking = true;
            // add startnode to queue
            this.openNodesQueue.add(this.startNode.key, 0)
        }

        if(this.openNodesQueue.isEmpty()){
            // no valid path was found
            console.log("no possible solution!!!")
            this.result = null;
            this.isFinished = true;
            return true;
        }

        const currentNodeKey = this.openNodesQueue.getNext();
        const currentNode = this.openNodesMap.get(currentNodeKey);

        if(currentNode == undefined){ //TODO remove
            console.error("wut???")
            console.log(currentNode)
            console.log(this.openNodesQueue)
            console.log("isfinished?", this.isFinished)
        }

        this.openNodesMap.delete(currentNode.key); //optional

        if( this.isAtGoal(currentNode.pos) ){
            // path has been found -> find path by following predecessors back to start
            this.isFinished = true;
            console.log("at goal!!!!")
            this.result = currentNode;
            return true
        }

        // prevents node from being checked again
        this.closedNodesSet.set(currentNode.key, currentNode);

        // check for following nodes in next step
        this.expandNode(currentNode);
    }

    expandNode(node){       
        //console.log("expanding", node)
        for(let successor of node.neighbours){
            if(this.closedNodesSet.has(successor.key)){
                // skip already checked nodes
                continue;
            }

            const successorNode = this.getNode(successor.x, successor.y); //TODO einfach hier in map setzen??

            // distance to current + that of current neighbour
            let fullDistToNeighbour = node.nodeDist + successor.neighbourDist;

            if(this.openNodesMap.has(successor.key) && fullDistToNeighbour >= successorNode.nodeDist){
                // there is already a shorter know distance to this node
                continue;
            }

            successorNode.predecessor = node;
            successorNode.nodeDist = fullDistToNeighbour;

            // estimated distance to goal -> used to decide which node is checked next
            const priority = fullDistToNeighbour + successorNode.distanceToGoal;
            //console.log(`${successorNode.pos} distance here ${fullDistToNeighbour} to goal ${successorNode.distanceToGoal} total ${priority} `)

            // set/update priority for visited node
            if(!this.openNodesMap.has(successorNode.key)){
                this.openNodesMap.set(successorNode.key, successorNode);
            }
            this.openNodesQueue.add(successorNode.key, priority);
        }
    }
}

export class Maze extends GridWithStates {
    constructor(widthX, heightY){
        super(widthX, heightY);
        this.initFieldToSquaresDotted();
        this.solver = null;
    }

    doSolutionStep(){
        if(this.solver == null){
            console.log("create new solver")

            this.setXY(this.colsX-1, 0, 0); // make sure goal is "free"
            this.solver = new AStarSolver(this.tempTODOGetField(), [0, this.rowsY-1], [this.colsX-1, 0], this.colsX, this.rowsY);
        }

        this.solver.step();
        return [this.solver.closedNodesSet, this.solver.openNodesMap];
    }

    resetSolver(){
        this.solver = null;
    }
    
    initFieldToRandom(filledPercentage=33){
        const newField = this.createFieldArray();

        const indices = Array.from(Array(this.colsX * this.rowsY)).map((val,i)=>i);
        shuffleArray(indices);

        const filledCellCnt = (this.colsX*this.rowsY)*(filledPercentage/100);
        for(let i = 0; i < filledCellCnt; i++){
            let [x, y] = [indices[i]%this.colsX, Math.floor(indices[i]/this.colsX)];
            newField[y][x] = 1;
        }
        this.overwriteField(newField);
    }

    initFieldToSquares(startAtZero=false){
        const newField = this.createFieldArray();

        const offset = (startAtZero)? 0 : 1;
        for(let y = offset; y+offset < this.rowsY/2; y+=2){
            for(let x = y; x < this.colsX-y; x++){
                newField[y][x] = 1;                 // Top->down
                newField[this.rowsY-y-1][x] = 1;    // Bottom->up
            }
        }

        for(let x = offset; x+offset < this.colsX/2; x+=2){
            for(let y = x; y < this.rowsY-x; y++){
                newField[y][x] = 1;               // Left->right
                newField[y][this.colsX-x-1] = 1;  // Right->left
            }
        }
        
        this.overwriteField(newField);
    }

    initFieldToSquaresDotted(startAtZero=false){
        const newField = this.createFieldArray();

        const offset = (startAtZero)? 0 : 1;
        for(let x = 0; x+offset < this.colsX/2; x+=2){
            for(let y = 0; y+offset < this.rowsY/2; y+=2){
                
                newField[y+offset][x+offset] = 1;                             // NW to center
                newField[y+offset][this.colsX-1-x-offset] = 1;                // NE to center 

                newField[this.rowsY-1-y-offset][x+offset] = 1;                // SW to center
                newField[this.rowsY-1-y-offset][this.colsX-1-x-offset] = 1;   // SE to center
            }
        }

        this.overwriteField(newField);
    }
}