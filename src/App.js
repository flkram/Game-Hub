import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import DoodleJump from './components/doodlejump.jsx'; // Import your game components
import Tetris from './components/tetris.jsx';
import Sudoku from './components/sudoku.jsx';
import Game2048 from './components/_2048.jsx';
import './App.css'; // Import the CSS file

function App() {
  return (
    <div>
      <h1>React Project Links</h1>
      <nav>
        <ul>
          <li>
            <Link to="/2048">Play 2048</Link>
          </li>
          <li>
            <Link to="/sudoku">Play Sudoku</Link>
          </li>
          <li>
            <Link to="/doodlejump">Play Doodle Jump</Link>
          </li>
          <li>
            <Link to="/tetris">Play Tetris</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/2048" element={<Game2048 />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/doodlejump" element={<DoodleJump />} />
        <Route path="/tetris" element={<Tetris />} />
      </Routes>
    </div>
  );
}

export default App;


