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
      <img src="/PlayExit.png" alt="Game Over" style={{ width: 150, marginBottom: 30 }} />
      <div style={{ display: 'flex', gap: 20 }}>
        <button onClick={onPlay} style={{
          width: 70,
          height: 35,
          background: 'transparent',
          border: 'none',
          position: 'absolute',
          left: 'calc(50% - 60px)',
          top: 'calc(50% - 20px)',
          cursor: 'pointer',
        }} aria-label="Play" />
        <button onClick={onExit} style={{
          width: 70,
          height: 35,
          background: 'transparent',
          border: 'none',
          position: 'absolute',
          left: 'calc(50% - 60px)',
          top: 'calc(50% + 20px)',
          cursor: 'pointer',
        }} aria-label="Exit" />
      </div>
    </div>
  );
};

export default GameOverScreen; 