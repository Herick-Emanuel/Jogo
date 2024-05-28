// src/components/Platform.js
import React from 'react';
import { Rect } from 'react-konva';

const Platform = ({ x, y, width, height }) => (
  <Rect x={x} y={y} width={width} height={height} fill="grey" />
);

export default Platform;
