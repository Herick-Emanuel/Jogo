import React from "react";
import { Rect, Text, Group } from "react-konva";
import { useImage } from "react-konva-utils";

const DialogBox = ({ x, y, text, onClose }) => {
  const [backgroundImage] = useImage("/PlacaBackground.png");

  return (
    <Group x={x + 50} y={y + 50}>
      <Rect
        width={1820}
        height={150}
        fillPatternImage={backgroundImage}
        fillPatternRepeat="repeat"
        stroke="black"
        strokeWidth={2}
        cornerRadius={10}
      />
      <Text
        x={10}
        y={20}
        text={text}
        fontSize={22}
        fontFamily="Gumela"
        fill="black"
        width={1800}
        padding={10}
        lineHeight={1.4}
        align="center"
      />
    </Group>
  );
};

export default DialogBox;
