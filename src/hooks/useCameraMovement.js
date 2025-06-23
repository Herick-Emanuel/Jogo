import { useEffect } from 'react';

const useCameraMovement = (stageRef) => {
  useEffect(() => {
    let isDragging = false;
    let lastPos = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      lastPos = stageRef.current.getPointerPosition();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const stage = stageRef.current;
      const currentPos = stage.getPointerPosition();
      const deltaX = currentPos.x - lastPos.x;
      const deltaY = currentPos.y - lastPos.y;

      stage.position({
        x: stage.x() + deltaX,
        y: stage.y() + deltaY,
      });

      lastPos = currentPos;
      stage.batchDraw();
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const stage = stageRef.current;
    
    stage.on('mousedown', handleMouseDown);
    stage.on('mousemove', handleMouseMove);
    stage.on('mouseup', handleMouseUp);

    return () => {
      stage.off('mousedown', handleMouseDown);
      stage.off('mousemove', handleMouseMove);
      stage.off('mouseup', handleMouseUp);
    };
  }, [stageRef]);
};

export default useCameraMovement; 