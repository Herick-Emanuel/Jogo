import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import Player from './components/player';
import Platform from './components/platform';

const GRAVITY = 0.5;
const JUMP_POWER = -10;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 5;

function App() {
  const [player, setPlayer] = useState({
    x: 50,
    y: window.innerHeight - PLAYER_HEIGHT - 10,
    velX: 0,
    velY: 0,
    onGround: true,
  });

  const [cameraX, setCameraX] = useState(0);

  const platforms = [
    { x: 0, y: window.innerHeight - 10, width: window.innerWidth, height: 10 },
    { x: 100, y: window.innerHeight - 100, width: 200, height: 20 },
    { x: 400, y: window.innerHeight - 150, width: 300, height: 20 },
    { x: 750, y: window.innerHeight - 200, width: 150, height: 20 },
    { x: 950, y: window.innerHeight - 250, width: 200, height: 20 },
    { x: 1200, y: window.innerHeight - 300, width: 100, height: 20 },
    { x: 1400, y: window.innerHeight - 350, width: 250, height: 20 },
    { x: 1700, y: window.innerHeight - 400, width: 200, height: 20 },
    { x: 1950, y: window.innerHeight - 450, width: 150, height: 20 },
    { x: 2200, y: window.innerHeight - 500, width: 300, height: 20 },
    { x: 2550, y: window.innerHeight - 550, width: 300, height: 20 }, 
    { x: 2800, y: window.innerHeight - 600, width: 300, height: 20 },
    { x: 3000, y: window.innerHeight - 650, width: 350, height: 20 },
    { x: 3350, y: window.innerHeight - 700, width: 150, height: 20 },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayer((prev) => ({ ...prev, velX: -PLAYER_SPEED }));
      } else if (e.key === 'ArrowRight') {
        setPlayer((prev) => ({ ...prev, velX: PLAYER_SPEED }));
      } else if (e.key === ' ' && player.onGround) {
        setPlayer((prev) => ({ ...prev, velY: JUMP_POWER, onGround: false }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setPlayer((prev) => ({ ...prev, velX: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player.onGround]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayer((prev) => {
        let newVelY = prev.velY + GRAVITY;
        let newX = prev.x + prev.velX;
        let newY = prev.y + newVelY;
        let onGround = false;

        platforms.forEach((platform) => {
          if (
            newY + PLAYER_HEIGHT > platform.y &&
            prev.y + PLAYER_HEIGHT <= platform.y &&
            newX + PLAYER_WIDTH > platform.x &&
            newX < platform.x + platform.width
          ) {
            newY = platform.y - PLAYER_HEIGHT;
            newVelY = 0;
            onGround = true;
          }
          if (
            newY < platform.y + platform.height &&
            prev.y >= platform.y + platform.height &&
            newX + PLAYER_WIDTH > platform.x &&
            newX < platform.x + platform.width
          ) {
            newY = platform.y + platform.height;
            newVelY = 0;
          }
          if (
            newX + PLAYER_WIDTH > platform.x &&
            newX < platform.x + platform.width &&
            newY + PLAYER_HEIGHT > platform.y &&
            newY < platform.y + platform.height
          ) {
            if (prev.velX > 0) {
              newX = platform.x - PLAYER_WIDTH;
            } else if (prev.velX < 0) {
              newX = platform.x + platform.width;
            }
          }
        });

        let newCameraX = newX - window.innerWidth / 2 + PLAYER_WIDTH / 2;
        if (newCameraX < 0) newCameraX = 0;
        return { ...prev, x: newX, y: newY, velY: newVelY, onGround: onGround };
      });

      setCameraX((prev) => {
        let newCameraX = player.x - window.innerWidth / 2 + PLAYER_WIDTH / 2;
        if (newCameraX < 0) newCameraX = 0; 
        return newCameraX;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [platforms]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer x={-cameraX}>
        {platforms.map((platform, i) => (
          <Platform key={i} {...platform} />
        ))}
        <Player x={player.x} y={player.y} />
      </Layer>
    </Stage>
  );
}

export default App;
