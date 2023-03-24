import React, {useState} from "react";
import "./MoveMode.css";
function Square({className,value, onSquareClick}) {
  className="square "+className;
  return (
    <React.Fragment>
    
  <button 
    className={className}
    onClick={onSquareClick}>
      {value}
    </button>
    </React.Fragment>);
}
function InfoBox({status,displayMoveStatus,oTokens,xTokens}){
  return (
    <React.Fragment>
  <div className="status"><h1>{status}</h1></div>
  <div className="displayMoveStatus"><h1>{displayMoveStatus}</h1></div>
  <br></br>
  <h2><strong>Rules</strong></h2>
  <h3>- On your turn you can either</h3>
  <ul><li><h3>Place a piece in an empty square</h3> </li>
  <li><h3>Move one of your existing pieces to an adjacent square that is empty or contains an opponent's piece</h3></li></ul>

  <h3>- Moving a piece onto an opponent's piece replaces that square with your piece permanently</h3>
  <h3>- Adjacency crosses over the borders i.e. Left side is adjacent to right side, top is adjacent to bottom and so on</h3>
  <h3>- You have a limited supply of 6 pieces (pieces are returned to your supply on being replaced)</h3>
  <h3>- Four of your pieces in a row wins (including across borders via adjacency) </h3>
  <br></br>
  <h2>X has {xTokens} / 6 pieces left</h2>
  <h2>O has {oTokens} / 6 pieces left</h2>
</React.Fragment>);
}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [xTokens,setXTokens]= useState(6);
  const [oTokens,setOTokens]= useState(6);
  const [moveStatus, setMoveStatus] = useState(-1);
  const [squares, setSquares] = useState(Array(16).fill(null));
  const [classes, setClasses] = useState(Array(16).fill("squareEmpty"));
  const [moveNumber,setMoveNumber] = useState(1);
  function handleClick(i) {
    /* if (squares[i] || calculateWinner(squares)) {
    return;
  }*/
 

    //if winner found
    if (classes[i] === "squareUnavailable" || calculateWinner(squares)) {
      return;
    }
    const nextClasses = classes.slice();
    
    //check if correct turn and selecting own piece
    if ((xIsNext && squares[i]==="X") || (!xIsNext && squares[i]==="O"))
    {
      //if unselecting moving piece, unhighlight all adjacent ones
      if(classes[i] === "squareMoving")
      {
        nextClasses[i] = "squareAvailable"
        const adjacentSquares = calculateAdjacent(i);
        for (let a = 0; a < adjacentSquares.length; a++) 
        {
          if(nextClasses[adjacentSquares[a]] === "squareAdjacent")
          {
            nextClasses[adjacentSquares[a]] = "squareEmpty"
          }
          else if (nextClasses[adjacentSquares[a]] === "squareAdjacentReplace")
          {
            nextClasses[adjacentSquares[a]] = "squareAvailable"
          }
        }
        setClasses(nextClasses);
      }

      //if moving a piece, highlight adjacent locations
      if(classes[i] === "squareAvailable")
      {

          nextClasses[i]="squareMoving";
        //highlight/unhighlight new adjacent squares and return
        const adjacentSquares = calculateAdjacent(i);

        for (let j = 0; j < classes.length; j++) 
        {
          if (adjacentSquares.includes(j))
          {
            if(classes[j] === "squareEmpty" || classes[j] === "squareAdjacent" )
            {
              nextClasses[j] = "squareAdjacent";
            }
            else if (classes[j] === "squareAvailable" )
            {
              if((xIsNext && squares[j] !== "X") ||(!xIsNext && squares[j] !== "O") ){
                nextClasses[j] = "squareAdjacentReplace";
              }
            }
            else if (classes[j]==="squareMoving")
            {
              nextClasses[j]="squareAvailable";
            }
          }
          else if (classes[j] === "squareAdjacent")
          {
            nextClasses[j] = "squareEmpty";
          }
          else if (classes[j] === "squareMoving")
          {
            nextClasses[j] = "squareAvailable";
          }
          else if (classes[j] === "squareAdjacentReplace")
          {
            nextClasses[j] = "squareAvailable";
          }
        }
        setClasses(nextClasses);
      }
      return;
    }
    const nextSquares = squares.slice();
    let movingTokenIndex = classes.indexOf("squareMoving");

    //if selecting an adjacent place to move to
    if(classes[i] === "squareAdjacent" && movingTokenIndex != -1 || classes[i] === "squareAdjacentReplace" && movingTokenIndex != -1)
    {
      
      if (xIsNext && squares[movingTokenIndex]==="X"){
        nextSquares[i]="X";
        if (classes[i] === "squareAdjacentReplace"){
          nextClasses[i] = "squareUnavailable";
          setOTokens(oTokens+1);
        }
        else{nextClasses[i]="squareAvailable";}
      }
      else if (!xIsNext && squares[movingTokenIndex]==="O"){
        nextSquares[i]="O";
        if (classes[i] === "squareAdjacentReplace"){
          nextClasses[i] = "squareUnavailable";
          setXTokens(xTokens+1);
        }
        else{nextClasses[i]="squareAvailable";}
      }
      else{
        return;
      }

      
      //reset all adjacent stuff
       // nextClasses[i]="squareAvailable";

        nextSquares[movingTokenIndex]= null;
        nextClasses[movingTokenIndex] = "squareEmpty";
        const adjacentSquares = calculateAdjacent(movingTokenIndex);
        for (let a = 0; a < adjacentSquares.length; a++) 
        {
          if(nextClasses[adjacentSquares[a]] === "squareAdjacent")
          {
            nextClasses[adjacentSquares[a]] = "squareEmpty"
          }
          else if(nextClasses[adjacentSquares[a]] === "squareAdjacentReplace")
          {
            nextClasses[adjacentSquares[a]] = "squareAvailable"
          }
          else if(nextClasses[adjacentSquares[a]] === "squareMoving")
          {
            nextClasses[adjacentSquares[a]] = "squareAvailable"
          }
        }
      }
      //if placing an X
    else if (xIsNext && squares[i]!=="X" && classes[i]==="squareEmpty" && xTokens>0 && movingTokenIndex === -1) {
      nextSquares[i] = "X";
      nextClasses[i] = "squareAvailable";
      if(xTokens>0){
      setXTokens(xTokens-1);
      }
    } 
    //if placing an O
    else if(!xIsNext && squares[i]!=="O" && classes[i]==="squareEmpty" && oTokens>0 && movingTokenIndex === -1){
      nextSquares[i] = "O";
      nextClasses[i] = "squareAvailable";
      if(oTokens>0){
        setOTokens(oTokens-1);
        }
    }
    else{
      return;
    }
    
   const winnerCheck=calculateWinner(nextSquares);
    if(winnerCheck){
      nextClasses[winnerCheck[0]]="squareWinning";
      nextClasses[winnerCheck[1]]="squareWinning";
      nextClasses[winnerCheck[2]]="squareWinning";
      nextClasses[winnerCheck[3]]="squareWinning";
}
    setSquares(nextSquares);
    setClasses(nextClasses);
      
    setXIsNext(!xIsNext);

    setMoveNumber(moveNumber+1);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + (!xIsNext ? "X" : "O");
  } else {
    status = "Current player: " + (xIsNext ? "X" : "O");
  }
  let displayMoveStatus="Move Number: " + moveNumber;
 
  return (
    <React.Fragment>
      
        <div className="container">
          <h1>Move Mode</h1>
          <div className="row">
          <div className="col-sm-auto">
                      <div className="board-row">
                        <Square className={classes[15]} value={squares[15]} onSquareClick={() => handleClick(15)} />
                      </div>
                      <br></br>
                      <div className="board-row">
                        <Square className={classes[3]} value={squares[3]} onSquareClick={() => handleClick(3)} />
                      </div>
                      <div className="board-row">
                        <Square className={classes[7]} value={squares[7]} onSquareClick={() => handleClick(7)} />
                      </div>
                      <div className="board-row">
                        <Square className={classes[11]} value={squares[11]} onSquareClick={() => handleClick(11)} />
                      </div>
                      <div className="board-row">
                        
                        <Square className={classes[15]} value={squares[15]} onSquareClick={() => handleClick(15)} />
                      </div>
        <br></br>
          <div className="board-row">
                        <Square className={classes[3]} value={squares[3]} onSquareClick={() => handleClick(3)} />
                      </div>
                    </div>
            <div className="col-sm-auto">

              <div className="board-row">
              <Square className={classes[12]} value={squares[12]} onSquareClick={() => handleClick(12)} />
                <Square className={classes[13]} value={squares[13]} onSquareClick={() => handleClick(13)} />
                <Square className={classes[14]} value={squares[14]} onSquareClick={() => handleClick(14)} />
                <Square className={classes[15]} value={squares[15]} onSquareClick={() => handleClick(15)} />
              </div>
              <br></br>
              <div className="board-row">
                <Square className={classes[0] +" border border-dark border-2"} value={squares[0]} onSquareClick={() => handleClick(0)}  />
                <Square className={classes[1] +" border border-dark border-2"} value={squares[1]} onSquareClick={() => handleClick(1)}  />
                <Square className={classes[2] +" border border-dark border-2"} value={squares[2]} onSquareClick={() => handleClick(2)} />
                <Square className={classes[3] +" border border-dark border-2"} value={squares[3]} onSquareClick={() => handleClick(3)} />
              </div>
            
              <div className="board-row">
              <Square className={classes[4] +" border border-dark border-2"} value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square className={classes[5] +" border border-dark border-2"} value={squares[5]} onSquareClick={() => handleClick(5)} />
                <Square className={classes[6] +" border border-dark border-2"} value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square className={classes[7] +" border border-dark border-2"} value={squares[7]} onSquareClick={() => handleClick(7)} />
              </div>
              <div className="board-row">
              <Square className={classes[8] +" border border-dark border-2" } value={squares[8]} onSquareClick={() => handleClick(8)} />
                <Square className={classes[9] +" border border-dark border-2"} value={squares[9]} onSquareClick={() => handleClick(9)} />
                <Square className={classes[10] +" border border-dark border-2"} value={squares[10]} onSquareClick={() => handleClick(10)} />
                <Square className={classes[11] +" border border-dark border-2"} value={squares[11]} onSquareClick={() => handleClick(11)} />
              </div>
              <div className="board-row">
                <Square className={classes[12] +" border border-dark border-2"} value={squares[12]} onSquareClick={() => handleClick(12)} />
                <Square className={classes[13]+" border border-dark border-2"} value={squares[13]} onSquareClick={() => handleClick(13)} />
                <Square className={classes[14]+" border border-dark border-2"} value={squares[14]} onSquareClick={() => handleClick(14)} />
                <Square className={classes[15]+" border border-dark border-2"} value={squares[15]} onSquareClick={() => handleClick(15)} />
              </div>
<br></br>
              <div className="board-row">
                <Square className={classes[0]} value={squares[0]} onSquareClick={() => handleClick(0)}  />
                <Square className={classes[1]} value={squares[1]} onSquareClick={() => handleClick(1)}  />
                <Square className={classes[2]} value={squares[2]} onSquareClick={() => handleClick(2)} />
                <Square className={classes[3]} value={squares[3]} onSquareClick={() => handleClick(3)} />
              </div>
            </div>
            <div className="col-sm-auto">
              <div className="board-row">
                <Square className={classes[12]} value={squares[12]} onSquareClick={() => handleClick(12)} />
              </div>
              <br></br>
              <div className="board-row">
                <Square className={classes[0]} value={squares[0]} onSquareClick={() => handleClick(0)}  />                        
              </div>
              <div className="board-row">
                <Square className={classes[4]} value={squares[4]} onSquareClick={() => handleClick(4)} />
              </div>
              <div className="board-row">
                <Square className={classes[8]} value={squares[8]} onSquareClick={() => handleClick(8)} />
              </div>
              <div className="board-row">
                <Square className={classes[12]} value={squares[12]} onSquareClick={() => handleClick(12)} />  
              </div>
              <br></br>
              <div className="board-row">
                <Square className={classes[0]} value={squares[0]} onSquareClick={() => handleClick(0)}  />
              </div>
            </div>
            <div className="col-sm">
              <InfoBox status={status} displayMoveStatus={displayMoveStatus} oTokens = {oTokens} xTokens={xTokens} />
            </div>
      </div>
</div>
    </React.Fragment>
  );
}

