import './App.css';
import { TicTacToe } from './TicTacToe';
import { Switch, FormControlLabel } from '@mui/material';
import React from 'react';
import { pink } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';


const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));


function App() {

  const [isSinglePlayer, setIsSinglePlayer] = React.useState(true);
  const handleModeToggle = (event) => {
    setIsSinglePlayer(event.target.checked);
  };
  return (
    <div  className="app-container">
      <header className="header">
  <h1 className="title">Tic-Tac-Toe</h1>
  <div className="mode-toggle">
    <FormControlLabel
      control={
        <PinkSwitch
          checked={isSinglePlayer}
          onChange={handleModeToggle}
          name="gameMode"
        />
      }
      label={isSinglePlayer ? "Singleplayer" : "Multiplayer"}
    />
  </div>
</header>
      <main>
    <TicTacToe singlePlayer={isSinglePlayer}></TicTacToe>
      </main>
      <footer>
          Developed by Paruchuri Pavankarthik
      </footer>
    </div>
  );
}

export default App;
