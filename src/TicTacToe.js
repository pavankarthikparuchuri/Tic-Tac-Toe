import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import confetti from 'canvas-confetti';

  const triggerConfetti = () => {
    confetti({
      particleCount: 100, // Number of confetti particles
      angle: 90, // Direction of confetti (90 is horizontal, 0 is upwards)
      spread: 45, // The spread angle of the confetti
      origin: { x: 0.5, y: 0.5 }, // Origin point of the confetti
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff'], // Colors of the confetti particles
    });
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: "#FFFFFF", // White text color
    fontFamily: "'Roboto', sans-serif", // Use a clean, modern font
    fontWeight: '500', // Medium weight for better readability
    '&:hover': {
      backgroundColor: '#F0F0F0', // Slightly darker background on hover
      borderColor: '#BDBDBD', // Darker border color on hover
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // More prominent shadow on hover
      transform: 'scale(1.05)', // Slightly increases the size of the button
    },
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Slightly more prominent box shadow for depth
    padding: '0 16px', // Adds some horizontal padding for a more balanced look
    borderRadius: "0px",
    border: "2px solid #333",
    width: "100px",
    height: "100px",
    fontSize: "2rem",
    cursor: "pointer",
    backgroundColor: "#ffF",
    transition: "backgroundColor 0.3s ease",
  }));
  
  
  
  
const rowCheck = (gridValues, gridSize) => {
    for(let row = 0;row<gridSize;row++){
        let flag = true, prev = null;
        for(let col = 0;col<gridSize;col++){
            if(!gridValues[row*gridSize+col]){
                flag = false;
                break;
            }
            if(!prev){
                prev = gridValues[row*gridSize+col];
            }else if(prev !== gridValues[row*gridSize+col]){
                flag = false;
                break;
            }
        }
        if(flag){
            return row;
        }
    }
    return -1;
}

const colCheck = (gridValues, gridSize) => {
    for(let col = 0;col<gridSize;col++){
        let flag = true, prev = null;
        for(let row = 0;row<gridSize;row++){
            if(!gridValues[row*gridSize+col]){
                flag = false;
                break;
            }
            if(!prev){
                prev = gridValues[row*gridSize+col];
            }else if(prev !== gridValues[row*gridSize+col]){
                flag = false;
                break;
            }
        }
        if(flag){
            return col;
        }
    }
    return -1;

}
const leftDiagnolCheck = (gridValues, gridSize) => {
    let prev= null;
    for(let i = 0;i<gridSize;i++){
        if(!gridValues[i*gridSize+i])return false;
        if(!prev){
            prev = gridValues[i*gridSize+i];
        }else if(prev !== gridValues[i*gridSize+i])return false;
    }
    return true;
}

const rightDiagnolCheck = (gridValues, gridSize) => {
    let prev= null, row = gridSize-1, col = 0;
    while(row>=0){
        if(!gridValues[row*gridSize+col])return false;
        if(!prev){
            prev = gridValues[row*gridSize+col];
        }else if(prev!==gridValues[row*gridSize+col])return false;
        row--;
        col++;
    }
    return true;
}

const checkWin = (player, board, size) => {

    const check1 = () => {
        for(let i = 0;i<size;i++){
            if(board[i*size+i]!==player)return false;
        }
        return true;
    }
    const check2 = () => {
        let i = size-1, j = 0;
        while(i>=0){
            if(board[i*size+j] !==player)return false;
            i--;j++;
        }
        return true;
    }

    const check3 = () => {
        for(let row = 0;row<size;row++){
            let flag = true;
            for(let col = 0;col<size;col++){
                if(board[row*size+col] !==player){
                    flag = false;
                    break;
                }
            }
            if(flag)return true;
        }
        return false;
    }
   
    const check4 = () => {
        for(let col = 0;col<size;col++){
            let flag = true;
            for(let row = 0;row<size;row++){
                if(board[row*size+col] !== player){
                    flag = false;
                    break;
                }
            }
            if(flag)return true;
        }
        return false;
    }
    return check1() || check2() || check3() || check4();
}
const miniMax = (board, isMaximizingPlayer, size) => {
    const availableMoves = board.reduce((acc, curr, idx) => {
        if (!curr) acc.push(idx);
        return acc;
      }, []);
      if(checkWin("O",board,size))return 1 * (availableMoves.length+1);
      if(checkWin("X",board,size)) return -1 * (availableMoves.length+1);
      if(!availableMoves.length)return 0;
      if(isMaximizingPlayer){
        let maxi = -Infinity;
        for(let ind of availableMoves){
            board[ind] = 'O';
            maxi = Math.max(maxi, miniMax(board, !isMaximizingPlayer, size));
            board[ind] = null;
        }
        return maxi;
      }else{
        let mini = Infinity;
        for(let ind of availableMoves){
            board[ind] = 'X';
            mini = Math.min(mini, miniMax(board, !isMaximizingPlayer, size));
            board[ind] = null;
        }
        return mini;
      }
}

