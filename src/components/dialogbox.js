import React from "react";
import { Rect, Text, Group } from "react-konva";

const DialogBox = ({ x, y, text, onClose }) => {
  return (
    <Group>
      <Rect
        x={x + 50}
        y={y + 50}
        width={1820}
        height={150}
        fill="white"
        stroke="black"
        strokeWidth={2}
        cornerRadius={10}
      />
      <Text
        x={x + 60}
        y={y + 70}
        text={text}
        fontSize={18}
        fontFamily="Calibri"
        fill="black"
      />
      <Text
        x={x + 1820 - 45}
        y={y + 55}
        text="X"
        fontSize={18}
        fontFamily="Calibri"
        fill="white"
        onClick={onClose}
        onTap={onClose}
      />
    </Group>
  );
};

export default DialogBox;
