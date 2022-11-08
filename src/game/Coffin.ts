import { Cell } from './Cell';
import { GameObject, GameObjectTypes } from './GameObject';
import { GameImagesService } from '../gameImagesService';
import { Game } from './Game';

const { collection: images } = GameImagesService;

export class Coffin extends GameObject {
  constructor(position?: Cell) {
    if (!position) throw new Error('Cell not found!');

    super({
      image: images.coffin,
      type: GameObjectTypes.coffin,
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
}
