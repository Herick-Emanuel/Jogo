import { useEffect } from "react";

const useAttackLogic = (attacks, setAttacks, enemies, setEnemies) => {
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setAttacks((prevAttacks) =>
        prevAttacks.map((attack) => ({
          ...attack,
          x: attack.direction === "right" ? attack.x + 5 : attack.x - 5,
        }))
      );

      setEnemies((prevEnemies) =>
        prevEnemies.filter((enemy) => {
          return !attacks.some((attack) => {
            const distance = Math.sqrt(
              Math.pow(attack.x - enemy.x, 2) + Math.pow(attack.y - enemy.y, 2)
            );
            return distance < 30;
          });
        })
      );

      setAttacks((prevAttacks) =>
        prevAttacks.filter(
          (attack) => attack.x > 0 && attack.x < window.innerWidth
        )
      );
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [attacks, enemies, setAttacks, setEnemies]);
};

export default useAttackLogic;
