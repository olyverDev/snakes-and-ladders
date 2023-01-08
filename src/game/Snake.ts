import { Cell } from './Cell';
import { GameObject, GameObjectTypes } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { orientations } from './constants';

const { collection: images } = GameImagesService;

//magic numbers here are to place snake ends at the center of cell
const offsets = { x: 80, y: 40, sizeX: 180, sizeY: 100 };
const imageSize = { x: 2, y: 3 };

export class Snake extends GameObject {
  isAnimated = false;
  creationTime = 0;
  animationDuration = 3000;
  constructor(from?: Cell, to?: Cell) {
    if (!from || !to) throw new Error('Cell not found!');

    super({
      image: images.snake,
      type: GameObjectTypes.snake,
      x: from?.x,
      y: from?.y,
      sizeX: Math.abs(to?.x - from?.x) + 1,
      sizeY: Math.abs(to?.y - from?.y) + 1,
      orientation: from.x > to.x ? orientations.left : orientations.right,
      fromId: from?.id,
      toId: to?.id,
    });
  }
  animate() {
    this.creationTime = window.performance.now();
    this.isAnimated = true;
  }
  render = (canvas: CanvasRenderingContext2D) => {
    canvas.save();
    if (this.isRight) {
      canvas.scale(-1, 1);
    }
    if (this.isAnimated) {
      const timeLeft = window.performance.now() - this.creationTime;
      if (timeLeft >= this.animationDuration) {
        this.isAnimated = false;
        canvas.globalAlpha = 1;

        canvas.restore();
        return;
      }

      const alpha = timeLeft / this.animationDuration;
      canvas.globalAlpha = alpha;
    }
    const { image, isRight, x, y, sizeX, sizeY } = this;
    const { cellSize } = Cell;
    const sizeMultipliedOffsets = {
      x: (sizeX - imageSize.x) * offsets.x * cellSize * 0.008,
      y: (sizeY - imageSize.y) * offsets.y * cellSize * 0.008,
      sizeX: (sizeX - imageSize.x) * offsets.sizeX * cellSize * 0.008,
      sizeY: (sizeY - imageSize.y) * offsets.sizeY * cellSize * 0.008,
    };

    canvas.drawImage(
      image,
      (isRight ? -x - 1 : x) * cellSize - sizeMultipliedOffsets.x,
      y * cellSize - sizeMultipliedOffsets.y,
      sizeX * cellSize + sizeMultipliedOffsets.sizeX,
      sizeY * cellSize + sizeMultipliedOffsets.sizeY
    );
    canvas.restore();
    canvas.globalAlpha = 1;
  };
}
