import React, { useRef, useEffect } from "react";
import { Image } from "react-konva";
import { useImage } from "react-konva-utils";

const Sign = ({ x, y, width, height, text }) => {
  const [image] = useImage("placa.png");
  const signRef = useRef();

  useEffect(() => {
    if (signRef.current) {
      signRef.current.cache();
    }
  }, [image]);

  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      ref={signRef}
    />
  );
};

export default Sign;
