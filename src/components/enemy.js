import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

const Enemy = ({ x, y }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = "enemy.png";
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return <Image image={image} x={x} y={y} width={50} height={50} />;
};

export default Enemy;
