import React, {useState} from "react";
import "./SwapMode.css";
function Square({className,value, onSquareClick}) {
  return (
  <button 
    className={"square "+className}
    onClick={onSquareClick}>
      {value}
    </button>);
}
function InfoBox({status,displayMoveStatus}){
  return (
    <React.Fragment>
       <div className="status"><h2>{status}</h2></div>
        <div className="displayMoveStatus"><h2>{displayMoveStatus}</h2></div>
  <h2><strong>Rules</strong></h2>
  <h3>- On your turn you can either</h3>
  <ul><li><h3>Place a piece in an empty square</h3> </li>
  <li><h3>Swap an opponent's piece with your own</h3></li></ul>
  <h3> - Swapping an opponent's piece will grant them 2 turns</h3>
  <h3> - Swapping an opponent's piece replaces it with your piece permanently (swapped pieces cannot be swapped again)</h3>
  <h3>- Four of your pieces in a row wins  </h3>
</React.Fragment>);
}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [moveStatus, setMoveStatus] = useState(-1);
  const [squares, setSquares] = useState(Array(16).fill(null));
  const [classes, setClasses] = useState(Array(16).fill("squareEmpty"));
  const [moveNumber,setMoveNumber] = useState(1);
  function handleClick(i) {
    /* if (squares[i] || calculateWinner(squares)) {
    return;
  }*/

    //if winner found
    if (classes[i] === "squareUnavailable"|| classes[i] === "squareWinning" || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    const nextClasses = classes.slice();
    let nextMoveStatus=-1;
    if (moveStatus ===0)
    {
      nextMoveStatus = 1;

    }
  
    if (xIsNext && squares[i]!=="X") {
      nextSquares[i] = "X";
      
    } else if(!xIsNext && squares[i]!=="O"){
      nextSquares[i] = "O";
    }
    else{
      return;
    }
    
    //if already has value
    if (classes[i] === "squareEmpty")
    {
      nextClasses[i] = "squareAvailable";
    }
    else if (classes[i] === "squareAvailable")
    {
      nextClasses[i] = "squareUnavailable";
      nextMoveStatus = 0;
    }
    const winnerCheck = calculateWinner(nextSquares);
    if(winnerCheck){
    nextClasses[winnerCheck[0]]="squareWinning";
    nextClasses[winnerCheck[1]]="squareWinning";
    nextClasses[winnerCheck[2]]="squareWinning";
    nextClasses[winnerCheck[3]]="squareWinning";
    }
    setSquares(nextSquares);
    setClasses(nextClasses);
    if(nextMoveStatus === 1)
    {
      setXIsNext(xIsNext);
    }
    else{
      
      setXIsNext(!xIsNext);
    }
    setMoveStatus(nextMoveStatus);
    setMoveNumber(moveNumber+1);
  }

  const winner = calculateWinner(squares);
  
  let status;
  if (winner) {
    status = "Winner: " + (!xIsNext ? "X" : "O");
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  let displayMoveStatus;
  if (moveStatus===0 && !winner) {
    displayMoveStatus= "Move Number: "+moveNumber+", 1st move of 2 for: " + (xIsNext ? "X" : "O");
  } 
  else if (moveStatus===1 && !winner) {
    displayMoveStatus= "Move Number: "+moveNumber+", 2nd move of 2 for: " + (xIsNext ? "X" : "O");
  } 
  else {
    displayMoveStatus="Move Number: " + moveNumber;
  }
  return (
    <React.Fragment>
      <div className="container">
      <h1>Swap Mode</h1>
          <div className="row justify-content-center">
          
         
          <div className="col col-auto justify-content-center">
   

       
      <div className="board-row">
        <Square className={classes[0]} value={squares[0]} onSquareClick={() => handleClick(0)}  />
        <Square className={classes[1]} value={squares[1]} onSquareClick={() => handleClick(1)}  />
        <Square className={classes[2]} value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square className={classes[3]} value={squares[3]} onSquareClick={() => handleClick(3)} />
      </div>
      <div className="board-row">
      <Square className={classes[4]} value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square className={classes[5]} value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square className={classes[6]} value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square className={classes[7]} value={squares[7]} onSquareClick={() => handleClick(7)} />
      </div>
      <div className="board-row">
      <Square className={classes[8]} value={squares[8]} onSquareClick={() => handleClick(8)} />
        <Square className={classes[9]} value={squares[9]} onSquareClick={() => handleClick(9)} />
        <Square className={classes[10]} value={squares[10]} onSquareClick={() => handleClick(10)} />
        <Square className={classes[11]} value={squares[11]} onSquareClick={() => handleClick(11)} />
      </div>
      <div className="board-row">
      <Square className={classes[12]} value={squares[12]} onSquareClick={() => handleClick(12)} />
        <Square className={classes[13]} value={squares[13]} onSquareClick={() => handleClick(13)} />
        <Square className={classes[14]} value={squares[14]} onSquareClick={() => handleClick(14)} />
        <Square className={classes[15]} value={squares[15]} onSquareClick={() => handleClick(15)} />
      </div>
      </div>
      </div>
      <div className="row justify-content-center">
      <div className="col">
              <InfoBox status={status} displayMoveStatus={displayMoveStatus} />
            </div>
            </div>
    </div>
    </React.Fragment>
  );
}

function calculateWinner(squares) {
  /*const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;*/
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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c,d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return [a,b,c,d];
    }
  }
  return null;
}