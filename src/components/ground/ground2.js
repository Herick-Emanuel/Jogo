import React, { useRef, useEffect } from "react";
import { Rect } from "react-konva";
import useImage from "use-image";

const Ground2 = ({ x, y, width, height }) => {
  const [image] = useImage("ground2.png");
  const groundRef = useRef();

  useEffect(() => {
    if (groundRef.current) {
      groundRef.current.cache();
    }
  }, [image]);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fillPatternImage={image}
      fillPatternRepeat="repeat"
      ref={groundRef}
    />
  );
};

export default Ground2;
