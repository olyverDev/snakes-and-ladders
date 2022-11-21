import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { GAME_SOUNDS } from './components/AudioPlayer/constants';

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

export type SoundKeyType = keyof typeof GAME_SOUNDS;
export type PlaySoundCallbacks = Record<SoundKeyType, () => void>;
export const useGameSounds = (): PlaySoundCallbacks => {
  const [audio] = useState(new Audio());

  const audioEffects = Object.entries(GAME_SOUNDS).reduce(
    (acc = {} as PlaySoundCallbacks, [key, value]) => ({
      ...acc,
      [key as SoundKeyType]: useCallback(() => {
        audio.pause();
        audio.setAttribute('src', value);
        audio.play();
      }, []) as () => void,
    }),
    {} as PlaySoundCallbacks
  );

  useEffect(() => {
    const onEnd = () => audio.pause();
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  return audioEffects;
};
