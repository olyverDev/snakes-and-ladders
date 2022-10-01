import { Cell } from './Cell';
import { GameImagesService } from '../gameImagesService';

export class User {
  position: Cell;

  constructor(position: Cell) {
    this.position = position;
  }
  render = (canvas: CanvasRenderingContext2D) => {
    if (!GameImagesService.collection.userImage) return;

    if (this.position) {
      canvas.drawImage(
        GameImagesService.collection.userImage,
        this.position.x * Cell.getCellSize(),
        this.position.y * Cell.getCellSize(),
        Cell.getCellSize(),
        Cell.getCellSize()
      );
    }
  };
}
