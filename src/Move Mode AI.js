import React, {useState} from "react";

import "./MoveMode.css";
/*import {
  findBestMove
} from './Minimax';*/

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
  <h2>X has {xTokens} / 6 pieces left</h2>
  <h2>O has {oTokens} / 6 pieces left</h2>
  <br></br>
  <h2><strong>Rules</strong></h2>
  <h3>- On your turn you can either</h3>
  <ul><li><h3>Place a piece in an empty square</h3> </li>
  <li><h3>Move one of your existing pieces to an adjacent square that is empty or contains an opponent's piece</h3></li></ul>

  <h3>- Moving a piece onto an opponent's piece replaces that square with your piece permanently</h3>
  <h3>- Adjacency crosses over the borders i.e. Left side is adjacent to right side, top is adjacent to bottom and so on</h3>
  <h3>- You have a limited supply of 6 pieces (pieces are returned to your supply on being replaced)</h3>
  <h3>- Four of your pieces in a row wins (including across borders via adjacency) </h3>

</React.Fragment>);
}
export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}
function Board() {
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [xTokens,setXTokens]= useState(6);
  const [oTokens,setOTokens]= useState(6);
  const [squares, setSquares] = useState(Array(16).fill(null));
  const [classes, setClasses] = useState(Array(16).fill("squareEmpty"));
  const [moveNumber,setMoveNumber] = useState(1);
  
  function handleClick(i) {

    const nextClasses = classes.slice();
    const nextSquares = squares.slice();
    let nextOTokens = oTokens;
    let nextXTokens = xTokens;
    //if winner found
    if ((squares[i] === "O" && classes[i] !== "squareAdjacentReplace") || classes[i] === "squareWinning"  || calculateWinner(squares) || classes[i] === "squareUnavailable") {
      return;
    }
    

    let movingTokenIndex = classes.indexOf("squareMoving");
    //check if correct turn and selecting own piece
    if (squares[i]==="X")
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
              if((squares[j] !== "X") ){
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
    

    //if selecting an adjacent place to move to
    if(classes[i] === "squareAdjacent" && movingTokenIndex != -1 || classes[i] === "squareAdjacentReplace" && movingTokenIndex != -1)
    {
      
      if (squares[movingTokenIndex]==="X"){
        nextSquares[i]="X";
        if (classes[i] === "squareAdjacentReplace"){
          nextClasses[i] = "squareUnavailable";
          nextOTokens=nextOTokens+1;
        }
        else{nextClasses[i]="squareAvailable";}
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
    if (squares[i]!=="X" && classes[i]==="squareEmpty" && nextXTokens>0 && movingTokenIndex === -1) {
      nextSquares[i] = "X";
      nextClasses[i] = "squareAvailable";
      if(nextXTokens>0){
      nextXTokens=nextXTokens-1;
      }
    } 
    
    
   let winnerCheck=calculateWinner(nextSquares);
    if(winnerCheck){
      nextClasses[winnerCheck[0]]="squareWinning";
      nextClasses[winnerCheck[1]]="squareWinning";
      nextClasses[winnerCheck[2]]="squareWinning";
      nextClasses[winnerCheck[3]]="squareWinning";
      setWinningPlayer("X - Player");
    } 
    setSquares(nextSquares);
    setClasses(nextClasses);

    

    setMoveNumber(moveNumber+1);

//ai turn
if (winnerCheck)
{
  return;
}
    
let foundLegalMove=false;
let counter =0;
let min=0;
let max=nextSquares.length-1;
  

let winCombos=getWinningLines();
let indexOfCleanWinCombos = [];

let playerCount = 0;
let aiCount = 0;
let block = -1;
let move = -1;
let placeToMove = -1;
//check for winning combos, count number of pieces on each line
winCombos.forEach(function(arr, indexOne) {
playerCount = 0;
aiCount = 0;
arr.forEach(function(innerValues, indexTwo) {
  if (nextSquares[innerValues] === "X") {
    playerCount ++;
  }
  if (nextSquares[innerValues] === "O") {
    aiCount ++;
  }
});
//win if possible
if (aiCount === 3) {
  for (let j = 0; j < arr.length; j++) {
    if (nextClasses[arr[j]]==="squareEmpty" && nextOTokens>0) {
      nextSquares[arr[j]]="O";
        nextClasses[arr[j]]="squareAvailable";
        nextOTokesn=nextOTokens-1;
        foundLegalMove=true;
    }
  }
}
//block if possible
else if (playerCount === 3) {
  for (let j = 0; j < arr.length; j++) {
    if (nextClasses[arr[j]]==="squareEmpty" && nextOTokens>0) {
      block = arr[j];
    }
    else if ((nextSquares[arr[j]] === "X" && nextClasses[arr[j]]==="squareAvailable" || 
    nextClasses[arr[j]]==="squareEmpty")){
      let adjacentPiecesToMove = calculateAdjacent(arr[j]);
      adjacentPiecesToMove.forEach(function(pieceToMove,indexOfPiece){
        if (nextSquares[pieceToMove] === "O" && nextClasses[pieceToMove] === "squareAvailable"){
            move = pieceToMove;
            placeToMove = arr[j];
        }
      });
    }
  }
}
if (playerCount === 4 || aiCount === 4) {
  return;
}
//place piece along winning line if possible
if (playerCount === 0) {
  indexOfCleanWinCombos.push([aiCount, arr]);
}
});
//block if required
if (block !== -1 && nextOTokens>0) {
nextSquares[block]="O";
        nextClasses[block]="squareAvailable";
        nextOTokens=nextOTokens-1;
        foundLegalMove=true;
}
//move if required
else if (move !== -1 && placeToMove !== -1)
{
  nextSquares[move]=null;
  nextClasses[move]="squareEmpty";
  
  if (nextSquares[placeToMove] === "X"){
    nextClasses[placeToMove] = "squareUnavailable";
    nextXTokens=nextXTokens + 1;
  }
  else{
    nextClasses[placeToMove]="squareAvailable";
  }
  nextSquares[placeToMove]="O";
  foundLegalMove=true;

}
if (!foundLegalMove) {

    //loop until find random valid move
    while (!foundLegalMove){
      //get random square
      let randomCell = Math.floor(Math.random()*(max-min +1))+min;

      //if empty and can place token, place token
      if (nextClasses[randomCell] === "squareEmpty" && nextOTokens>0)
      {
        nextSquares[randomCell]="O";
        nextClasses[randomCell]="squareAvailable";
        nextOTokens=nextOTokens-1;
        foundLegalMove=true;
        break;
        
      }
      //if full of own piece and can be moved, find spot to move to
      else if (nextSquares[randomCell] === "O" && nextClasses[randomCell] ==="squareAvailable"){
          let adj = calculateAdjacent(randomCell);

          //pick random direction
          let randomDirection = Math.floor(Math.random()*7);
          for (let r=0;r<8;r++)
          {
            //if empty, move there
            if (nextClasses[adj[randomDirection]] === "squareEmpty")
            {
              nextSquares[randomCell]=null;
              nextClasses[randomCell]="squareEmpty";
              nextClasses[adj[randomDirection]]="squareAvailable";
              nextSquares[[adj[randomDirection]]]="O";
              foundLegalMove=true;
              break;
            }
            //if full of available X, move and capture
            else if (nextClasses[adj[randomDirection]] === "squareAvailable" && nextSquares[adj[randomDirection]]==="X")
            {
                nextSquares[randomCell]=null;
                nextClasses[randomCell]="squareEmpty";
                nextClasses[adj[randomDirection]]="squareUnavailable";
                nextSquares[[adj[randomDirection]]]="O";
                nextXTokens=nextXTokens+1;
                foundLegalMove=true;
                break;
            }

            //otherwsie look in next direction
            else{
                randomDirection=(randomDirection+1)%8;
            }
            
        }
      }
      i=i+1;
      //extremely unlikely but potential ai never finds a move in 1000 goes, quick exit con to ensure no inifnite loops
      if (i>1000){ //im pretty srue it will break if this happens
        break;
      }
    }
    
    
    
}
    winnerCheck=calculateWinner(nextSquares);
    if(winnerCheck){
      nextClasses[winnerCheck[0]]="squareWinning";
      nextClasses[winnerCheck[1]]="squareWinning";
      nextClasses[winnerCheck[2]]="squareWinning";
      nextClasses[winnerCheck[3]]="squareWinning";
      setWinningPlayer("O - AI");
    } 
    setSquares(nextSquares);
    setClasses(nextClasses);
    setOTokens(nextOTokens);
    setXTokens(nextXTokens);

    setMoveNumber(moveNumber+1);

  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winningPlayer;
  } else {
    status = "Current player: " + (winner ? winningPlayer : "X - Player");
  }
  let displayMoveStatus="Move Number: " + moveNumber;
  
  
  return (
    <React.Fragment>
            <h1>Move Mode</h1>
        <div className="container-fluid">
    
          <div className="row justify-content-center">

          <div className="col col-auto justify-content-center">
            
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
            <div className="col col-auto justify-content-center">

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
            <div className="col col-auto justify-content-center">
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
            </div><div className="row">
            <div className="col">
              <InfoBox status={status} displayMoveStatus={displayMoveStatus} oTokens = {oTokens} xTokens={xTokens} />
            </div>
      </div>
</div>
    </React.Fragment>
  );
}

function getWinningLines()
{
  return[
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
}
function calculateWinner(squares) {
   const lines=getWinningLines();

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c,d] = lines[i];
    
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {

      return [a,b,c,d];
    }
  }
  return null;
}
function calculateAdjacent(i) {
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