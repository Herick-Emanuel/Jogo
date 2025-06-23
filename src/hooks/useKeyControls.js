import { useEffect, useRef } from "react";

const useKeyControls = (
  player,
  setPlayer,
  signs,
  setDialogText,
  setDialogOpen,
  setCurrentSign,
  attacks,
  setAttacks,
  blocks1 = [],
  setPuzzleOpen = () => {},
  setCurrentBlock = () => {}
) => {
  const maxVelocity = 4.7;
  const jumpVelocity = -8.5;
  const pressedKeys = useRef(new Set());

  const handleJump = () => {
    if (player.onGround && !player.onLadder) {
      setPlayer((prev) => ({ ...prev, velY: jumpVelocity, onGround: false }));
    }
  };

  const updateMovement = () => {
    setPlayer((prev) => {
      let newVelX = 0;
      let newFacing = prev.facing;
      let isMoving = false;

      if (pressedKeys.current.has("ArrowLeft")) {
        newVelX = -maxVelocity;
        newFacing = "left";
        isMoving = true;
      } else if (pressedKeys.current.has("ArrowRight")) {
        newVelX = maxVelocity;
        newFacing = "right";
        isMoving = true;
      }

      return {
        ...prev,
        velX: newVelX,
        facing: newFacing,
        isMoving: isMoving,
      };
    });
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
    if (attacks.length >= 3) {
      return; 
    }
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
      case "ArrowRight":
        pressedKeys.current.add(e.key);
        updateMovement();
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
        pressedKeys.current.delete(e.key);
        updateMovement();
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
  }, [player, setPlayer, signs, setDialogText, setDialogOpen, setCurrentSign, attacks, setAttacks]);
};

export default useKeyControls;
