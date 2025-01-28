
const EMPTY_FIELD_VALUE = -1
class SudokuContainer{
    constructor(size = 3){
        this.blockSize = size;
        this.colRowCount = size*size;
        this.cellCount = this.colRowCount*this.colRowCount;
        this.maxVal = this.colRowCount-1;

        this.cellValues;;
        this.initToEmpty();
        //this.initWithArray();
    }

    initWithArray(){
        //this.valuesNew = [7, 2, -1, 3, -1, 4, -1, 1, -1, 8, -1, -1, 6, -1, -1, -1, 4, 7, 0, 4, 5, -1, 1, -1, 2, -1, -1, -1, -1, 7, -1, 6, 1, 4, -1, -1, 6, -1, 4, -1, 2, -1, 5, -1, -1, -1, 5, -1, -1, 3, 8, 7, -1, 1, 1, -1, -1, -1, -1, -1, 3, 5, 8, -1, -1, -1, -1, 7, 3, 6, -1, -1, 4, -1, 3, -1, -1, -1, -1, 7, 0];
        this.cellValues = [5, -1, -1, 7, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 8, -1, -1, -1, 7, 4, -1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, 7, -1, -1, -1, -1, -1, 8, -1, 6, -1, -1, 3, -1, 0, -1, -1, -1, 4, -1, -1, -1, -1, 7, -1, -1, -1, -1, 2, 1, -1, 2, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 6, -1, -1, 8];
    }

    initToEmpty(){
        this.cellValues = Array(this.cellCount).fill(EMPTY_FIELD_VALUE);
    }

    indexToXY(index){
        return [index%this.colRowCount, Math.floor(index/this.colRowCount)]
    }

    xyToIndex(x, y){
        return y*this.colRowCount + x;
    }

    getXY(x, y){
        return this.cellValues[this.xyToIndex(x,y)];
    }

    getPositionsOfValue(value){
        if ( value == EMPTY_FIELD_VALUE ) return [];
        let res = [];
        for(let i = 0; i < this.cellValues.length; i++){
            //console.log(`${value} vs ${this.cellValues[i]} ${this.cellValues[i] == value} `)
            if( this.cellValues[i] == value ){
                res.push(this.indexToXY(i));
            }
        }
        return res;
    }

    setXY(x, y, value){
        if(this.maxVal < value) return;
        this.cellValues[this.xyToIndex(x,y)] = value;
    
        this.printField()
    }

    printField(){
        console.log(this.fieldToPrintableString(this.cellValues));

        return;
        /**
        +-------+-------+-------+
        >#3 3 3 |   3   | 3     | 
        >   3 3 | 3 3   |   3 3 | 
        >   3   |   3   |   3   | 
        |-------+-------+-------|
        | 3   3 |   3 3 | 3   3 | 
        |     3 | 3 3 3 |     3 | 
        | 3 3   | 3     | 3     | 
        |-------+-------+-------|
        | 3   3 | 3 3   |       | 
        |       |     3 | 3 3 3 | 
        | 3 3   | 3     | 3 3 3 | 
        +-^-^-^-+-------+-------+
         */


        let resultString = "+-------+-------+-------+\n";

        for(let y = 0; y < this.colRowCount; y++){ 
            // begin line with ">" if error
            let lineString = (this.checkRow(y))? "|" : ">";

            for(let x = 0; x < this.colRowCount; x++){
                let entry = this.getXY(x,y);

                // block correct?
                if(x%this.blockSize == 0){ // first col of new block
                    if( y%this.blockSize == 0){ // first row only "#" if error in block, else space
                        let segNum = 3*Math.floor(y/3) + Math.floor(x/3);
                        lineString += this.checkBlock(x,y)? " ": "#";
                    } else {
                        lineString += " ";
                    }
                }
                lineString += ((entry==-1)? " " : entry) + " ";

                if( (x+1)%this.blockSize == 0 ) lineString += "|";
            }
            lineString += "\n"; 
            resultString += lineString;

            /*
            if( y == 2 || y == 5 ){
                resultString += "+-------+-------+-------+\n";
            }
            */

            if( (y+1)%this.blockSize == 0 ){
                resultString += "+-------+-------+-------+\n";
            }
        }

        // +-^-^-^-+-------+-------+
        let bottomString = "";
        for(let y = 0; y < this.colRowCount; y++){
            if(y%this.blockSize == 0){
                bottomString += "+-";
            }

            bottomString += (this.checkColumn(y)? "--" : "^-");
        }
        bottomString += "+";

        resultString += bottomString;

        console.log(resultString);
    }

    checkRow(y, values=this.cellValues){
        let hits = Array(this.colRowCount).fill(false);
        for(let i = 0; i < this.colRowCount; i++){
            let valueAtPos = values[y*this.colRowCount + i];
            if( valueAtPos == EMPTY_FIELD_VALUE ) continue;

            if( hits[valueAtPos] ) return false;
            hits[valueAtPos] = true;
        }
        return true;
    }

    checkColumn(x, values=this.cellValues){
        let hits = Array(this.colRowCount).fill(false);
        for(let i = 0; i < this.colRowCount; i++){
            let valueAtPos = values[i*this.colRowCount + x];
            if( valueAtPos == EMPTY_FIELD_VALUE ) continue;

            if( hits[valueAtPos] ) return false;
            hits[valueAtPos] = true;
        }
        return true;
    }

