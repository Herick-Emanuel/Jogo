import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const HeartCollectable = ({ x, y }) => {
  const [heartImage] = useImage('/heart.png');
  return (
    <Image
      image={heartImage}
      x={x}
      y={y}
      width={30}
      height={30}
    />
  );
};

export default HeartCollectable; 