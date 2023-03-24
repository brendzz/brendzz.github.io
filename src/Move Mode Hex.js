import React, {useState} from "react";
import { HexGrid, Layout, Hexagon, GridGenerator, Pattern, Path, Hex, Text, HexUtils} from 'react-hexgrid';
import "./MoveModeHex.css";
function Cell({className,value, onCellClick}) {
  className="cell "+className;
  return (
    <React.Fragment>
    
  <button 
    className={className}
    onClick={onCellClick}>
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
  <div className="squareX"></div><h2 className="inlineH">{xTokens} / 6 pieces left</h2>
  <br></br>
  <div className="squareO"></div><h2 className="inlineH">{oTokens} / 6 pieces left</h2>
  <br></br>
  <h2><strong>Rules</strong></h2>
  <h3>- On your turn you can either</h3>
  <ul><li><h3>Place a piece in an empty cell</h3> </li>
  <li><h3>Move one of your existing pieces to an adjacent cell that is empty or contains an opponent's piece</h3></li></ul>

  <h3>- Moving a piece onto an opponent's piece replaces that cell with your piece permanently</h3>
  <h3>- Adjacency crosses over the borders i.e. Left side is adjacent to right side, top is adjacent to bottom and so on</h3>
  <h3>- You have a limited supply of 6 pieces (pieces are returned to your supply on being replaced)</h3>
  <h3>- Four pieces in a row wins (including across borders via adjanency) </h3>

</React.Fragment>);
}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerFound, setWinnerFound] = useState(false);
  const [xTokens,setXTokens]= useState(6);
  const [oTokens,setOTokens]= useState(6);
  const [moveStatus, setMoveStatus] = useState(-1);
  const [cells, setCells] = useState(Array(19).fill(null));
  let initializeClasses = Array(19).fill("cellEmpty")
  initializeClasses[0]="cellInaccessible";
  const [classes, setClasses] = useState(initializeClasses);
  const [moveNumber,setMoveNumber] = useState(1);
  const hexagons = GridGenerator.hexagon(2);

  function handleClick(i) {
   
    //if winner found
    if (classes[i] === "cellUnavailableX" ||classes[i] === "cellUnavailableO" || calculateWinner(i,cells)) {
      return;
    }
    const nextClasses = classes.slice();
    
    //check if correct turn and selecting own piece
    if ((xIsNext && cells[i]==="X") || (!xIsNext && cells[i]==="O"))
    {
      //if unselecting moving piece, unhighlight all adjacent ones
      if(classes[i] === "cellMovingX" || classes[i] === "cellMovingO")
      {
        nextClasses[i] = classes[i] === "cellMovingX"  ? "cellAvailableX" : "cellAvailableO"
        const adjacentCells = calculateAdjacent(i);
        for (let a = 0; a < adjacentCells.length; a++) 
        {
          if(nextClasses[adjacentCells[a]] === "cellAdjacent")
          {
            nextClasses[adjacentCells[a]] = "cellEmpty"
          }
          else if (nextClasses[adjacentCells[a]] === "cellAdjacentReplace")
          {
            nextClasses[adjacentCells[a]] = classes[i] !== "cellMovingX"  ? "cellAvailableX" : "cellAvailableO"
          }
        }
        setClasses(nextClasses);
      }

      //if moving a piece, highlight adjacent locations
      if(classes[i] === "cellAvailableX" || classes[i] === "cellAvailableO")
      {

          nextClasses[i] = classes[i] === "cellAvailableX" ? "cellMovingX" : "cellMovingO";
        //highlight/unhighlight new adjacent cells and return
        const adjacentCells = calculateAdjacent(i);

        for (let j = 0; j < classes.length; j++) 
        {
          if (adjacentCells.includes(j))
          {
            if(classes[j] === "cellEmpty" || classes[j] === "cellAdjacent" )
            {
              nextClasses[j] = "cellAdjacent";
            }
            else if (classes[j] === "cellAvailableX" || classes[j] ==="cellAvailableO" )
            {
              if((xIsNext && cells[j] !== "X") ||(!xIsNext && cells[j] !== "O") ){
                nextClasses[j] = "cellAdjacentReplace";
              }
            }
            else if (classes[j]==="cellMovingX" || classes[j] ==="cellMovingO")
            {
              nextClasses[j]= classes[j]==="cellMovingX" ? "cellAvailableX" : "cellAvailableO"
            }
          }
          else if (classes[j] === "cellAdjacent")
          {
            nextClasses[j] = "cellEmpty";
          }
          else if (classes[j] === "cellMovingX" || classes[j] === "cellMovingO")
          {
            nextClasses[j] = nextCells[j]==="X" ? "cellAvailableX" : "cellAvailableO"
          }
          else if (classes[j] === "cellAdjacentReplace")
          {
            nextClasses[j] = classes[j]==="cellMovingX" ? "cellAvailableX" : "cellAvailableO"
          }
        }
        setClasses(nextClasses);
      }
      
      return;
    }
    const nextCells = cells.slice();
    let movingTokenIndex = classes.indexOf("cellMovingX");
    if (movingTokenIndex ===-1){
      movingTokenIndex = classes.indexOf("cellMovingO");
    }
    //if selecting an adjacent place to move to
    if(classes[i] === "cellAdjacent" && movingTokenIndex != -1 || classes[i] === "cellAdjacentReplace" && movingTokenIndex != -1)
    {
      
      if (xIsNext && cells[movingTokenIndex]==="X"){
        nextCells[i]="X";
        if (classes[i] === "cellAdjacentReplace"){
          nextClasses[i] = "cellUnavailableX";
          setOTokens(oTokens+1);
        }
        else{nextClasses[i]="cellAvailableX";}
      }
      else if (!xIsNext && cells[movingTokenIndex]==="O"){
        nextCells[i]="O";
        if (classes[i] === "cellAdjacentReplace"){
          nextClasses[i] = "cellUnavailableO";
          setXTokens(xTokens+1);
        }
        else{nextClasses[i]="cellAvailableO";}
      }
      else{
        return;
      }

      
      //reset all adjacent stuff
       // nextClasses[i]="cellAvailable";

        nextCells[movingTokenIndex]= null;
        nextClasses[movingTokenIndex] = "cellEmpty";
        const adjacentCells = calculateAdjacent(movingTokenIndex);
        for (let a = 0; a < adjacentCells.length; a++) 
        {
          if(nextClasses[adjacentCells[a]] === "cellAdjacent")
          {
            nextClasses[adjacentCells[a]] = "cellEmpty"
          }
          else if(nextClasses[adjacentCells[a]] === "cellAdjacentReplace")
          {
        
            nextClasses[adjacentCells[a]] = nextCells[adjacentCells[a]]==="X" ? "cellAvailableX" : "cellAvailableO"
          }
          else if(nextClasses[adjacentCells[a]] === "cellMovingX" || nextClasses[adjacentCells[a]] === "cellMovingO" )
          {
            nextClasses[adjacentCells[a]] = nextCells[adjacentCells[a]]==="X" ? "cellAvailableX" : "cellAvailableO"
          }
        }
      }
      //if placing an X
    else if (xIsNext && cells[i]!=="X" && classes[i]==="cellEmpty" && xTokens>0 && movingTokenIndex === -1) {
      nextCells[i] = "X";
      nextClasses[i] = "cellAvailableX";
      if(xTokens>0){
      setXTokens(xTokens-1);
      }
    } 
    //if placing an O
    else if(!xIsNext && cells[i]!=="O" && classes[i]==="cellEmpty" && oTokens>0 && movingTokenIndex === -1){
      nextCells[i] = "O";
      nextClasses[i] = "cellAvailableO";
      if(oTokens>0){
        setOTokens(oTokens-1);
        }
    }
    else{
      return;
    }
    
   const winnerCheck=calculateWinner(i,nextCells);
  
    if(winnerCheck){
      nextClasses[winnerCheck[0]]="cellWinning";
      nextClasses[winnerCheck[1]]="cellWinning";
      nextClasses[winnerCheck[2]]="cellWinning";
      nextClasses[winnerCheck[3]]="cellWinning";
      setWinnerFound(xIsNext ===true ? "X" : "O");
}
    setCells(nextCells);
    setClasses(nextClasses);
      
    setXIsNext(!xIsNext);

    setMoveNumber(moveNumber+1);
  }


  let status;
  if (winnerFound !== false) {
    status = "Winner: " + winnerFound;
  } else {
    status = "Current player: " + (xIsNext ? "Green" : "Purple");
  }
  let displayMoveStatus="Move Number: " + moveNumber;
  
  return (
    <React.Fragment>
  
        <div className="container">
        <HexGrid width={1200} height={800} viewBox="-50 -50 100 100"> 
        
       
        <Layout size={{ x: 5, y: 5 }} origin={{ x: -16.5, y: -38.5 }} spacing={1.1}>
            { hexagons.map((hex, i) => <Hexagon key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>
          <Layout size={{ x: 5, y: 5 }} origin={{ x: 25, y: -33.5 }} spacing={1.1}>
            { hexagons.map((hex, i) => <Hexagon key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>
          <Layout size={{ x: 5, y: 5 }} origin={{ x: 42, y: 4.5 }} spacing={1.1}>
            { hexagons.map((hex, i) => <Hexagon key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>

          <Layout size={{ x: 5, y: 5 }} origin={{ x: 16.5, y: 38.5 }} spacing={1.1}>
            { hexagons.map((hex, i) => <Hexagon key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>
          <Layout size={{ x: 5, y: 5 }} origin={{ x: -41.5, y: -4.5 }} spacing={1.1}>
            { hexagons.map((hex, i) => <Hexagon key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>
          <Layout size={{ x: 5, y: 5 }} origin={{ x: -24.5, y: 33.5 }} spacing={1.1}>
            { hexagons.map((hex, i) => <Hexagon key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>
          <Layout size={{ x: 5, y: 5 }} origin={{ x: 0, y: 0 }} spacing={1.1}>
            { 
            hexagons.map((hex, i) => <Hexagon id={"hexy"+convertHexagonCoordinates(i)} key={convertHexagonCoordinates(i)} q={hex.q} r={hex.r} s={hex.s} className={"cell cellPrimary "+classes[convertHexagonCoordinates(i)]}
                  onClick={() => handleClick(convertHexagonCoordinates(i))}><Text className="coordinates">{convertHexagonCoordinates(i)}</Text></Hexagon>) }
          </Layout>

          
        </HexGrid>
        <InfoBox status={status} displayMoveStatus={displayMoveStatus} oTokens = {oTokens} xTokens={xTokens} />
        </div>

    </React.Fragment>
  );
}

function calculateWinner(i,cells) {
  const lines=[
    [0,1,2,3],
    [0,1,2,3],
    [0,1,2,3],
    [0,1,2,3],
    [0,1,2,3],
    [0,1,2,3]];
  const lines2=lines.slice();
  const adjacents=calculateAdjacent(i);
  for (let j =0; j<6; j++)
  {
    lines2[j][0]=cells[i];
    lines2[j][1]=cells[adjacents[j]];
    
    const adj2=calculateAdjacent(adjacents[j]);
    lines2[j][2]=cells[adj2[j]];

    const adj3=calculateAdjacent(adj2[j]);
    lines2[j][3]=cells[adj3[j]];
    //console.log("i: "+i+" j: "+j+" "+lines2[j]);
    if (lines2[j][0] && lines2[j][0] ===lines2[j][1] && lines2[j][0]=== lines2[j][2])
    { 
      //if completing end of line
      if(lines2[j][0] === lines2[j][3]) {

        return [i,adjacents[j],adj2[j],adj3[j]];
      }
      else
      {
        //check if completing line mid way i.e 0, 2, 3 filled already, you fill 1
        if(j<3)
        {
          if (lines2[j][0]===cells[adjacents[j+3]])
          {return [i,adjacents[j],adj2[j],adjacents[j+3]];}
        }
        else
        {
          if (lines2[j][0]===cells[adjacents[j-3]])
          {return [i,adjacents[j],adj2[j],,adjacents[j-3]];}
        }
      }
    }
  }
  
  return null;
}

function convertHexagonCoordinates(i){

  const coordinates = [14,6,17,15,7,18,10,16,8,0,11,3,9,1,12,4,2,13,5];
  return coordinates[i];
}
function calculateAdjacent(i) {
  const totalCells=19;
  const adjacentCells=[
    mod((i + 1),totalCells),
    mod((i + 8),totalCells),
    mod((i + 7), totalCells),
    mod((i - 1), totalCells),
    mod((i - 8), totalCells),
    mod((i - 7),totalCells),
  ];
 return adjacentCells;
}
function mod(n, m) {
  return ((n % m) + m) % m;
}