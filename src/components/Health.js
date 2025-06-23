import React from 'react';
import { Image, Group } from 'react-konva';
import useImage from 'use-image';

const Health = ({ health, x, y }) => {
  const [heartImage] = useImage('/heart.png');
  const hearts = [];
  const fullHearts = Math.floor(health);
  const hasHalfHeart = health % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullHearts) {
      hearts.push(
        <Image
          key={i}
          image={heartImage}
          x={i * 35}
          y={0}
          width={30}
          height={30}
        />
      );
    } else if (i === fullHearts && hasHalfHeart) {
      hearts.push(
        <Image
          key={i}
          image={heartImage}
          x={i * 35}
          y={0}
          width={15}
          height={30}
          crop={{ x: 0, y: 0, width: heartImage ? heartImage.width / 2 : 0, height: heartImage ? heartImage.height : 0 }}
        />
      );
    }
  }

  return (
    <Group x={x} y={y}>
      {hearts}
    </Group>
  );
};

export default Health; 