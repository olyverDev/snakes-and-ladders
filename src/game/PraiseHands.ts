import { Cell } from './Cell';
import { GameObject, GameObjectTypes } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { Game } from './Game';

const { collection: images } = GameImagesService;

export class PraiseHands extends GameObject {
  constructor(position?: Cell) {
    if (!position) throw new Error('Cell not found!');

    super({
      image: images.praiseHands,
      type: GameObjectTypes.praiseHands,
      fromId: position.id,
      x: position.x,
      y: position.y,
      sizeX: 1,
      sizeY: 1,
    });
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
        (Game.object.size - 0.5) * Cell.cellSize  - (i * cellSize) / 2,
        0,
        cellSize / 2,
        cellSize / 2
      );
    }
  };
}
