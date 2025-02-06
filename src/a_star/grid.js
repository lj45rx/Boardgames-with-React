export class Grid {
    #field; //TODO make sure this is not shared between instances
    constructor(widthX, heightY){
        this.colsX = widthX;
        this.rowsY = heightY;

        this.#field = this.createFieldArray();
    }

    createFieldArray(initialValue=0){
        return Array(this.rowsY).fill().map(() => Array(this.colsX).fill(initialValue));
    }

    initFieldToEmpty(initialValue=0){
        this.#field = this.createFieldArray(initialValue);
    }

    overwriteField(newField){
        this.#field = newField;
    }

    tempTODOGetField(){
        return this.#field;
    }

    createCopyOfField(field=this.#field){
        const copyOfField = [];
        for(let y = 0; y < this.rowsY; y++){
            copyOfField.push([...field[y]]);
        }
        return copyOfField;
    }

    isInBoundsXY(x, y){
        return 0 <= x && x < this.colsX && 0 <= y && y < this.rowsY
    }

    getXY(x, y){
        return this.#field[y][x];
    }

    setXY(x, y, value){
        this.#field[y][x] = (value)? 1 : 0; 
    }
}



export class GridWithStates extends Grid {
    constructor(widthX, heightY){
        super(widthX, heightY);

        this.numSavedStates = 0;
        this.oldStates = [];
        this.fieldChangedSinceLastSaveOrLoad = true;
    }
    
    setXY(x,y,value){
        super.setXY(x,y,value);
        this.fieldChangedSinceLastSaveOrLoad = true;
    }

    initFieldToEmpty(initialValue=0, resetRememberedStates=true){
        super.initFieldToEmpty(initialValue);
        if(resetRememberedStates) this.resetRememberedStates();
    }

    overwriteField(newField, resetRememberedStates=true){
        super.overwriteField(newField);
        if(resetRememberedStates) this.resetRememberedStates();
    }

    rememberState(){
        if(!this.fieldChangedSinceLastSaveOrLoad) return;
        this.fieldChangedSinceLastSaveOrLoad = false;

        const copyOfCurrentField = this.createCopyOfField()

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

        this.overwriteField(
            this.createCopyOfField(this.oldStates[loadIdx]), 
            false); // false to not reset states
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
}