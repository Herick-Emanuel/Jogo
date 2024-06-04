import { useEffect } from "react";

const useEnemyLogic = (enemies, setEnemies, player, setPlayer) => {
  useEffect(() => {
    const gameLoop = setInterval(() => {
      enemies.forEach((enemy, index) => {
        const distance = Math.sqrt(
          Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
        );
        if (distance < 50) {
          setPlayer((prev) => ({ ...prev, health: prev.health - 1 }));
          if (player.health <= 0) {
            console.log("Game Over");
            clearInterval(gameLoop);
          }
        }
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [enemies, player, setPlayer]);
};

export default useEnemyLogic;
