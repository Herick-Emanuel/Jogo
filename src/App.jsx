import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
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
import useCameraMovement from "./hooks/useCameraMovement";
import useEnemyLogic from "./hooks/useEnemyLogic";
import useAttackLogic from "./hooks/useAttackLogic";
import Projectile from "./components/projectile";
import Block1 from "./components/Block1";
import PuzzleCastle from "./components/PuzzleCastle";
import { useImage } from "react-konva-utils";
import Konva from "konva";
import Torch from './components/torch';
import BackgroundImage from "./components/backgroundImage";

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

  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [backgroundCastle, setBackgroundCastle] = useState(false);
  const [castleImage] = useImage("castle.avif");

  const stageRef = useRef(null);
  const castleBgRef = useRef(null);

  useEffect(() => {
    if (backgroundCastle && castleBgRef.current) {
      castleBgRef.current.to({
        opacity: 1,
        duration: 1.5,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [backgroundCastle]);

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
      text: "Bem-vindo ao mundo do caos, bravo guerreiro! Espero que esteja pronto para enfrentar o mundo de aventura que foi preparado para você. Temos diversos desafios que lhe serão propostos! Este é um mundo de aventuras, aonde você foi escolhido para ser nosso guerreiro, espero que não se incomode. Irei lhe esclareçer algumas coisas para arremessar suas espadas, basta pressionar X, para que possa pular, pressione Espaço. Não tenho mais nada para lhe passar, agora você está por conta própria, tenha cuidado em sua jornada, pois ela será realmente desafiadora.",
    },
    {
      x: 2500,
      y: window.innerHeight - 200,
      width: 64,
      height: 50,
      text: "Cuidado com os inimigos! Eles podem te fazer coceguinhas, hahaha, não. Mas falando sério agora, espero que não desista de sua jornada, ela promete ser recompensadora e desafiadora, ou nem tanto quato pensa, mas garanto que irá se diverir",
    },
    {
      x: 2900,
      y: window.innerHeight - 250,
      width: 64,
      height: 50,
      text: "Tesouros aguardam aqueles que são corajosos! Ou a morte, ela também.",
    },
    {
      x: 3230,
      y: window.innerHeight - 200,
      width: 64,
      height: 50,
      text: "Clique Enter para abrir interagir com basicamente tudo, assim como as placas.",
    },
  ];

  const blocks1 = [
    {
      x: 3580,
      y: window.innerHeight - 425,
      width: 64,
      height: 64,
    },
  ];

  const torches = [
    { x: 3500, y: window.innerHeight - 250, width: 64, height: 64 },
    { x: 3650, y: window.innerHeight - 425, width: 64, height: 64 },
  ];

  useKeyControls(
    player,
    setPlayer,
    signs,
    setDialogText,
    setDialogOpen,
    setCurrentSign,
    attacks,
    setAttacks,
    blocks1,
    puzzleOpen ? () => {} : setPuzzleOpen,
    puzzleOpen ? () => {} : setCurrentBlock
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
    setCurrentSign,
    currentBlock,
    setPuzzleOpen,
    setCurrentBlock,
    puzzleOpen
  );
  useCameraMovement(stageRef);
  useEnemyLogic(enemies, setEnemies, player, setPlayer);
  useAttackLogic(attacks, setAttacks, enemies, setEnemies, cameraX);

  return (
    <>
      <BackgroundImage showCastle={backgroundCastle} />

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        x={-cameraX}
        y={-cameraY}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Layer>
          {ground.map((g, i) => <Ground key={i} {...g} />)}
          {ground2.map((g, i) => <Ground2 key={i} {...g} />)}
          {platforms.map((platform, i) => <Platform key={i} {...platform} />)}
          {ladders.map((ladder, i) => <Ladder key={i} {...ladder} />)}
          {signs.map((sign, i) => <Sign key={i} {...sign} />)}
          {enemies.map((enemy, i) => <Enemy key={i} {...enemy} />)}
          {attacks.map((attack, i) => <Projectile key={i} {...attack} />)}
          {blocks1.map((block, i) => <Block1 key={i} {...block} />)}
          {torches.map((torch, i) => <Torch key={i} {...torch} />)}
          <Player x={player.x} y={player.y} isMoving={player.isMoving} facing={player.facing} />
        </Layer>

        {dialogOpen && (
          <Layer>
            <DialogBox x={cameraX} y={cameraY} text={dialogText} onClose={() => setDialogOpen(false)} />
          </Layer>
        )}
      </Stage>

      {puzzleOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
          }}
        >
          <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              <PuzzleCastle
                imageSrc="castle.avif"
                onClose={() => setPuzzleOpen(false)}
                onSolved={() => setBackgroundCastle(true)}
              />
            </Layer>
          </Stage>
        </div>
      )}
    </>
  );
};

export default App;