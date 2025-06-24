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
import useEnemyLogic from "./hooks/useEnemyLogic";
import useAttackLogic from "./hooks/useAttackLogic";
import Projectile from "./components/projectile";
import Block1 from "./components/Block1";
import PuzzleCastle from "./components/PuzzleCastle";
import { useImage } from "react-konva-utils";
import Konva from "konva";
import Torch from './components/torch';
import BackgroundImage from "./components/backgroundImage";
import Health from "./components/Health";
import GameOverScreen from "./components/GameOverScreen";
import HeartCollectable from "./components/HeartCollectable";
import { levels } from "./levelData";
import Guardian from "./components/guardian";
import GuardianDialogBox from "./components/GuardianDialogBox";

const App = () => {
  const savedLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
  const [level, setLevel] = useState(savedLevel);
  const [levelData, setLevelData] = useState(levels[level]);

  const [player, setPlayer] = useState({
    x: levelData.playerStart.x,
    y: levelData.playerStart.y,
    velX: 0,
    velY: 0,
    onGround: true,
    onLadder: false,
    facing: "right",
    isMoving: false,
    health: 5,
    fallStartY: 0,
    isBlinking: false,
  });

  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentSign, setCurrentSign] = useState(null);
  const [isGuardianDialog, setIsGuardianDialog] = useState(false);
  const [attacks, setAttacks] = useState([]);
  const [enemies, setEnemies] = useState(levelData.enemies);

  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [backgroundCastle, setBackgroundCastle] = useState(false);
  const [castleImage] = useImage("castle.avif");

  const stageRef = useRef(null);
  const castleBgRef = useRef(null);

  const [gameOver, setGameOver] = useState(false);

  const [heartCollectables, setHeartCollectables] = useState(levelData.heartCollectables);

  const loadLevel = (levelNumber) => {
    localStorage.setItem('currentLevel', levelNumber);
    const newLevelData = levels[levelNumber];
    setLevel(levelNumber);
    setLevelData(newLevelData);

    setPlayer((prev) => ({
      ...prev,
      x: newLevelData.playerStart.x,
      y: newLevelData.playerStart.y,
      velX: 0,
      velY: 0,
      onGround: true,
      onLadder: false,
    }));
    setEnemies(newLevelData.enemies);
    setHeartCollectables(newLevelData.heartCollectables);
    setAttacks([]);
    setCameraX(0);
    setCameraY(0);
    setPuzzleOpen(false);
  };

  const handlePuzzleSolved = () => {
    setBackgroundCastle(true);
    setTimeout(() => {
      loadLevel(2);
      setBackgroundCastle(false);
    }, 2000);
  };

  useEffect(() => {
    if (backgroundCastle && castleBgRef.current) {
      castleBgRef.current.to({
        opacity: 1,
        duration: 1.5,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [backgroundCastle]);

  useEffect(() => {
    if (player.health <= 0 && !gameOver) {
      setGameOver(true);
    }
  }, [player.health, gameOver]);

  useEffect(() => {
    if (player.isBlinking) {
      const timeout = setTimeout(() => {
        setPlayer((prev) => ({ ...prev, isBlinking: false }));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [player.isBlinking]);

  useEffect(() => {
    setHeartCollectables((prevHearts) => {
      return prevHearts.filter((heart) => {
        const playerLeft = player.x;
        const playerRight = player.x + 50;
        const playerTop = player.y;
        const playerBottom = player.y + 50;
        const heartLeft = heart.x;
        const heartRight = heart.x + 30;
        const heartTop = heart.y;
        const heartBottom = heart.y + 30;
        const isColliding =
          playerLeft < heartRight &&
          playerRight > heartLeft &&
          playerTop < heartBottom &&
          playerBottom > heartTop;
        if (isColliding && player.health < 5) {
          setPlayer((prev) => ({
            ...prev,
            health: Math.min(prev.health + 1, 5),
          }));
          return false;
        }
        return true;
      });
    });
  }, [player.x, player.y]);

  const {
    ground,
    ground2,
    platforms,
    ladders,
    signs,
    blocks1,
    torches,
    guardian,
  } = levelData;

  const takeDamage = (amount) => {
    setPlayer((prev) => {
      if (prev.isBlinking || prev.health <= 0) return prev;
      return {
        ...prev,
        health: Math.max(prev.health - amount, 0),
        isBlinking: true,
      };
    });
  };

  useKeyControls(
    player,
    setPlayer,
    signs,
    setDialogText,
    setDialogOpen,
    setCurrentSign,
    setIsGuardianDialog,
    attacks,
    setAttacks,
    blocks1,
    puzzleOpen ? () => {} : setPuzzleOpen,
    puzzleOpen ? () => {} : setCurrentBlock,
    guardian
  );
  useGameLoop(
    player,
    setPlayer,
    levelData.ground,
    levelData.platforms,
    levelData.ladders,
    setCameraX,
    setCameraY,
    currentSign,
    setDialogOpen,
    setCurrentSign,
    currentBlock,
    setPuzzleOpen,
    setCurrentBlock,
    puzzleOpen,
    takeDamage,
    guardian,
    isGuardianDialog,
    setIsGuardianDialog
  );

  const handlePlay = () => {
    loadLevel(level);
    setPlayer((prev) => ({
      ...prev,
      health: 5,
      isBlinking: false,
    }));
    setGameOver(false);
  };

  const handleExit = () => {
    window.close();
  };

  return (
    <>
      <BackgroundImage showCastle={level >= 2} />

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
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
          {enemies.map((enemy, i) => <Enemy key={i} {...enemy} playerX={player.x} />)}
          {attacks.map((attack, i) => <Projectile key={i} {...attack} />)}
          {blocks1.map((block, i) => <Block1 key={i} {...block} />)}
          {torches.map((torch, i) => <Torch key={i} {...torch} />)}
          {heartCollectables.map((heart) => (
            <HeartCollectable key={heart.id} x={heart.x} y={heart.y} />
          ))}
          {guardian && <Guardian {...guardian} />}
          <Player x={player.x} y={player.y} isMoving={player.isMoving} facing={player.facing} isBlinking={player.isBlinking} />
        </Layer>

        {dialogOpen && (
          <Layer>
            {isGuardianDialog ? (
              <GuardianDialogBox
                x={cameraX}
                y={cameraY}
                text={dialogText}
                onClose={() => {
                  setDialogOpen(false);
                  setIsGuardianDialog(false);
                }}
              />
            ) : (
              <DialogBox
                x={cameraX}
                y={cameraY}
                text={dialogText}
                onClose={() => setDialogOpen(false)}
              />
            )}
          </Layer>
        )}
      </Stage>

      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000
      }}>
        <Stage width={5 * 35} height={30} style={{background: 'transparent'}}>
          <Layer>
            <Health health={player.health} x={0} y={0} />
          </Layer>
        </Stage>
      </div>

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
                onSolved={handlePuzzleSolved}
              />
            </Layer>
          </Stage>
        </div>
      )}

      {gameOver && (
        <GameOverScreen onPlay={handlePlay} onExit={handleExit} />
      )}
    </>
  );
};

export default App;