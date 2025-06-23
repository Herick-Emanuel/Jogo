import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import { useImage } from 'react-konva-utils';
import Konva from 'konva';

const Torch = ({ x, y, width, height }) => {
  const [torchImage] = useImage('/torchAnimated.png');
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 1, height: 1 });

  useEffect(() => {
    if (torchImage) {
      const frameWidth = torchImage.width / 4;
      const frameHeight = torchImage.height / 2;

      setCrop({ x: 0, y: 0, width: frameWidth, height: frameHeight });

      const anim = new Konva.Animation(frame => {
        if (!frame) {
          return;
        }
        const frameIndex = Math.floor(frame.time / 150) % 8 
        
        const newCropX = (frameIndex % 4) * frameWidth;
        const newCropY = Math.floor(frameIndex / 4) * frameHeight;

        setCrop({ x: newCropX, y: newCropY, width: frameWidth, height: frameHeight });
      });

      anim.start();

      return () => {
        anim.stop();
      };
    }
  }, [torchImage]);

  return (
    <Image
      x={x}
      y={y}
      width={width}
      height={height}
      image={torchImage}
      crop={crop}
    />
  );
};

export default Torch; 