import { useEffect, useRef } from "react";

const useAttackLogic = (attacks, setAttacks, enemies, setEnemies, cameraX) => {
  const PROJECTILE_SPEED = 5.8; 
  const animationFrameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const update = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const normalizedDelta = Math.min(deltaTime, 32) / 16.67;

      setAttacks((prevAttacks) =>
        prevAttacks.map((attack) => ({
          ...attack,
          x: attack.direction === "right" 
            ? attack.x + PROJECTILE_SPEED * normalizedDelta 
            : attack.x - PROJECTILE_SPEED * normalizedDelta,
        }))
      );

      setEnemies((prevEnemies) =>
        prevEnemies.filter((enemy) => {
          const enemyWidth = 50;
          const enemyHeight = 50;
          
          return !attacks.some((attack) => {
            const projectileWidth = 30;
            const projectileHeight = 30;
            
            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + enemyWidth;
            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + enemyHeight;
            
            const projectileLeft = attack.x;
            const projectileRight = attack.x + projectileWidth;
            const projectileTop = attack.y;
            const projectileBottom = attack.y + projectileHeight;
            
            const collision = !(
              projectileLeft > enemyRight ||
              projectileRight < enemyLeft ||
              projectileTop > enemyBottom ||
              projectileBottom < enemyTop
            );
            
            return collision;
          });
        })
      );

      setAttacks((prevAttacks) =>
        prevAttacks.filter(
          (attack) =>
            attack.x > cameraX - 50 &&
            attack.x < cameraX + window.innerWidth + 50
        )
      );

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [attacks, enemies, setAttacks, setEnemies, cameraX]);
};

export default useAttackLogic;
