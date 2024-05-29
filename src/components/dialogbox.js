import React from 'react';
import { Rect, Text, Group } from 'react-konva';

const DialogBox = ({ text, onClose }) => (
  <Group x={50} y={50}>
    <Rect width={300} height={150} fill="white" stroke="black" strokeWidth={2} />
    <Text text={text} fontSize={20} fill="black" x={10} y={10} />
    <Text text="Pressione ESC para fechar" fontSize={15} fill="gray" x={10} y={110} />
    <Rect x={10} y={110} width={280} height={30} fill="transparent" onClick={onClose} />
  </Group>
);

export default DialogBox;
