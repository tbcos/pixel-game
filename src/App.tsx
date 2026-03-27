import React, { useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

export type GameState = 'login' | 'playing' | 'result';

export interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface ScoreData {
  score: number;
  isPass: boolean;
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('login');
  const [userId, setUserId] = useState<string>('');
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);

  const handleLogin = (id: string) => {
    setUserId(id);
    setGameState('playing');
  };

  const handleFinish = (result: ScoreData) => {
    setScoreData(result);
    setGameState('result');
  };

  const handleRestart = () => {
    setScoreData(null);
    setGameState('login');
  };

  return (
    <div className="app-container">
      {gameState === 'login' && <LoginScreen onLogin={handleLogin} />}
      {gameState === 'playing' && (
        <GameScreen 
          userId={userId} 
          onFinish={handleFinish} 
        />
      )}
      {gameState === 'result' && (
        <ResultScreen 
          scoreData={scoreData} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default App;
