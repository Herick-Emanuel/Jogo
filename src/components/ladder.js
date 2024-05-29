import React, { useRef, useEffect } from 'react';
import { Rect } from 'react-konva';
import { useImage } from 'react-konva-utils'

const Ladder = ({ x, y, width, height }) => {
  const [image] = useImage('ladder.png');
  const ladderRef = useRef();

  useEffect(() => {
    if (ladderRef.current) {
      ladderRef.current.cache();
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
      ref={ladderRef}
    />
  );
};

export default Ladder;
