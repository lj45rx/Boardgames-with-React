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

        this.directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1,0], [-1,-1]]
    
        this.numSavedStates = 0;
        this.oldStates = [];
        this.fieldChangedSinceLastSaveOrLoad = true;

        this.field = this.#createFieldArray();
        //this.initFieldToEmpty();
        this.initFieldToExample();
    }

    #createCopyOfField(field=this.field){
        const copyOfField = [];
        for(let x = 0; x < this.colsX; x++){
            copyOfField.push([...field[x]]);
        }
        return copyOfField;
    }

    rememberState(){
        if(!this.fieldChangedSinceLastSaveOrLoad) return;
        this.fieldChangedSinceLastSaveOrLoad = false;

        const copyOfCurrentField = this.#createCopyOfField()

        if(this.oldStates.length <= this.numSavedStates){
            this.oldStates.push(copyOfCurrentField);
        } else {
            this.oldStates[this.numSavedStates] = copyOfCurrentField;
        }

        this.numSavedStates++;
    }

    revertToLastState(){
        // if edited since last save -> last save
        // if not edited since last save -> load save before last
        const loadIdx = this.numSavedStates - 1 
                        - ((this.fieldChangedSinceLastSaveOrLoad)? 0 : 1);

        if(loadIdx < 0) return false;

        this.field = this.#createCopyOfField(this.oldStates[loadIdx]); // TODO careful! obetcs are passed by reference, use copies to overwrite
        this.numSavedStates = loadIdx+1;

        this.fieldChangedSinceLastSaveOrLoad = false;
        return true;
    }

    resetRememberedStates(){
        this.oldStates = [];
        this.fieldChangedSinceLastSaveOrLoad = true;
        this.numSavedStates = 0;
        this.rememberState();
    }

    #createFieldArray(){
        return Array(this.colsX).fill().map(() => Array(this.rowsY).fill(0));
    }

    initFieldToEmpty(){
        this.field = this.#createFieldArray();
        this.resetRememberedStates();
    }

    initFieldToRandom(filledPercentage=33){
        this.field = this.#createFieldArray();

        const indices = Array.from(Array(this.colsX * this.rowsY)).map((val,i)=>i);
        // Array.from(Array(10).keys())
        // [...Array(10).keys()]

        shuffleArray(indices);

        const filledCellCnt = (this.colsX*this.rowsY)*(filledPercentage/100);
        for(let i = 0; i < filledCellCnt; i++){
            let [x, y] = [indices[i]%this.colsX, Math.floor(indices[i]/this.colsX)];
            this.field[x][y] = 1;
        }
        this.resetRememberedStates();
    }

    initFieldToExample(){
        this.field = this.#createFieldArray();

        if(this.colsX != 50 || this.rowsY != 50) return; // only for 50x50 fields

        for(let y = 0; y < this.rowsY; y++){
            for(let x = 0; x < this.colsX; x++){
                if( exampleField[y].at(x) != " " ) this.field[y][x] = 1;
            }
        }

        this.resetRememberedStates();
    }

    #isInBounds(x, y){
        return 0 <= x && x < this.colsX && 0 <= y && y < this.rowsY
    }

    #countNeighbours(startX, startY){
        let res = 0;
        for(let [dx, dy] of this.directions){
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
        this.fieldChangedSinceLastSaveOrLoad = true;
    }

}


const exampleField = [
    "                                                  ",
    "                         #                        ",
    "                       # #             ###    ### ",
    "             ##      ##            ##        ###  ",
    "            #   #    ##            ##             ",
    " ##        #     #   ##                           ",
    " ##        #   # ##    # #                 ##     ",
    "           #     #       #                 ##     ",
    "            #   #                        ##       ",
    "             ##                          ##       ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "       ###   ###                                  ",
    "                                                  ",
    "     #    # #    #                                ",
    "     #    # #    #                                ",
    "     #    # #    #                                ",
    "       ###   ###                                  ",
    "                                                  ",
    "       ###   ###                                  ",
    "     #    # #    #                                ",
    "     #    # #    #                                ",
    "     #    # #    #                                ",
    "                                                  ",
    "       ###   ###                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "                                                  ",
    "        ########                                  ",
    "        # #### #                                  ",
    "        ########                                  ",
    "                                   ##             ",
    "                                  #  #            ",
    "                                   ##         ##  ",
    "                                        ##   #  # ",
    "                                        ##    # # ",
    "                                               #  ",
    "                                                  ",
    "                                      ##      #   ",
    "                                      # #    # #  ",
    "                                       #      #   ",
    "                                                  ",
    "                                                  "
]