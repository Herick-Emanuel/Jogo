import React, { useEffect, useRef, useState } from 'react';
import { Group, Rect, Text, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

const GuardianDialogBox = ({ x, y, text, onClose }) => {
  const [backgroundImage] = useImage('guardianBackground.png');
  const [guardianImage] = useImage('GuardianOfCastle.png');
  const [displayedText, setDisplayedText] = useState('');
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    intervalRef.current = setInterval(() => {
      setDisplayedText((prev) => {
        if (i < text.length) {
          i++;
          return text.slice(0, i);
        } else {
          clearInterval(intervalRef.current);
          return prev;
        }
      });
    }, 18);
    return () => clearInterval(intervalRef.current);
  }, [text]);

  useEffect(() => {
    const anim = setInterval(() => setFrame(f => f + 1), 60);
    return () => clearInterval(anim);
  }, []);

  const dialogWidth = window.innerWidth * 0.8;
  const dialogHeight = 180;
  const animOffset = Math.sin(frame / 10) * 6;
  const dialogX = x + (window.innerWidth - dialogWidth) / 2;
  const dialogY = y + window.innerHeight - dialogHeight - 20 + animOffset;

  const imageWidth = 512;
  const imageHeight = 512;
  const imageY = dialogY + (dialogHeight - imageHeight) / 1;

  return (
    <Group>
      <Rect
        x={dialogX}
        y={dialogY}
        width={dialogWidth}
        height={dialogHeight}
        fillPatternImage={backgroundImage}
        fillPatternRepeat="repeat"
        stroke="black"
        strokeWidth={2}
        cornerRadius={10}
      />
      {guardianImage && (
        <Image
          image={guardianImage}
          x={dialogX + dialogWidth - imageWidth - 0}
          y={imageY}
          width={imageWidth}
          height={imageHeight}
          crop={{
            x: 0,
            y: 0,
            width: 718,
            height: 628
          }}
        />
      )}
      <Text
        x={dialogX + 30}
        y={dialogY + 40}
        text={displayedText}
        fontSize={24}
        fontFamily="Gumela"
        fontStyle="bold"
        fill="black"
        width={dialogWidth - imageWidth - 80}
        padding={10}
        lineHeight={1.2}
        align="center"
      />
    </Group>
  );
};

export default GuardianDialogBox;