function FormRow({gridSize, row, gridValues,isX, setGridValues, setisX, singlePlayer}) {
    const bestMove = (temp) => {
        const availableMoves = temp.reduce((acc, curr, idx) => {
            if (!curr) acc.push(idx);
            return acc;
          }, []);
          let bestVal = -Infinity;
          let ind = -1;
          for(let moves of availableMoves){
            temp[moves] = 'O';
            let val = miniMax(temp, false,  gridSize);
            temp[moves] = null;
            if(val>bestVal){
                bestVal = val;
                ind = moves;
            }
          }
          return ind;
    }
    const handleClick=(col)=>{
        if(gridValues[row*gridSize+col] || rightDiagnolCheck(gridValues, gridSize) || leftDiagnolCheck(gridValues, gridSize) || colCheck(gridValues, gridSize)!==-1 || rowCheck(gridValues, gridSize)!==-1){
            return;
        }
        let temp = [...gridValues];
        temp[row*gridSize+col] = isX ? 'X' : 'O';
        if(singlePlayer) {
            let move = bestMove(temp);
            temp[move] = 'O';
            console.log(move, "AI move made");
        }
        setGridValues(temp);
        if(!singlePlayer)  setisX((prev)=> !prev);
        if(rightDiagnolCheck(temp, gridSize) || leftDiagnolCheck(temp, gridSize) || colCheck(temp, gridSize)!==-1 || rowCheck(temp, gridSize)!==-1){
          triggerConfetti();
        }
    }

  const colorChecker = (col, value) => {
    if(rowCheck(gridValues, gridSize) === row)return {
          backgroundColor: "#32CD32",
          color: "#ffffff", // White text color
          borderRadius: "5px",
          border: '4px solid transparent', // Transparent border to make space for the gradient
          borderImage: 'linear-gradient(135deg, #32CD32, #00FA9A) 1', // Linear gradient border
          fontWeight: "bold",
          textTransform: "uppercase",
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          '&:hover': {
            borderImage: 'linear-gradient(135deg, #28a745, #00C97C) 1', // Darker gradient on hover
            backgroundColor: "#32CD32"
  },
     };
        if(colCheck(gridValues, gridSize) === col)return {
          backgroundColor: "#32CD32",
          color: "#ffffff", // White text color
          borderRadius: "5px",
          border: '4px solid transparent', // Transparent border to make space for the gradient
          borderImage: 'linear-gradient(135deg, #32CD32, #00FA9A) 1', // Linear gradient border
          fontWeight: "bold",
          textTransform: "uppercase",
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          '&:hover': {
    borderImage: 'linear-gradient(135deg, #28a745, #00C97C) 1', // Darker gradient on hover
    backgroundColor: "#32CD32"
  },
         };
        if(leftDiagnolCheck(gridValues, gridSize) && row === col)return {
          backgroundColor: "#32CD32",
          color: "#ffffff", // White text color
  borderRadius: "5px",
  border: '4px solid transparent', // Transparent border to make space for the gradient
  borderImage: 'linear-gradient(135deg, #32CD32, #00FA9A) 1', // Linear gradient border
  fontWeight: "bold",
  textTransform: "uppercase",
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  '&:hover': {
    borderImage: 'linear-gradient(135deg, #28a745, #00C97C) 1', // Darker gradient on hover
    backgroundColor: "#32CD32"
  },
         };
        if(rightDiagnolCheck(gridValues, gridSize) && row+col === gridSize-1)return {
          backgroundColor: "#32CD32",
          color: "#ffffff", // White text color
  borderRadius: "5px",
  border: '4px solid transparent', // Transparent border to make space for the gradient
  borderImage: 'linear-gradient(135deg, #32CD32, #00FA9A) 1', // Linear gradient border
  fontWeight: "bold",
  textTransform: "uppercase",
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  '&:hover': {
    borderImage: 'linear-gradient(135deg, #28a745, #00C97C) 1', // Darker gradient on hover
    backgroundColor: "#32CD32"
  },
         };
        if(value === 'X') return {backgroundColor:'#FF8C00','&:hover': {
    backgroundColor: "#FF8C00"
  },};
        if(value === 'O') return {backgroundColor: '#008080','&:hover': {
    backgroundColor: "#008080"
  },};
  }
  return (
    <Box sx={{display: "flex"}}>
      {
        [...Array(gridSize)].map((item, index)=> (
        <ColorButton variant="outlined" sx={colorChecker(index, gridValues[row*gridSize + index])} onClick={() => handleClick(index)}><Typography sx={{fontSize: "2rem"}}>{gridValues[row*gridSize + index]}</Typography></ColorButton>
        ))
      }
    </Box>
  );
}


export const TicTacToe = ({singlePlayer}) => {
    React.useEffect(()=>{
      setGridValues(Array(9).fill(null));
      setisX(true);
    },[singlePlayer]);
    const gridSize = 3;
    const [isX, setisX] = React.useState(true);
    const [gridValues, setGridValues] = React.useState(Array(9).fill(null));
    // const [singlePlayer, setSinglePlayer] = React.useState(false);

  const winnerScenario = () => {
    const matrix = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
  
    for (let element of matrix) {
        const [a, b, c] = element;
        if (gridValues[a] !== null && gridValues[a] === gridValues[b] && gridValues[b] === gridValues[c]) {
            return gridValues[a];
        }
    }
    return null;
  }


  const statusStyle = {
    color: winnerScenario()
        ? '#28a745'
        : gridValues.every(value => value !== null)
            ? 'chocolate'
            : '#007bff',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px'
};

const status = winnerScenario() ? `Winner is : ${winnerScenario()}` : gridValues.every(value => value !== null) ? `No winners this time. It's a tie!` : `Next player : ${isX ? 'X' : 'O'}`

const resetGame = () => {
  setGridValues(Array(gridSize * gridSize).fill(null));
  setisX(true);
};
  return (
    <Box
     className="container"
    >
      <div className="status" style={statusStyle}>{status}</div>
      {(<Box style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {
            [...Array(gridSize)].map((item, index)=> (
                <Box>
                <FormRow gridSize={gridSize} row={index} gridValues={gridValues} isX={isX} setGridValues={setGridValues} setisX={setisX} singlePlayer={singlePlayer}/>
              </Box>
            ))
        }
      </Box>)}
      {(winnerScenario() || gridValues.every(value => value !== null)) && (
                <button className="reset-button" onClick={resetGame}>
                    Restart
                </button>
            )}
    </Box>
  );
};
