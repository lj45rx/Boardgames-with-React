

function DivGrid(props){
    // create default props
    const { rows = 2, cols = 2, ...restProps } = props;

    const cells = [];
    createCells();

    function cellProperties(x,y,i){
        const res = {}
        if(props.onClick != undefined)      res.onClick = (e) => props.onClick(e, {x:x, y:y, i:i})
        if(props.onMouseOver != undefined)  res.onMouseOver = (e) => props.onMouseOver(e, {x:x, y:y, i:i})
        if(props.onMouseOut != undefined)   res.onMouseOut = (e) => props.onMouseOut(e, {x:x, y:y, i:i})
        return res;
    }

    function createCells(){
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < cols; x++){
                let i = y*cols+x;
                cells.push(
                    <div className="cell"
                        style={{backgroundColor: "white", border: "2px red solid"}}
                            key={`${x}_${y}`}
                            {...cellProperties(x,y,i)}
                            >laflsdjflsja
                    </div>
                )
            }
        }
    }

    return <>
        <h1>hi</h1>
        {cells}
    </>
}


function TestComp(){
    
    function onClick(e, args){
        console.log("onClick ", args)
    }

    function onMouseOver(e, args){
        console.log("onMouseOver ", args)
    }

    function onMouseOut(e, args){
        console.log("onMouseOut ", args)
    }

    return <>
        <DivGrid
            onClick = {onClick}
            onMouseOver = {onMouseOver}
            onMouseOut = {onMouseOut}
            rows = {2}
            cols = {3}
        />
    </>;
}

export default TestComp