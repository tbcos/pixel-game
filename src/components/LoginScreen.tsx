import React, { useState } from 'react';

interface Props {
  onLogin: (id: string) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim() !== '') {
      onLogin(id.trim());
    }
  };

  return (
    <div className="screen login-screen">
      <h1 className="title">PIXEL TRIVIA</h1>
      <p className="loading-text" style={{ color: "var(--highlight-color)" }}>INSERT COIN</p>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
        <input 
          type="text" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          placeholder="ENTER PLAYER ID"
          maxLength={15}
          autoFocus
        />
        <button type="submit" disabled={!id.trim()}>PRESS START</button>
      </form>
    </div>
  );
};

export default LoginScreen;
