import React, { useState, useEffect } from "react";
import { Group, Rect, Image, Text } from "react-konva";
import useImage from "use-image";

const GRID = 5;

const PuzzleCastle = ({ imageSrc, onClose, onSolved }) => {
  const [image] = useImage(imageSrc);
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const SIZE = Math.min(width, height) * 0.9;
  const PIECE_SIZE = SIZE / GRID;
  const offsetX = (width - SIZE) / 2;
  const offsetY = (height - SIZE) / 2;

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < GRID * GRID; i++) arr.push(i);
    setPieces(shuffle([...arr]));
    setSolved(false);
  }, [imageSrc]);

  useEffect(() => {
    if (pieces.length && pieces.every((p, i) => p === i)) {
      setSolved(true);
      if (onSolved) onSolved();
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);
    }
  }, [pieces, onSolved]);

  const handlePieceClick = (idx) => {
    if (solved) return;
    if (selected === null) {
      setSelected(idx);
    } else {
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[idx]] = [newPieces[idx], newPieces[selected]];
      setPieces(newPieces);
      setSelected(null);
    }
  };

  return (
    <Group>
      <Rect x={0} y={0} width={width} height={height} fill="rgba(0,0,0,0.7)" />
      <Rect
        x={offsetX}
        y={offsetY}
        width={SIZE}
        height={SIZE}
        fill="#fffbe6"
        stroke="black"
        strokeWidth={2}
        cornerRadius={20}
        shadowBlur={20}
      />
      {image && pieces.map((piece, idx) => {
        const sx = (piece % GRID) * (image.width / GRID);
        const sy = Math.floor(piece / GRID) * (image.height / GRID);
        const dx = (idx % GRID) * PIECE_SIZE;
        const dy = Math.floor(idx / GRID) * PIECE_SIZE;
        return (
          <Image
            key={idx}
            image={image}
            x={offsetX + dx}
            y={offsetY + dy}
            width={PIECE_SIZE}
            height={PIECE_SIZE}
            crop={{ x: sx, y: sy, width: image.width / GRID, height: image.height / GRID }}
            stroke={selected === idx ? "red" : "black"}
            strokeWidth={selected === idx ? 3 : 1}
            onClick={() => handlePieceClick(idx)}
            onTap={() => handlePieceClick(idx)}
          />
        );
      })}
      {solved && (
        <Text
          x={offsetX}
          y={offsetY + SIZE + 20}
          width={SIZE}
          align="center"
          text="Parabéns! Quebra-cabeça resolvido!"
          fontSize={32}
          fill="green"
        />
      )}
    </Group>
  );
};

export default PuzzleCastle; 