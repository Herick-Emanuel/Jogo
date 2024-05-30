import { useEffect } from 'react';

const useGameLoop = (player, setPlayer, ground, platforms, ladders, setCameraX, setCameraY, currentSign, setDialogOpen, setCurrentSign) => {
  useEffect(() => {
    const update = () => {
      setPlayer((prev) => {
        let newVelY = prev.onLadder ? prev.velY : prev.velY + 0.5;
        let newX = prev.x + prev.velX;
        let newY = prev.y + newVelY;
        let onGround = false;
        let onLadder = false;

        const checkGroundCollision = () => {
          ground.forEach((g) => {
            if (newY + 50 > g.y && prev.y + 50 <= g.y && newX + 50 > g.x && newX < g.x + g.width) {
              newY = g.y - 50;
              newVelY = 0;
              onGround = true;
            }
          });
        };

        const checkPlatformCollision = () => {
          platforms.forEach((platform) => {
            if (newY + 50 > platform.y && prev.y + 50 <= platform.y && newX + 50 > platform.x && newX < platform.x + platform.width) {
              newY = platform.y - 50;
              newVelY = 0;
              onGround = true;
            }
            if (newY < platform.y + platform.height && prev.y >= platform.y + platform.height && newX + 50 > platform.x && newX < platform.x + platform.width) {
              newY = platform.y + platform.height;
              newVelY = 0;
            }
            if (newX + 50 > platform.x && newX < platform.x + platform.width && newY + 50 > platform.y && newY < platform.y + platform.height) {
              if (prev.velX > 0) {
                newX = platform.x - 50;
              } else if (prev.velX < 0) {
                newX = platform.x + platform.width;
              }
            }
          });
        };

        const checkLadderCollision = () => {
          ladders.forEach((ladder) => {
            if (newX + 50 > ladder.x && newX < ladder.x + ladder.width && newY + 50 > ladder.y && newY < ladder.y + ladder.height) {
              onLadder = true;
              newVelY = prev.velY;
            }
          });
        };

        const checkSignCollision = () => {
          if (currentSign) {
            if (newX + 50 < currentSign.x || newX > currentSign.x + currentSign.width || newY + 50 < currentSign.y || newY > currentSign.y + currentSign.height) {
              setDialogOpen(false);
              setCurrentSign(null);
            }
          }
        };

        checkGroundCollision();
        checkPlatformCollision();
        checkLadderCollision();
        checkSignCollision();

        let newCameraX = newX - window.innerWidth / 2 + 25;
        if (newCameraX < 0) newCameraX = 0;
        let newCameraY = newY - window.innerHeight / 2 + 25;
        if (newCameraY < 0) newCameraY = 0;

        setCameraX(newCameraX);
        setCameraY(newCameraY);

        return {
          ...prev,
          x: newX,
          y: newY,
          velY: newVelY,
          onGround: onGround,
          onLadder: onLadder,
        };
      });
    };

    const gameLoop = setInterval(update, 16);

    return () => clearInterval(gameLoop);
  }, [player, setPlayer, ground, platforms, ladders, setCameraX, setCameraY, currentSign, setDialogOpen, setCurrentSign]);
};

export default useGameLoop;
