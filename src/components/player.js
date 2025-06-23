import React, { useRef, useEffect, useState } from "react";
import { Image } from "react-konva";

const Player = ({ x, y, isMoving, facing, isBlinking }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [images, setImages] = useState([null, null]);

  useEffect(() => {
    const loadImages = () => {
      const img1 = new window.Image();
      const img2 = new window.Image();
      img1.src = "player.png";
      img2.src = "warrior.png";

      img1.onload = () => {
        setImages((prevImages) => [img1, prevImages[1]]);
      };

      img2.onload = () => {
        setImages((prevImages) => [prevImages[0], img2]);
      };
    };

    loadImages();
  }, []);

  useEffect(() => {
    let animationInterval;
    if (isMoving) {
      animationInterval = setInterval(() => {
        setFrameIndex((prevFrameIndex) => (prevFrameIndex + 1) % 2);
      }, 150);
    } else {
      setFrameIndex(0);
    }

    return () => clearInterval(animationInterval);
  }, [isMoving]);

  return (
    <Image
      image={images[frameIndex]}
      x={x}
      y={y}
      width={50}
      height={50}
      scaleX={facing === "left" ? -1 : 1}
      offsetX={facing === "left" ? 50 : 0}
      opacity={isBlinking ? 0.5 : 1}
    />
  );
};

export default Player;
