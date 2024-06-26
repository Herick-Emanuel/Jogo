import React, { useRef, useEffect } from 'react';
import { Rect } from 'react-konva';
import { useImage } from 'react-konva-utils'

const Platform = ({ x, y, width, height }) => {
  const [image] = useImage('platform.png');
  const platformRef = useRef();

  useEffect(() => {
    if (platformRef.current) {
      platformRef.current.cache();
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
      ref={platformRef}
    />
  );
};

export default Platform;