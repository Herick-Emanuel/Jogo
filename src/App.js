import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import Player from './components/player';
import Platform from './components/platform';
import Ground from './components/ground';
import Ladder from './components/ladder';

const GRAVITY = 0.5;
const JUMP_POWER = -10;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 5;

function App() {
  const [player, setPlayer] = useState({
    x: 50,
    y: window.innerHeight - PLAYER_HEIGHT - 41,
    velX: 0,
    velY: 0,
    onGround: true,
    onLadder: false,
  });

  const [cameraX, setCameraX] = useState(0);

  const ground = { x: 0, y: window.innerHeight - 40, width: window.innerWidth, height: 50 };
  const platforms = [
    { x: 2080, y: window.innerHeight - 90, width: 200, height: 50 },
    { x: 2400, y: window.innerHeight - 150, width: 300, height: 50 },
    { x: 2850, y: window.innerHeight - 200, width: 150, height: 50 },
    { x: 3150, y: window.innerHeight - 150, width: 300, height: 50 },
    { x: 3200, y: window.innerHeight - 300, width: 100, height: 50 },
    { x: 3400, y: window.innerHeight - 350, width: 250, height: 50 },
    { x: 3550, y: window.innerHeight - 500, width: 200, height: 50 },
    { x: 3900, y: window.innerHeight - 550, width: 150, height: 50 },
    { x: 4200, y: window.innerHeight - 200, width: 300, height: 50 },
    { x: 4650, y: window.innerHeight - 250, width: 200, height: 50 },
    { x: 4800, y: window.innerHeight - 600, width: 100, height: 50 },
    { x: 5000, y: window.innerHeight - 650, width: 350, height: 50 },
    { x: 5350, y: window.innerHeight - 700, width: 150, height: 50 },
  ];
  const ladders = [
    { x: 3300, y: window.innerHeight - 300, width: 64, height: 150 },
    { x: 3500, y: window.innerHeight - 500, width: 64, height: 150 },
    { x: 4750, y: window.innerHeight - 600, width: 64, height: 350 },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayer((prev) => ({ ...prev, velX: -PLAYER_SPEED }));
      } else if (e.key === 'ArrowRight') {
        setPlayer((prev) => ({ ...prev, velX: PLAYER_SPEED }));
      } else if (e.key === ' ' && player.onGround && !player.onLadder) {
        setPlayer((prev) => ({ ...prev, velY: JUMP_POWER, onGround: false }));
      } else if (e.key === 'ArrowUp' && player.onLadder) {
        setPlayer((prev) => ({ ...prev, velY: -PLAYER_SPEED }));
      } else if (e.key === 'ArrowDown' && player.onLadder) {
        setPlayer((prev) => ({ ...prev, velY: PLAYER_SPEED }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setPlayer((prev) => ({ ...prev, velX: 0 }));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setPlayer((prev) => ({ ...prev, velY: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player.onGround, player.onLadder]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayer((prev) => {
        let newVelY = prev.onLadder ? prev.velY : prev.velY + GRAVITY;
        let newX = prev.x + prev.velX;
        let newY = prev.y + newVelY;
        let onGround = false;
        let onLadder = false;

        // Colisão com o chão
        if (
          newY + PLAYER_HEIGHT > ground.y &&
          prev.y + PLAYER_HEIGHT <= ground.y &&
          newX + PLAYER_WIDTH > ground.x &&
          newX < ground.x + ground.width
        ) {
          newY = ground.y - PLAYER_HEIGHT;
          newVelY = 0;
          onGround = true;
        }

        platforms.forEach((platform) => {
          // Colisão vertical - descendo
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
          // Colisão vertical - subindo
          if (
            newY < platform.y + platform.height &&
            prev.y >= platform.y + platform.height &&
            newX + PLAYER_WIDTH > platform.x &&
            newX < platform.x + platform.width
          ) {
            newY = platform.y + platform.height;
            newVelY = 0;
          }
          // Colisão horizontal
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

        ladders.forEach((ladder) => {
          // Verificação de entrada na escada
          if (
            newX + PLAYER_WIDTH > ladder.x &&
            newX < ladder.x + ladder.width &&
            newY + PLAYER_HEIGHT > ladder.y &&
            newY < ladder.y + ladder.height
          ) {
            onLadder = true;
            newVelY = prev.velY; // Manter a velocidade vertical ao subir/descer a escada
          }
        });

        // Atualizando a posição da câmera
        let newCameraX = newX - window.innerWidth / 2 + PLAYER_WIDTH / 2;
        if (newCameraX < 0) newCameraX = 0; // Limitar para não mostrar área negativa
        return { ...prev, x: newX, y: newY, velY: newVelY, onGround: onGround, onLadder: onLadder };
      });

      setCameraX((prev) => {
        let newCameraX = player.x - window.innerWidth / 2 + PLAYER_WIDTH / 2;
        if (newCameraX < 0) newCameraX = 0; // Limitar para não mostrar área negativa
        return newCameraX;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [platforms, ladders]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer x={-cameraX}>
        <Ground {...ground} />
        {platforms.map((platform, i) => (
          <Platform key={i} {...platform} />
        ))}
        {ladders.map((ladder, i) => (
          <Ladder key={i} {...ladder} />
        ))}
        <Player x={player.x} y={player.y} />
      </Layer>
    </Stage>
  );
}

export default App;
