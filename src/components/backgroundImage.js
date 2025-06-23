import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';
import Konva from 'konva';

const BackgroundImage = ({ showCastle }) => {
  const [forestImage] = useImage('/forestBackground1.png');
  const [castleImage] = useImage('/castle.avif');
  const castleRef = useRef(null);

  useEffect(() => {
    if (showCastle && castleRef.current) {
      castleRef.current.to({
        opacity: 1,
        duration: 2.0,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [showCastle]);

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,
      pointerEvents: "none",
      backgroundColor:" #0C1121",
    }}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Image
            image={forestImage}
            width={window.innerWidth}
            height={window.innerHeight}
            y={(window.innerHeight - (window.innerWidth * (forestImage ? forestImage.height / forestImage.width : 0))) / 2}
          />
          <Image
            ref={castleRef}
            image={castleImage}
            width={window.innerWidth}
            height={window.innerHeight}
            opacity={0}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default BackgroundImage; 