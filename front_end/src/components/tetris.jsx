import React, { useEffect, useRef, useState } from 'react';

const Tetris = () => {
  const canvasRef = useRef(null);
  const [tetrominoSequence, setTetrominoSequence] = useState([]);
  const [playfield, setPlayfield] = useState([]);
  const [tetromino, setTetromino] = useState(null);
  const [rAF, setRAF] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const grid = 32;
  let count = 0;

  useEffect(() => {
    initializePlayfield();
    setTetromino(getNextTetromino());
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const loop = () => {
      const rAFId = requestAnimationFrame(loop);
      setRAF(rAFId);
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (playfield[row][col]) {
            const name = playfield[row][col];
            context.fillStyle = colors[name];
            context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
          }
        }
      }

      if (tetromino) {
        if (++count > 35) {
          tetromino.row++;
          count = 0;
          if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
            tetromino.row--;
            placeTetromino();
          }
        }

        context.fillStyle = colors[tetromino.name];
        for (let row = 0; row < tetromino.matrix.length; row++) {
          for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
              context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
            }
          }
        }
      }
    };

    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
          ? tetromino.col - 1
          : tetromino.col + 1;

        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
          setTetromino(prev => ({ ...prev, col }));
        }
      }

      if (e.which === 38) {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
          setTetromino(prev => ({ ...prev, matrix }));
        }
      }

      if (e.which === 40) {
        const row = tetromino.row + 1;

        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
          setTetromino(prev => ({ ...prev, row: row - 1 }));
          placeTetromino();
          return;
        }

        setTetromino(prev => ({ ...prev, row }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tetromino, playfield, gameOver]);

  function initializePlayfield() {
    const initialPlayfield = Array.from({ length: 22 }, () => Array(10).fill(0));
    setPlayfield(initialPlayfield);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      setTetrominoSequence(prev => [...prev, name]);
    }
  }

  function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === 'I' ? -1 : -2;
    return {
      name: name,
      matrix: matrix,
      row: row,
      col: col
    };
  }

  function rotate(matrix) {
    const N = matrix.length - 1;
    return matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
  }

  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col])
        ) {
          return false;
        }
      }
    }
    return true;
  }

  function placeTetromino() {
    const newPlayfield = playfield.map(row => [...row]);
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          if (tetromino.row + row < 0) {
            return showGameOver();
          }
          newPlayfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }

    for (let row = newPlayfield.length - 1; row >= 0; ) {
      if (newPlayfield[row].every(cell => !!cell)) {
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < newPlayfield[r].length; c++) {
            newPlayfield[r][c] = newPlayfield[r - 1][c];
          }
        }
      } else {
        row--;
      }
    }

    setPlayfield(newPlayfield);
    setTetromino(getNextTetromino());
  }

  function showGameOver() {
    cancelAnimationFrame(rAF);
    setGameOver(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  }

  const tetrominos = {
    'I': [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    'J': [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    'L': [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    'O': [
      [1, 1],
      [1, 1],
    ],
    'S': [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    'Z': [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    'T': [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]
  };

  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={640}
      style={{ border: '1px solid white' }}
    />
  );
};

export default Tetris;
