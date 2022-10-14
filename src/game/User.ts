import { Cell } from './Cell';
import { GameImagesService } from '../gameImagesService';

export class User {
  position: Cell;
  x: number;
  y: number;

  constructor(position: Cell) {
    this.position = position;
    this.x = position.x * Cell.cellSize;
    this.y = position.y * Cell.cellSize;
  }
  render = (canvas: CanvasRenderingContext2D) => {
    if (!GameImagesService.collection.userImage) return;

    if (this.position) {
      canvas.drawImage(
        GameImagesService.collection.userImage,
        this.x,
        this.y,
        Cell.cellSize,
        Cell.cellSize
      );
    }
  };
}
