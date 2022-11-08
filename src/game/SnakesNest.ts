import { Cell } from './Cell';
import { GameObject, GameObjectTypes } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { Game } from './Game';
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

  static renderAsBonuses = (
    canvas: CanvasRenderingContext2D,
    count: number
  ) => {
    const image = images.praiseHands;
    const { cellSize } = Cell;
    for (let i = 0; i < count; i++) {
      canvas.drawImage(
        image,
        (Game.object.size - 0.5) * Cell.cellSize - (i * cellSize) / 2,
        0,
        cellSize / 2,
        cellSize / 2
      );
    }
  };
}
