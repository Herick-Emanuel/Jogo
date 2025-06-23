import { useEffect, useRef } from 'react';

const useGameLoop = (player, setPlayer, ground, platforms, ladders, setCameraX, setCameraY, currentSign, setDialogOpen, setCurrentSign, currentBlock, setPuzzleOpen, setCurrentBlock, puzzleOpen, takeDamage, guardian, isGuardianDialog, setIsGuardianDialog) => {
  const animationFrameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const update = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const normalizedDelta = Math.min(deltaTime, 32) / 16.67;

      setPlayer((prev) => {
        let newVelY = prev.onLadder ? prev.velY : prev.velY + 0.5 * normalizedDelta;
        let newX = prev.x + prev.velX * normalizedDelta;
        let newY = prev.y + newVelY * normalizedDelta;
        let onGround = false;
        let onLadder = false;
        let newFallStartY = prev.fallStartY;

        if (!prev.onGround && !prev.onLadder && newFallStartY === 0) {
          newFallStartY = prev.y;
        }

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
            const distance = Math.sqrt(
              Math.pow(newX - currentSign.x, 2) +
                Math.pow(newY - currentSign.y, 2)
            );
            if (distance > 100) {
              setDialogOpen(false);
              setCurrentSign(null);
            }
          }
        };

        const checkBlockCollision = () => {
          if (currentBlock && puzzleOpen) {
            const distance = Math.sqrt(
              Math.pow(newX - currentBlock.x, 2) +
                Math.pow(newY - currentBlock.y, 2)
            );
            if (distance > 100) {
              setPuzzleOpen(false);
              setCurrentBlock(null);
            }
          }
        };

        if (isGuardianDialog && guardian) {
          const distance = Math.sqrt(
            Math.pow(newX - guardian.x, 2) +
              Math.pow(newY - guardian.y, 2)
          );
          if (distance > 200) {
            setDialogOpen(false);
            setIsGuardianDialog(false);
          }
        }

        checkGroundCollision();
        checkPlatformCollision();
        checkLadderCollision();
        checkSignCollision();
        checkBlockCollision();

        if (onGround && newFallStartY !== 0) {
          const fallDistance = newY - newFallStartY;
          if (fallDistance > 500) {
            takeDamage(1);
          } else if (fallDistance > 250) {
            takeDamage(0.5);
          }
          newFallStartY = 0;
        }

        if (newY > window.innerHeight + 500) {
          takeDamage(0.5);
          newX = 50;
          newY = window.innerHeight - 91; 
          newVelY = 0;
        }

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
          fallStartY: newFallStartY,
        };
      });

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    player,
    setPlayer,
    ground,
    platforms,
    ladders,
    setCameraX,
    setCameraY,
    currentSign,
    setDialogOpen,
    setCurrentSign,
    currentBlock,
    setPuzzleOpen,
    setCurrentBlock,
    puzzleOpen,
    takeDamage,
    guardian,
    isGuardianDialog,
    setIsGuardianDialog
  ]);
};

export default useGameLoop;
