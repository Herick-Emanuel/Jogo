import React from 'react';

const GameOverScreen = ({ onPlay, onExit }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', width: 150, height: 150, marginBottom: 30 }}>
        <img src="/PlayExit.png" alt="Game Over" style={{ width: 150, height: 150, display: 'block' }} />
        <button onClick={onPlay} style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 150,
          height: 75,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }} aria-label="Play" />
        <button onClick={onExit} style={{
          position: 'absolute',
          left: 0,
          top: 75,
          width: 150,
          height: 75,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }} aria-label="Exit" />
      </div>
    </div>
  );
};

export default GameOverScreen; 