function calculateWinner(squares) {
   const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [12, 9, 6, 3],

    //winning diagonals -going up to the right
    [0,13,10,7],
    [4,1,14,11],
    [8,5,2,15],

     //winning diagonals -going up to the left
     [12,11,6,1],
     [13,8,7,2],
     [14,9,4,3],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c,d] = lines[i];
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {

      return [a,b,c,d];
    }
  }
  return null;
}
function calculateAdjacent(i) {
  /*const adjacentSquares = [
   [1, 4, 5], //0
   [0, 4, 5, 6, 2],
   [1, 5, 6, 7, 3],
   [2, 6, 7],
   [0, 1, 5, 9, 8], //4
   [0, 1, 2, 6, 10, 9, 8, 4],
   [1, 2, 3, 7, 11, 10, 9, 5],
   [3, 2, 6, 10, 11],
   [4, 5, 9, 13, 12], //8
   [4, 5, 6, 10, 14, 13, 12, 8],
   [5, 6, 7, 11, 15, 14, 13, 9],
   [7, 6, 10, 14, 15],
   [8, 9, 13], //12
   [12, 8, 9, 10, 14],
   [13, 9, 10, 11, 15],
   [14, 10, 11],
 ];*/
 const noBordersAdjacentSquares = [
   [1, 4, 5,7, 3, 15, 12, 13], //0
   [0, 4, 5, 6, 2, 12, 13, 14],
   [1, 5, 6, 7, 3, 13, 14, 15],
   [2, 6, 7, 14, 15, 12, 0],
   [0, 1, 5, 9, 8, 11, 7, 3], //4
   [0, 1, 2, 6, 10, 9, 8, 4],
   [1, 2, 3, 7, 11, 10, 9, 5],
   [3, 2, 6, 10, 11, 8, 4, 0],
   [4, 5, 9, 13, 12, 7, 11, 15], //8
   [4, 5, 6, 10, 14, 13, 12, 8],
   [5, 6, 7, 11, 15, 14, 13, 9],
   [7, 6, 10, 14, 15, 4, 8, 12],
   [8, 9, 13, 11, 15, 3, 0, 1], //12
   [12, 8, 9, 10, 14, 0, 1, 2],
   [13, 9, 10, 11, 15, 1, 2, 3],
   [14, 10, 11, 8, 12, 0, 3, 2],
 ];
 //return adjacentSquares[i];
 return noBordersAdjacentSquares[i];
}