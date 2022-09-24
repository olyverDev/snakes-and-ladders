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
