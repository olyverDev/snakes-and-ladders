import { Cell } from './Cell';
import { GameObject, GameObjectTypes } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { Snake } from './Snake';

const { collection: images } = GameImagesService;

export class SnakesNest extends GameObject {
  snake: Snake;
  constructor({
    position,
    snakeFrom,
    snakeTo,
  }: {
    position?: Cell;
    snakeFrom?: Cell;
    snakeTo?: Cell;
  }) {
    if (!position || !snakeFrom || !snakeTo) throw new Error('Cell not found!');

    super({
      image: images.snakesNest,
      type: GameObjectTypes.snakesNest,
      fromId: position.id,
      x: position.x,
      y: position.y,
      sizeX: 1,
      sizeY: 1,
    });

    this.snake = new Snake(snakeFrom, snakeTo);
  }

  render = (canvas: CanvasRenderingContext2D) => {
    const { image, x, y, sizeX, sizeY } = this;
    const { cellSize } = Cell;

    canvas.drawImage(
      image,
      x * cellSize,
      y * cellSize,
      sizeX * cellSize,
      sizeY * cellSize
    );
  };
}
