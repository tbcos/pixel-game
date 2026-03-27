import React from 'react';
import type { ScoreData } from '../App';

interface Props {
  scoreData: ScoreData | null;
  onRestart: () => void;
}

const ResultScreen: React.FC<Props> = ({ scoreData, onRestart }) => {
  if (!scoreData) return null;

  return (
    <div className="screen result-screen">
      <h1 className="title" style={{ color: scoreData.isPass ? 'var(--text-color)' : 'var(--error-color)' }}>
        {scoreData.isPass ? 'STAGE CLEAR' : 'GAME OVER'}
      </h1>
      
      <div style={{ margin: '30px 0', fontSize: '1.5rem', border: '4px dashed var(--border-color)', padding: '30px', backgroundColor: '#111' }}>
        <p>TOTAL SCORE: {scoreData.score}</p>
        <p style={{ fontSize: '1.2rem', marginTop: '20px', color: 'var(--highlight-color)', lineHeight: '1.6' }}>
          {scoreData.isPass ? 'CONGRATULATIONS!\nYOU DEFEATED ALL BOSSES!' : 'TRY AGAIN TO BEAT THE BOSSES!'}
        </p>
      </div>

      <button onClick={onRestart} style={{ marginTop: '20px' }}>CONTINUE?</button>
    </div>
  );
};

export default ResultScreen;
