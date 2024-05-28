import React, { useRef, useEffect } from 'react';
import { Image } from 'react-konva';
import { useImage } from 'react-konva-utils'

const Player = ({ x, y }) => {
    const [image] = useImage('player.PNG');
    const playerRef = useRef();

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.cache();
    }
  }, [image]);

  return <Image image={image} x={x} y={y} width={50} height={50} ref={playerRef} />;
};

export default Player;
