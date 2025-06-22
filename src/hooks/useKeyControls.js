import { useEffect } from "react";

const useKeyControls = (
  player,
  setPlayer,
  signs,
  setDialogText,
  setDialogOpen,
  setCurrentSign,
  setAttacks,
  blocks1 = [],
  setPuzzleOpen = () => {},
  setCurrentBlock = () => {}
) => {
  const acceleration = 5;
  const maxVelocity = 7;
  const jumpVelocity = -9;

  const handleJump = () => {
    if (player.onGround && !player.onLadder) {
      setPlayer((prev) => ({ ...prev, velY: jumpVelocity, onGround: false }));
    }
  };

  const handleMovement = (direction) => {
    if (direction === "left") {
      setPlayer((prev) => ({
        ...prev,
        velX: Math.max(-maxVelocity, prev.velX - acceleration),
        facing: "left",
      }));
    } else if (direction === "right") {
      setPlayer((prev) => ({
        ...prev,
        velX: Math.min(maxVelocity, prev.velX + acceleration),
        facing: "right",
      }));
    }
  };

  const handleLadderMovement = (direction) => {
    if (player.onLadder) {
      setPlayer((prev) => ({ ...prev, velY: direction === "up" ? -5 : 5 }));
    }
  };

  const handleDialogInteraction = () => {
    signs.forEach((sign) => {
      const distance = Math.sqrt(
        Math.pow(player.x - sign.x, 2) + Math.pow(player.y - sign.y, 2)
      );
      if (distance < 50) {
        setDialogText(sign.text);
        setDialogOpen(true);
        setCurrentSign(sign);
      }
    });
  };

  const handleBlock1Interaction = () => {
    blocks1.forEach((block) => {
      const distance = Math.sqrt(
        Math.pow(player.x - block.x, 2) + Math.pow(player.y - block.y, 2)
      );
      if (distance < 50) {
        setPuzzleOpen(true);
        setCurrentBlock(block);
      }
    });
  };

  const handleAttack = () => {
    const attack = {
      x: player.x + (player.facing === "right" ? 50 : -50),
      y: player.y,
      direction: player.facing,
    };
    setAttacks((prev) => [...prev, attack]);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        handleMovement("left");
        setPlayer((prev) => ({ ...prev, isMoving: true }));
        break;
      case "ArrowRight":
        handleMovement("right");
        setPlayer((prev) => ({ ...prev, isMoving: true }));
        break;
      case " ":
        handleJump();
        break;
      case "ArrowUp":
        handleLadderMovement("up");
        break;
      case "ArrowDown":
        handleLadderMovement("down");
        break;
      case "Enter":
        handleDialogInteraction();
        handleBlock1Interaction();
        break;
      case "x":
        handleAttack();
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (e) => {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowRight":
        setPlayer((prev) => ({ ...prev, velX: 0, isMoving: false }));
        break;
      case " ":
      case "ArrowUp":
      case "ArrowDown":
        break;
      case "Enter":
        handleDialogInteraction();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player, setPlayer, signs, setDialogText, setDialogOpen, setCurrentSign]);
};

export default useKeyControls;
