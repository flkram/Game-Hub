import React, { useState, useEffect } from 'react';
import './_2048.css'; // Assuming you've moved the CSS to a file named 2048.css

const _2048 = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [wonGame, setWonGame] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  
  useEffect(() => {
    createBoard();
    addRandomTile();
    addRandomTile();
    window.addEventListener('keydown', onDirectionKeyPress);
    return () => window.removeEventListener('keydown', onDirectionKeyPress);
  }, []);

  const createBoard = () => {
    const initialBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    setBoard(initialBoard);
  };

  const addRandomTile = () => {
    const emptyTiles = [];
    board.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell === 0) emptyTiles.push([i, j]);
      })
    );
    
    if (emptyTiles.length === 0) return;

    const [randomI, randomJ] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newBoard = board.map(row => [...row]);
    newBoard[randomI][randomJ] = Math.random() < 0.9 ? 2 : 4;
    setBoard(newBoard);
    setTiles(prev => [
      ...prev,
      { row: randomI, column: randomJ, value: newBoard[randomI][randomJ] }
    ]);
  };

  const startNewGame = () => {
    setAlertMessage('');
    setTiles([]);
    createBoard();
    setScore(0);
    setWonGame(false);
    addRandomTile();
    addRandomTile();
  };

  const continuePlaying = () => {
    setAlertMessage('');
    window.addEventListener('keydown', onDirectionKeyPress);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    if (message === 'You won!') {
      setWonGame(true);
      window.removeEventListener('keydown', onDirectionKeyPress);
    }
  };

  const onDirectionKeyPress = (event) => {
    let movePossible;
    switch (event.key) {
      case 'ArrowUp':
        movePossible = moveTiles(1, 0);
        break;
      case 'ArrowDown':
        movePossible = moveTiles(-1, 0);
        break;
      case 'ArrowLeft':
        movePossible = moveTiles(0, -1);
        break;
      case 'ArrowRight':
        movePossible = moveTiles(0, 1);
        break;
      default:
        return;
    }
    if (movePossible) {
      addRandomTile();
      const gameOver = isGameOver();
      if (gameOver.gameOver) showAlert(gameOver.message);
    }
  };

  function moveTiles (directionY,directionX) {
    let movePossible = false;
    let mergedRecently = false;
  
    if(directionX !=0) {
      let startX = directionX === 1 ? 3 : 0;
      let stepX = directionX === 1 ? -1 : 1;
  
      for (let i=0;i<4;i++) {
        let j = startX;
        while ((j<=3 && stepX === 1) || (j>=0 && stepX === -1)) {
          if(board[i][j]===0) {
            j+= stepX;
            continue;
          }
          let destination = getDestinationSquare(i,j,0,directionX);
          let tileClass = ".row"+(i+1)+".column"+(j+1);
          let tile = document.querySelector(tileClass);
          if(!destination.merge || (destination.merge && mergedRecently)) {
            mergedRecently = false;
            destination.destinationX += destination.merge ? stepX : 0;
            board[i][destination.destinationX] = board[i][j];
            if(destination.destinationX !==j) {
              movePossible = true;
              board[i][j] = 0;
            }
            moveTileOnPage(i,destination.destinationX,tile,false);
            j+=stepX;
            continue;
          }
          mergedRecently = true;
          board[i][destination.destinationX] = board[i][j]*2;
          score +=board[i][destination.destinationX];
          scoreElement.innerHTML = score;
          movePossible = true;
          board[i][j] = 0;
          moveTileOnPage(i,destination.destinationX,tile,destination.merge);
          j+=stepX;
        }
      }
    } else if (directionY !=0) {
      let startY = directionY === 1 ? 3 : 0;
      let stepY = directionY === 1 ? -1 : 1;
  
      for (let j=0;j<4;j++) {
        let i = startY;
        while ((i<=3 && stepY === 1) || (i>=0 && stepY === -1)) {
          if(board[i][j]===0) {
            i+= stepY;
            continue;
          }
          let destination = getDestinationSquare(i,j,directionY,0);
          let tileClass = ".row"+(i+1)+".column"+(j+1);
          let tile = document.querySelector(tileClass);
          if(!destination.merge || (destination.merge && mergedRecently)) {
            mergedRecently = false;
            destination.destinationY += destination.merge ? stepY : 0;
            board[destination.destinationY][j] = board[i][j];
            if(destination.destinationY !==i) {
              movePossible = true;
              board[i][j] = 0;
            }
            moveTileOnPage(destination.destinationY,j,tile,false);
            i+=stepY;
            continue;
          }
          mergedRecently = true;
          board[destination.destinationY][j] = board[i][j]*2;
          score +=board[destination.destinationY][j];
          scoreElement.innerHTML = score;
          movePossible = true;
          board[i][j] = 0;
          moveTileOnPage(destination.destinationY,j,tile,destination.merge);
          i+=stepY;
        }
      }
    }
    return movePossible;
  };

  const isGameOver = () => {
    let emptySquare = false;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) emptySquare = true;
        if (board[i][j] === 2048 && !wonGame) return { gameOver: true, message: 'You won!' };
        if (j !== 3 && board[i][j] === board[i][j + 1]) emptySquare = true;
        if (i !== 3 && board[i][j] === board[i + 1][j]) emptySquare = true;
      }
    }
    if (emptySquare) return { gameOver: false, message: '' };
    return { gameOver: true, message: 'Game over!' };
  };

  return (
    <div className="container">
      <div className="alert" style={{ display: alertMessage ? 'flex' : 'none' }}>
        <div>{alertMessage}</div>
        {alertMessage === 'Game over!' ? (
          <button className="newGame" onClick={startNewGame}>Try again</button>
        ) : (
          <>
            <button className="newGame" onClick={startNewGame}>New game</button>
            <button className="newGame" onClick={continuePlaying}>Continue</button>
          </>
        )}
      </div>
      <div className="board">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="square"></div>
        ))}
      </div>
      <div className="tileContainer">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile row${tile.row + 1} column${tile.column + 1} value${tile.value}`}
          >
            {tile.value}
          </div>
        ))}
      </div>
      <div className="elementContainer">
        <div className="title">
          <h1>2048</h1>
        </div>
        <div className="scoreElementContainer">
          <div id="scoreLabel">Score</div>
          <div id="scoreElement">{score}</div>
        </div>
        <div>
          <button className="newGame" onClick={startNewGame}>New Game</button>
        </div>
      </div>
    </div>
  );
};

export default _2048;
