import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

const DISPLAY_WIDTH = 128;
const DISPLAY_HEIGHT = 128;

const PLAYER_WIDTH = 1;
const PLAYER_HEIGHT = 1;

const WARRIOR_FRAME_WIDTH = 132;
const WARRIOR_FRAME_HEIGHT = 210;

const WARRIOR_COLS = 7;
const WARRIOR_ROWS = 2;
const WARRIOR_FRAMES = WARRIOR_COLS * WARRIOR_ROWS;

const WARRIOR_IMAGE = "warrior.png";

const PLAYER_SCALE_FIX = 2.2;

const Player = ({ x, y, isMoving, facing, isBlinking }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [images, setImages] = useState({ player: null, warrior: null });

  useEffect(() => {
    const playerImg = new window.Image();
    const warriorImg = new window.Image();

    playerImg.src = "player.png";
    warriorImg.src = WARRIOR_IMAGE;

    playerImg.onload = () =>
      setImages((prev) => ({ ...prev, player: playerImg }));
    warriorImg.onload = () =>
      setImages((prev) => ({ ...prev, warrior: warriorImg }));
  }, []);

  useEffect(() => {
    if (!isMoving) {
      setFrameIndex(0);
      return;
    }

    if (!images.warrior) return;

    const maxCols = Math.floor(images.warrior.width / WARRIOR_FRAME_WIDTH);
    const maxRows = Math.floor(images.warrior.height / WARRIOR_FRAME_HEIGHT);
    const maxFrames = maxCols * maxRows;

    const timeout = setTimeout(() => {
      setFrameIndex((prev) => (prev + 1) % maxFrames);
    }, 100);

    return () => clearTimeout(timeout);
  }, [isMoving, frameIndex, images.warrior]);

  const isFlipped = facing === "left";
  const image = isMoving ? images.warrior : images.player;

  const col = frameIndex % WARRIOR_COLS;
  const row = Math.floor(frameIndex / WARRIOR_COLS);

  const crop = isMoving
    ? {
        x: col * WARRIOR_FRAME_WIDTH,
        y: row * WARRIOR_FRAME_HEIGHT,
        width: WARRIOR_FRAME_WIDTH,
        height: WARRIOR_FRAME_HEIGHT,
      }
    : undefined;

  const width = isMoving ? WARRIOR_FRAME_WIDTH : PLAYER_WIDTH;
  const height = isMoving ? WARRIOR_FRAME_HEIGHT : PLAYER_HEIGHT;

  const scale = isMoving
    ? Math.min(DISPLAY_WIDTH / width, DISPLAY_HEIGHT / height)
    : Math.min(DISPLAY_WIDTH / width, DISPLAY_HEIGHT / height) * PLAYER_SCALE_FIX;

  const offsetX = width / 2;
  const offsetY = height / 2;

  const scaleX = isFlipped ? -scale : scale;
  const scaleY = scale;

  if (isMoving && images.warrior) {
    const maxCropX = images.warrior.width - WARRIOR_FRAME_WIDTH;
    const maxCropY = images.warrior.height - WARRIOR_FRAME_HEIGHT;
    if (crop.x > maxCropX || crop.y > maxCropY) {
      console.warn("FrameIndex está cortando fora da imagem!", { frameIndex, crop });
    }
  }

  return (
    image && (
      <Image
        image={image}
        x={x}
        y={y}
        width={width}
        height={height}
        crop={crop}
        scale={{ x: scaleX, y: scaleY }}
        offsetX={offsetX}
        offsetY={offsetY}
        opacity={isBlinking ? 0.5 : 1}
        listening={false}
      />
    )
  );
};

export default Player;