    checkBlock(start_x, start_y, values=this.cellValues){
        const blockX = Math.floor(start_x/this.blockSize)*this.blockSize;
        const blockY = Math.floor(start_y/this.blockSize)*this.blockSize;

        let hits = Array(this.colRowCount).fill(false);
        for(let y = blockY; y < blockY + this.blockSize; y++){
            for(let x = blockX; x < blockX+this.blockSize; x++){
                let valueAtPos = values[this.xyToIndex(x,y)];
                if( valueAtPos == EMPTY_FIELD_VALUE ) continue;

                if( hits[valueAtPos] ) return false;
                hits[valueAtPos] = true;
            }
        }
        return true;
    }

    checkXY(x, y, values=this.cellValues){
        return this.checkRow(y, values)
                && this.checkColumn(x, values)
                && this.checkBlock(x, y, values);
    }

    solve(){
        let values = [...this.cellValues];
        let solution = {isSolved: false, solution: []}; // "objects are passed by reference"
        this.solveRecursive(0, values, solution);

        console.log("################");
        if( solution.isSolved ){
            this.cellValues = solution.solution;
            console.log("found solution:\n", this.fieldToPrintableString(solution.solution));
        } else {
            console.log("no solution found");
        }

        return solution.isSolved;
    }

    solveRecursive(index, values, solution){
        if( solution.isSolved ) return;

        if( index == this.cellCount ){ 
            // when "end" is reached a solution is found
            solution.isSolved = true;
            solution.solution = values;
            return;
        }

        if( values[index] != EMPTY_FIELD_VALUE ){
            // value at index was already filled
            // only consumer - use given array directly
            return this.solveRecursive(index+1, values, solution);
        }
        
        let [x, y] = this.indexToXY(index);
        for(let value = 0; value < this.colRowCount; value++){
            // try all values that are valid at this index
            let nextValues = [...values];
            nextValues[index] = value;
            
            if(!this.checkXY(x, y, nextValues)) continue;

            this.solveRecursive(index+1, nextValues, solution);
        }
    }


    todoGetMaxValueStringWidth(){ return 1; }
    fieldToPrintableString(fieldValues){
        // if only partially filled, fill rest with empty
        if(fieldValues.length < this.cellCount){
            fieldValues = [...fieldValues, ...Array( this.cellCount-fieldValues.length ).fill(EMPTY_FIELD_VALUE)];
        }

        // how wide in chars can values be, usually 1, todo maybe in future experiments
        const entryWidth = this.todoGetMaxValueStringWidth();

        // create segments 

        // ex "+-------" for  "+-------" -> "+-------+-------+-------"
        const dividerSegment = "+-" + "-".repeat( (entryWidth+1)*this.blockSize );
        const dividerRow = dividerSegment.repeat(this.blockSize) + "+";

        // ex "|       " for  "| x y z " -> "| x y z | x y z | x y z "
        const numberRowSegment = "| " + " ".repeat( (entryWidth+1)*this.blockSize );
        const numberRow = numberRowSegment.repeat(this.blockSize) + "|\n";


        // create placeholder string of field

        let rowNum = 0;
        const numberRowStartPositions = Array(this.colRowCount);

        let result = dividerRow + "\n";
        for(let blockY = 0; blockY < this.blockSize; blockY++){
            for(let i = 0; i < this.blockSize; i++){
                // remember beginning of number rows
                numberRowStartPositions[rowNum++] = result.length;
                result += numberRow;
            }
            result += dividerRow;
            if(blockY != this.blockSize-1) result += "\n"; 
        }


        // "fill" placeholder string with actual values

        let cellValue;
        for(let y = 0; y < this.colRowCount; y++){
            let nextValuePosition = numberRowStartPositions[y];
            for(let x = 0; x < this.colRowCount; x++){
                //result[nextValuePosition] = "x"; this does not work in javascript
                if( x%this.blockSize == 0 ){
                    nextValuePosition += 2; // +2 for "| " at start of every block
                }

                cellValue = fieldValues[this.xyToIndex(x,y)];
                cellValue = (cellValue == EMPTY_FIELD_VALUE)? " " : cellValue;

                result = result.substring(0, nextValuePosition) // substr before entry
                        + String( cellValue ).padStart(entryWidth)
                        + result.substring(nextValuePosition+entryWidth); // substr after entry, skip entryWidth-chars to "overwrite" them

                nextValuePosition += 1+entryWidth; // +1 for the space between values
            }
        }

        //console.log(result);
        return result;
    }
}


export default SudokuContainer;


//TODO delete 
/*
getBlockIdxFromXY(x, y){
    return Math.floor(x/this.blockSize) + this.blockSize*Math.floor(y/this.blockSize);
}

checkBlock_old(blockIdx){
    let hits = Array(9).fill(false);
    let blockX = 3*(blockIdx%3);
    let blockY = 3*Math.floor(blockIdx/3);

    for(let i = 0; i < 9; i++){
        let x = blockX + i%3
        let y = blockY + Math.floor(i/3)
        let valueAtPos = this.getXY(x,y);
        if( valueAtPos == -1 ) continue;

        if( hits[valueAtPos+1] ){
            return false;
        }
        hits[valueAtPos+1] = true;
    }
    return true;
}
*/