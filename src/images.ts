import BLUE_CELL from './assets/blue_cell.png';
import RED_CELL from './assets/red_cell.png';
import USER_IMAGE from './assets/giphy-unscreen.gif';

const addImageProcess = (src: string) => {
  const image = new Image();
  const promise = new Promise<boolean>((resolve, reject) => {
    image.onload = () => resolve(true);
    image.onerror = reject;
    image.src = src;
  });
  return { image, promise };
};

const imagesLoadingProcess: Array<Promise<boolean>> = [] as Array<
  Promise<boolean>
>;

const images_sources = {
  BLUE_CELL,
  RED_CELL,
  USER_IMAGE,
};

type imagesKey = keyof typeof images_sources;

type IMAGES_TYPE = { [key in imagesKey]: HTMLImageElement };

export const IMAGES: IMAGES_TYPE = Object.entries(images_sources).reduce(
  (acc, [key, src]) => {
    const { image, promise } = addImageProcess(src);
    imagesLoadingProcess.push(promise);
    return { ...acc, [key]: image };
  },
  {} as IMAGES_TYPE
);
export const allImagesLoaded = Promise.all(imagesLoadingProcess).then(
  (promises) => promises.every(Boolean)
);


