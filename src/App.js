import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Player from "./components/player";
import Platform from "./components/platform";
import Ground from "./components/ground/ground";
import Ground2 from "./components/ground/ground2";
import Ladder from "./components/ladder";
import Sign from "./components/sign";
import DialogBox from "./components/dialogbox";

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
    facing: "right",
    isMoving: false,  
  });

  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentSign, setCurrentSign] = useState(null);

  const stageRef = useRef(null);

  const ground = [
    { x: 0, y: window.innerHeight - 40, width: 2000, height: 64 },
    { x: 3900, y: window.innerHeight - 40, width: 450, height: 64 },
    { x: 3600, y: window.innerHeight - 40, width: 150, height: 64 },
  ];

  const ground2 = [
    { x: 0, y: window.innerHeight - -15, width: 2000, height: 128 },
    { x: 3900, y: window.innerHeight - -15, width: 450, height: 128 },
    { x: 3600, y: window.innerHeight - -15, width: 150, height: 128 },
  ];

  const platforms = [
    { x: 2080, y: window.innerHeight - 90, width: 200, height: 50 },
    { x: 2400, y: window.innerHeight - 150, width: 300, height: 50 },
    { x: 2850, y: window.innerHeight - 200, width: 150, height: 50 },
    { x: 3150, y: window.innerHeight - 150, width: 300, height: 50 },
    { x: 3200, y: window.innerHeight - 300, width: 100, height: 50 },
    { x: 3400, y: window.innerHeight - 350, width: 250, height: 50 },
    { x: 3550, y: window.innerHeight - 500, width: 200, height: 50 },
    { x: 3450, y: window.innerHeight - 100, width: 150, height: 50 },
    { x: 3900, y: window.innerHeight - 550, width: 150, height: 50 },
    { x: 4200, y: window.innerHeight - 200, width: 300, height: 50 },
    { x: 4650, y: window.innerHeight - 250, width: 200, height: 50 },
    { x: 4810, y: window.innerHeight - 600, width: 100, height: 50 },
    { x: 5000, y: window.innerHeight - 650, width: 350, height: 50 },
    { x: 5350, y: window.innerHeight - 700, width: 150, height: 50 },
    { x: 5450, y: window.innerHeight - 950, width: 150, height: 50 },
  ];

  const ladders = [
    { x: 3300, y: window.innerHeight - 300, width: 64, height: 150 },
    { x: 3500, y: window.innerHeight - 500, width: 64, height: 150 },
    { x: 4750, y: window.innerHeight - 600, width: 64, height: 350 },
    { x: 5400, y: window.innerHeight - 950, width: 64, height: 250 },
  ];

  const signs = [
    {
      x: 1900,
      y: window.innerHeight - 90,
      width: 64,
      height: 50,
      text: "Bem-vindo ao mundo do caos bravo guerreiro! Espero que esteja pronto para enfrentar o mundo de aventura que foi preparado para você",
    },
    {
      x: 2500,
      y: window.innerHeight - 200,
      width: 64,
      height: 50,
      text: "Cuidado com os inimigos! Eles podem te fazer coceguinhas",
    },
    {
      x: 2900,
      y: window.innerHeight - 250,
      width: 64,
      height: 50,
      text: "Tesouros aguardam aqueles que são corajosos! Ou a morte, ela também.",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setPlayer((prev) => ({
          ...prev,
          velX: -PLAYER_SPEED,
          facing: "left",
          isMoving: true,
        }));
      } else if (e.key === "ArrowRight") {
        setPlayer((prev) => ({
          ...prev,
          velX: PLAYER_SPEED,
          facing: "right",
          isMoving: true,
        }));
      } else if (e.key === " " && player.onGround && !player.onLadder) {
        setPlayer((prev) => ({ ...prev, velY: JUMP_POWER, onGround: false }));
      } else if (e.key === "ArrowUp" && player.onLadder) {
        setPlayer((prev) => ({ ...prev, velY: -PLAYER_SPEED }));
      } else if (e.key === "ArrowDown" && player.onLadder) {
        setPlayer((prev) => ({ ...prev, velY: PLAYER_SPEED }));
      } else if (e.key === "Enter") {
        console.log("Enter key pressed");
        signs.forEach((sign) => {
          console.log(`Checking sign at (${sign.x}, ${sign.y})`);
          if (
            player.x + PLAYER_WIDTH > sign.x &&
            player.x < sign.x + sign.width &&
            player.y + PLAYER_HEIGHT > sign.y &&
            player.y < sign.y + sign.height
          ) {
            console.log("Sign detected:", sign.text);
            setDialogText(sign.text);
            setDialogOpen(true);
            setCurrentSign(sign);
          }
        });
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setPlayer((prev) => ({ ...prev, velX: 0, isMoving: false }));
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        setPlayer((prev) => ({ ...prev, velY: 0 }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player.onGround, player.onLadder, player.x, player.y, signs, dialogOpen]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayer((prev) => {
        let newVelY = prev.onLadder ? prev.velY : prev.velY + GRAVITY;
        let newX = prev.x + prev.velX;
        let newY = prev.y + newVelY;
        let onGround = false;
        let onLadder = false;

        // Função para verificar colisões com o chão
        const checkGroundCollision = () => {
          ground.forEach((g) => {
            if (
              newY + PLAYER_HEIGHT > g.y &&
              prev.y + PLAYER_HEIGHT <= g.y &&
              newX + PLAYER_WIDTH > g.x &&
              newX < g.x + g.width
            ) {
              newY = g.y - PLAYER_HEIGHT;
              newVelY = 0;
              onGround = true;
            }
          });
        };

        // Função para verificar colisões com plataformas
        const checkPlatformCollision = () => {
          platforms.forEach((platform) => {
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
            if (
              newY < platform.y + platform.height &&
              prev.y >= platform.y + platform.height &&
              newX + PLAYER_WIDTH > platform.x &&
              newX < platform.x + platform.width
            ) {
              newY = platform.y + platform.height;
              newVelY = 0;
            }
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
        };

        // Função para verificar colisões com escadas
        const checkLadderCollision = () => {
          ladders.forEach((ladder) => {
            if (
              newX + PLAYER_WIDTH > ladder.x &&
              newX < ladder.x + ladder.width &&
              newY + PLAYER_HEIGHT > ladder.y &&
              newY < ladder.y + ladder.height
            ) {
              onLadder = true;
              newVelY = prev.velY;
            }
          });
        };

        // Função para verificar se o personagem está fora do sinal
        const checkSignCollision = () => {
          if (currentSign) {
            if (
              newX + PLAYER_WIDTH < currentSign.x ||
              newX > currentSign.x + currentSign.width ||
              newY + PLAYER_HEIGHT < currentSign.y ||
              newY > currentSign.y + currentSign.height
            ) {
              setDialogOpen(false);
              setCurrentSign(null);
            }
          }
        };

        checkGroundCollision();
        checkPlatformCollision();
        checkLadderCollision();
        checkSignCollision();

        let newCameraX = newX - window.innerWidth / 2 + PLAYER_WIDTH / 2;
        if (newCameraX < 0) newCameraX = 0;
        let newCameraY = newY - window.innerHeight / 2 + PLAYER_HEIGHT / 2;
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
    }, 16);

    return () => clearInterval(gameLoop);
  }, [player.x, player.y, platforms, ladders, currentSign]);

  const handleZoom = (e) => {
    e.evt.preventDefault();
    const zoomFactor = e.evt.deltaY > 0 ? 0.9 : 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = oldScale * zoomFactor;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  useEffect(() => {
    const stage = stageRef.current;
    stage.on("wheel", handleZoom);
    return () => {
      stage.off("wheel", handleZoom);
    };
  }, []);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      scaleX={1}
      scaleY={1}
      draggable
      x={-cameraX}
      y={-cameraY}
    >
      <Layer>
        {ground.map((g, i) => (
          <Ground key={i} {...g} />
        ))}
        {ground2.map((g, i) => (
          <Ground2 key={i} {...g} />
        ))}
        {platforms.map((platform, i) => (
          <Platform key={i} {...platform} />
        ))}
        {ladders.map((ladder, i) => (
          <Ladder key={i} {...ladder} />
        ))}
        {signs.map((sign, i) => (
          <Sign key={i} {...sign} />
        ))}
      <Player x={player.x} y={player.y} isMoving={player.isMoving} />
      </Layer>
      {dialogOpen && (
        <Layer>
          <DialogBox
            x={cameraX}
            y={cameraY}
            text={dialogText}
            onClose={() => setDialogOpen(false)}
          />
        </Layer>
      )}
    </Stage>
  );
}

export default App;
