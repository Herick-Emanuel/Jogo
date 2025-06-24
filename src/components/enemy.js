import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

const Enemy = ({ x, y, playerX }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = "enemy.png";
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const facingLeft = playerX < x;

  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={64}
      height={64}
      scaleX={facingLeft ? -1 : 1}
      offsetX={facingLeft ? 50 : 0}
    />
  );
};

export default Enemy;
