import { Cell } from './Cell';
import { GameObject } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { orientations } from './constants';

const { collection: images } = GameImagesService;

//magic numbers here are to place snake ends at the center of cell
const offsets = { x: 80, y: 40, sizeX: 180, sizeY: 100 };
const imageSize = { x: 2, y: 3 };

export class Snake extends GameObject {
  constructor(from?: Cell, to?: Cell) {
    if (!from || !to) throw new Error('Cell not found!');

    super({
      image: images.snake,
      x: from?.x,
      y: from?.y,
      sizeX: Math.abs(to?.x - from?.x) + 1,
      sizeY: Math.abs(to?.y - from?.y) + 1,
      orientation: from.x > to.x ? orientations.left : orientations.right,
      fromId: from?.id,
      toId: to?.id,
    });
  }
  render = (canvas: CanvasRenderingContext2D) => {
    if (this.isRight) {
      canvas.save();
      canvas.scale(-1, 1);
    }
    const { image, isRight, x, y, sizeX, sizeY } = this;
    const { cellSize } = Cell;
    const sizeMultipliedOffsets = {
      x: (sizeX - imageSize.x) * offsets.x,
      y: (sizeY - imageSize.y) * offsets.y,
      sizeX: (sizeX - imageSize.x) * offsets.sizeX,
      sizeY: (sizeY - imageSize.y) * offsets.sizeY,
    };
    canvas.drawImage(
      image,
      (isRight ? -x - 1 : x) * cellSize - sizeMultipliedOffsets.x,
      y * cellSize - sizeMultipliedOffsets.y,
      sizeX * cellSize + sizeMultipliedOffsets.sizeX,
      sizeY * cellSize + sizeMultipliedOffsets.sizeY
    );
    canvas.restore();
  };
}
