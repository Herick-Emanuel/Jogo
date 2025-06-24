import { useEffect, useRef } from "react";

const useKeyControls = (
  player,
  setPlayer,
  signs,
  setDialogText,
  setDialogOpen,
  setCurrentSign,
  setIsGuardianDialog,
  attacks,
  setAttacks,
  blocks1 = [],
  setPuzzleOpen = () => {},
  setCurrentBlock = () => {},
  guardian
) => {
  const maxVelocity = 4.7;
  const jumpVelocity = -8.5;
  const pressedKeys = useRef(new Set());
  const playerRef = useRef(player);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const handleJump = () => {
    const currentPlayer = playerRef.current;
    if (currentPlayer.onGround && !currentPlayer.onLadder) {
      setPlayer((prev) => ({ ...prev, velY: jumpVelocity, onGround: false }));
    }
  };

  const updateMovement = () => {
    setPlayer((prev) => {
      let newVelX = 0;
      let newFacing = prev.facing;
      let isMoving = false;

      if (pressedKeys.current.has("ArrowLeft") || pressedKeys.current.has("a") || pressedKeys.current.has("A")) {
        newVelX = -maxVelocity;
        newFacing = "left";
        isMoving = true;
      } else if (pressedKeys.current.has("ArrowRight") || pressedKeys.current.has("d") || pressedKeys.current.has("D")) {
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
    const interactingWithGuardian = () => {
      if (!guardian) return false;
      const playerRect = { x: player.x, y: player.y, width: 50, height: 50 };
      const guardianRect = { x: guardian.x, y: guardian.y, width: guardian.width, height: guardian.height };
      return (
        playerRect.x < guardianRect.x + guardianRect.width &&
        playerRect.x + playerRect.width > guardianRect.x &&
        playerRect.y < guardianRect.y + guardianRect.height &&
        playerRect.y + playerRect.height > guardianRect.y
      );
    };

    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
      case "ArrowRight":
      case "d":
      case "D":
        pressedKeys.current.add(e.key);
        updateMovement();
        break;
      case " ":
      case "w":
      case "W":
        handleJump();
        break;
      case "ArrowUp":
      case "w":
      case "W":
        handleLadderMovement("up");
        break;
      case "ArrowDown":
      case "s":
      case "S":
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

    if (e.key === "Enter") {
      if (interactingWithGuardian()) {
        setDialogText(guardian.text);
        setIsGuardianDialog(true);
        setDialogOpen(true);
        return; 
      }

      if (setCurrentSign) {
        setDialogOpen(false);
        setCurrentSign(null);
        setIsGuardianDialog(false);
      }

      let blockInRange = null;
      for (const block of blocks1) {
        const distance = Math.sqrt(
          Math.pow(player.x - block.x, 2) + Math.pow(player.y - block.y, 2)
        );
        if (distance < 50) {
          blockInRange = block;
          break;
        }
      }

      if (blockInRange) {
        setPuzzleOpen(true);
        setCurrentBlock(blockInRange);
      }
    }
  };

  const handleKeyUp = (e) => {
    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
      case "ArrowRight":
      case "d":
      case "D":
        pressedKeys.current.delete(e.key);
        updateMovement();
        break;
      case " ":
      case "w":
      case "W":
      case "ArrowUp":
      case "ArrowDown":
      case "s":
      case "S":
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
