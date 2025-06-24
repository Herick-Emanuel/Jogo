import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

const Projectile = ({ x, y, direction }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = "projectile.png";
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={64}
      height={64}
      offsetX={-1}
      offsetY={10}
      scaleX={direction === "left" ? -1 : 1}
    />
  );
};

export default Projectile;
