import { useLayoutEffect } from 'react';

export const useWindowResize = (callback: () => unknown) => {
  useLayoutEffect(() => {
    function updateSize() {
      callback();
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
};

const matchDistance = 0.1;

export const checkPointsMatch = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) < matchDistance;

export const normalizeVector = ({ x, y }: { x: number; y: number }) => {
  const length = Math.sqrt(x * x + y * y);
  return { x: x / length, y: y / length };
};
