import React, { useRef, useEffect, useState } from "react";
import { Image } from "react-konva";
import { decompressFrames, parseGIF } from "gifuct-js";

const Block1 = ({ x, y, width, height }) => {
  const [frames, setFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [images, setImages] = useState([]);
  const blockRef = useRef();
  const animationRef = useRef();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/Block1.gif")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const gif = parseGIF(buffer);
        const frameData = decompressFrames(gif, true);
        setFrames(frameData);
        const imgs = frameData.map((frame) => {
          const canvas = document.createElement("canvas");
          canvas.width = frame.dims.width;
          canvas.height = frame.dims.height;
          const ctx = canvas.getContext("2d");
          const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
          imageData.data.set(frame.patch);
          ctx.putImageData(imageData, 0, 0);
          const img = new window.Image();
          img.src = canvas.toDataURL();
          return img;
        });
        setImages(imgs);
      });
  }, []);

  useEffect(() => {
    if (frames.length === 0 || images.length === 0) return;
    const delay = frames[currentFrame].delay || 100;
    animationRef.current = setTimeout(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, delay);
    return () => clearTimeout(animationRef.current);
  }, [currentFrame, frames, images]);

  return (
    <Image
      image={images[currentFrame]}
      x={x}
      y={y}
      width={width}
      height={height}
      ref={blockRef}
    />
  );
};

export default Block1; 