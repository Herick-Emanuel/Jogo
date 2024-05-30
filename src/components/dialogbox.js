import React from "react";
import { Rect, Text, Group } from "react-konva";

const DialogBox = ({ text, onClose }) => {
  return (
    <Group>
      <Rect
        x={50}
        y={50}
        width={1820}
        height={150}
        fill="white"
        stroke="black"
        strokeWidth={2}
        cornerRadius={10}
      />
      <Text
        x={60}
        y={70}
        text={text}
        fontSize={18}
        fontFamily="Calibri"
        fill="black"
      />
      <Text
        x={1820 - 45}
        y={55}
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
