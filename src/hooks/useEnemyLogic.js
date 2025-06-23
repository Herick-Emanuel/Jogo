import { useEffect, useRef } from "react";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 50;

const useEnemyLogic = (enemies, setEnemies, player, setPlayer, takeDamage) => {
  const lastHitRef = useRef(0);
  const playerRef = useRef(player);
  const enemiesRef = useRef(enemies);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const player = playerRef.current;

      enemiesRef.current.forEach((enemy) => {
        const playerLeft = player.x;
        const playerRight = player.x + PLAYER_WIDTH;
        const playerTop = player.y;
        const playerBottom = player.y + PLAYER_HEIGHT;

        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + ENEMY_WIDTH;
        const enemyTop = enemy.y;
        const enemyBottom = enemy.y + ENEMY_HEIGHT;

        const isColliding =
          playerLeft < enemyRight &&
          playerRight > enemyLeft &&
          playerTop < enemyBottom &&
          playerBottom > enemyTop;

        if (
          isColliding &&
          now - lastHitRef.current > 1000 &&
          !player.isBlinking
        ) {
          lastHitRef.current = now;
          takeDamage(0.5);
        }
      });

      requestAnimationFrame(update);
    };

    const frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, []);
};

export default useEnemyLogic;
