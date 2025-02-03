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


export class ConwayGameOfLife{
    constructor(widthX, heightY){
        this.rowsY = widthX;
        this.colsX = heightY;

        this.field = this.#createFieldArray();
        this.initFieldWithRandom();
    }

    #createFieldArray(){
        return Array(this.colsX).fill().map(() => Array(this.rowsY).fill(0));
    }

    initFieldWithRandom(filledPercentage=50){
        const indices = Array.from(Array(this.colsX * this.rowsY)).map((val,i)=>i);
        // Array.from(Array(10).keys())
        // [...Array(10).keys()]

        shuffleArray(indices);

        const filledCellCnt = (this.colsX*this.rowsY)*(filledPercentage/100);
        for(let i = 0; i < filledCellCnt; i++){
            let [x, y] = [indices[i]%this.colsX, Math.floor(indices[i]/this.colsX)];
            this.field[x][y] = 1;
        }
    }

    #isInBounds(x, y){
        return 0 <= x && x < this.colsX && 0 <= y && y < this.rowsY
    }

    #countNeighbours(startX, startY){
        let res = 0;
        const directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1,0], [-1,-1]]
        for(let [dx, dy] of directions){
            let [x, y] = [startX+dx, startY+dy];

            if(!this.#isInBounds(x, y)) continue;
            res += this.field[x][y];

            if(res > 3) return 8;
        }
        return res;
    }

    update(){
        // if n is number of neighbours 
        // living cell dies with n < 2 or 3 < n
        // new cell is born if n = 3

        const nextField = this.#createFieldArray()

        for(let x = 0; x < this.colsX; x++){
            for(let y = 0; y < this.rowsY; y++){
                let neighbourCnt = this.#countNeighbours(x,y);
                if(2 > neighbourCnt) continue; // dead with less than 2
                if(3 < neighbourCnt) continue; // dead with more than 3
                if( this.field[x][y] == 0 && neighbourCnt == 2 ) continue; // was dead stays dead
                
                // was alive with n in [2,3] or dead with n = 3
                nextField[x][y] = 1;
            }
        }

        this.field = nextField;
    }

    getXY(x, y){
        return this.field[x][y];
    }

    setXY(x, y, value){
        this.field[x][y] = (value)? 1 : 0; 
    }

}