import { useEffect } from 'react';

const useZoom = (stageRef) => {
  useEffect(() => {
    const handleZoom = (e) => {
      e.evt.preventDefault();
      const zoomFactor = e.evt.deltaY > 0 ? 0.9 : 1.1;
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      const newScale = oldScale * zoomFactor;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
    };

    const stage = stageRef.current;
    stage.on('wheel', handleZoom);
    return () => {
      stage.off('wheel', handleZoom);
    };
  }, [stageRef]);
};

export default useZoom;
