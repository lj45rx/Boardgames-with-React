import { GridWithStates } from "../a_star/grid";

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

export class ConwayGameOfLife extends GridWithStates {
    constructor(widthX, heightY){
        super(widthX, heightY);
        this.directions = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1, 1], [-1,0], [-1,-1]]
        this.initFieldToExample();
    }

    initFieldToRandom(filledPercentage=33){
        const newField = this.createFieldArray();

        const indices = Array.from(Array(this.colsX * this.rowsY)).map((val,i)=>i);
        shuffleArray(indices);

        const filledCellCnt = (this.colsX*this.rowsY)*(filledPercentage/100);
        for(let i = 0; i < filledCellCnt; i++){
            let [x, y] = [indices[i]%this.colsX, Math.floor(indices[i]/this.colsX)];
            newField[x][y] = 1;
        }

        this.overwriteField(newField);
    }

    initFieldToExample(){
        const newField = this.createFieldArray();
        if(this.colsX != 50 || this.rowsY != 50) return; // only for 50x50 fields

        for(let y = 0; y < this.rowsY; y++){
            for(let x = 0; x < this.colsX; x++){
                if( exampleField[y].at(x) != " " ) newField[y][x] = 1;
            }
        }

        this.overwriteField(newField);
    }

    #countNeighbours(startX, startY){
        let res = 0;
        for(let [dx, dy] of this.directions){
            let [x, y] = [startX+dx, startY+dy];

            if(!this.isInBoundsXY(x, y)) continue;
            //res += this.field[x][y];
            res += this.getXY(x, y);

            if(res > 3) return 8;
        }
        return res;
    }

    update(){
        // if n is number of neighbours 
        // living cell dies with n < 2 or 3 < n
        // new cell is born if n = 3

        const nextField = this.createFieldArray()

        for(let x = 0; x < this.colsX; x++){
            for(let y = 0; y < this.rowsY; y++){
                let neighbourCnt = this.#countNeighbours(x,y);
                if(2 > neighbourCnt) continue; // dead with less than 2
                if(3 < neighbourCnt) continue; // dead with more than 3
                if( this.getXY(x, y) == 0 && neighbourCnt == 2 ) continue; // was dead stays dead
                
                // was alive with n in [2,3] or dead with n = 3
                nextField[y][x] = 1;
            }
        }

        this.overwriteField(nextField);
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