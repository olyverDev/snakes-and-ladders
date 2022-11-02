import blueCell from './assets/blue_cell.png';
import redCell from './assets/red_cell.png';
import userImage from './assets/giphy-unscreen.gif';
import userDance from './assets/user_dance.png';
import ladderLeft from './assets/ladder-left.png';
import ladderRight from './assets/ladder-right.png';
import snake from './assets/snake.png';
import coffin from './assets/coffin.png';
import praiseHands from './assets/praise-hands.png';
import snakesNest from './assets/snakes-nest.png';

import { useEffect, useState } from 'react';

const IMAGES_SOURCES = {
  blueCell,
  redCell,
  userImage,
  ladderLeft,
  ladderRight,
  snake,
  coffin,
  praiseHands,
  snakesNest,
  userDance,
};

export type ImageName = keyof typeof IMAGES_SOURCES;
export type ImagesType = Record<ImageName, HTMLImageElement>;

const PRE_CREATED_IMAGES: ImagesType = Object.entries(IMAGES_SOURCES).reduce(
  (acc, [name, source]) => {
    const image = new Image();
    image.src = source;
    acc[name] = image;
    return acc;
  },
  Object.create(null)
);

const loadGameImages = () => {
  return new Promise<{ loaded: boolean; images: ImagesType }>(
    (resolve, reject) => {
      let loadedAmount = 0;
      const imagesList = Object.values(PRE_CREATED_IMAGES);

      imagesList.forEach((image) => {
        image.onerror = reject;
        image.onload = () => {
          loadedAmount++;

          if (loadedAmount >= imagesList.length) {
            resolve({ loaded: true, images: PRE_CREATED_IMAGES });
          }
        };
      });
    }
  );
};

const useGameImagesLoader = (): { loaded: boolean } => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const preload = async () => {
      try {
        const { loaded } = await GameImagesService.load;
        if (loaded) setLoaded(true);
      } catch (error) {
        alert('Unexpected error loading images...');
      }
    };

    preload();
  }, []);

  return { loaded };
};

export const GameImagesService = {
  collection: PRE_CREATED_IMAGES,
  load: loadGameImages(),
  useLoad: useGameImagesLoader,
};
