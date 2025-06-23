import React from 'react';
import { Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

const Guardian = ({ x, y, width, height }) => {
  const [image] = useImage('GuardianOfCastle.png'); 
  
  return (
    <Image 
      image={image} 
      x={x} 
      y={y} 
      width={width}
      height={height}
    />
  );
};

export default Guardian; 