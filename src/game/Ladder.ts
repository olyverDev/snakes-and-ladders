import { Cell } from './Cell';
import { GameObject } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { orientations } from './constants';

const { collection: images } = GameImagesService;

//magic numbers here are to place ladder ends at the center of cell
const offsets = {
  left: { x: 100, y: 30, sizeX: 190, sizeY: 45 },
  right: { x: 40, y: 15, sizeX: 100, sizeY: 30 },
};

const imageSize = { x: 2, y: 3 };
export class Ladder extends GameObject {
  fromId: number;
  toId: number;

  constructor(from?: Cell, to?: Cell) {
    if (!from || !to) throw new Error('Cell not found!');
    const isLeft = from.x < to.x;
    const image = isLeft ? images.ladderLeft : images.ladderRight;
    super(
      image,
      Math.min(to?.x, from?.x),
      from?.y,
      Math.abs(to?.x - from?.x) + 1,
      Math.abs(to?.y - from?.y) + 1,
      isLeft ? orientations.left : orientations.right
    );
    this.fromId = from?.id;
    this.toId = to?.id;
  }

  render = (canvas: CanvasRenderingContext2D) => {
    const { isLeft, image, orientation, x, y, sizeX, sizeY } = this;
    const { cellSize } = Cell;
    const offsetBySide = offsets[orientation];
    const sizeMultipliedOffsets = {
      x: (sizeX - imageSize.x) * offsetBySide.x,
      y: (sizeY - imageSize.y) * offsetBySide.y,
      sizeX: (sizeX - imageSize.x) * offsetBySide.sizeX,
      sizeY: (sizeY - imageSize.y) * offsetBySide.sizeY,
    };
    
    canvas.drawImage(
      image,
      (isLeft ? x : x) * cellSize - sizeMultipliedOffsets.x,
      y * cellSize - sizeMultipliedOffsets.y,
      sizeX * cellSize + sizeMultipliedOffsets.sizeX,
      sizeY * cellSize + sizeMultipliedOffsets.sizeY
    );
  };
}
