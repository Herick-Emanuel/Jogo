import React, { useState, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Player from "./components/player";
import Platform from "./components/platform";
import Ground from "./components/ground/ground";
import Ground2 from "./components/ground/ground2";
import Ladder from "./components/ladder";
import Sign from "./components/sign";
import DialogBox from "./components/dialogbox";
import Enemy from "./components/enemy";
import useKeyControls from "./hooks/useKeyControls";
import useGameLoop from "./hooks/useGameLoop";
import useZoom from "./hooks/useZoom";
import useEnemyLogic from "./hooks/useEnemyLogic";
import useAttackLogic from "./hooks/useAttackLogic";
import Projectile from "./components/projectile";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

const App = () => {
  const [player, setPlayer] = useState({
    x: 50,
    y: window.innerHeight - PLAYER_HEIGHT - 41,
    velX: 0,
    velY: 0,
    onGround: true,
    onLadder: false,
    facing: "right",
    isMoving: false,
    health: 100,
  });

  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentSign, setCurrentSign] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const [enemies, setEnemies] = useState([
    {
      x: 2080,
      y: window.innerHeight - 140,
      velX: 1,
      velY: 0,
      width: 50,
      height: 50,
    },
    {
      x: 2570,
      y: window.innerHeight - 200,
      velX: -1,
      velY: 0,
      width: 50,
      height: 50,
    },
    {
      x: 3200,
      y: window.innerHeight - 350,
      velX: 1,
      velY: 0,
      width: 50,
      height: 50,
    },
    {
      x: 4650,
      y: window.innerHeight - 300,
      velX: -1,
      velY: 0,
      width: 50,
      height: 50,
    },
  ]);

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
      text: "Bem-vindo ao mundo do caos, bravo guerreiro! Espero que esteja pronto para enfrentar o mundo de aventura que foi preparado para você. e claro para ATIRAR ESPADAS, basta pressionar X",
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

  useKeyControls(
    player,
    setPlayer,
    signs,
    setDialogText,
    setDialogOpen,
    setCurrentSign,
    setAttacks
  );
  useGameLoop(
    player,
    setPlayer,
    ground,
    platforms,
    ladders,
    setCameraX,
    setCameraY,
    currentSign,
    setDialogOpen,
    setCurrentSign
  );
  useZoom(stageRef);
  useEnemyLogic(enemies, setEnemies, player, setPlayer);
  useAttackLogic(attacks, setAttacks, enemies, setEnemies);

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
        {enemies.map((enemy, i) => (
          <Enemy key={i} {...enemy} />
        ))}
        {attacks.map((attack, i) => (
          <Projectile key={i} {...attack} />
        ))}
        <Player
          x={player.x}
          y={player.y}
          isMoving={player.isMoving}
          facing={player.facing}
        />
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
};

export default App;
