import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

const App = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/scores/')
            .then(response => {
                setScores(response.data);
            })
            .catch(error => {
                console.error('Error fetching scores:', error);
            });
    }, []);

    return (
        <div>
            <h1>Game Scores</h1>
            <ul>
                {scores.map(score => (
                    <li key={score.id}>
                        {score.player_name}: {score.game_name} - Score: {score.score} | Games Played: {score.games_played} | Time Played: {score.time_played} mins
                    </li>
                ))}
            </ul>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
