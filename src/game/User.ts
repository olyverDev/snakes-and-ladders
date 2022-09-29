import { Cell } from './Cell';
import userImage from '../assets/giphy-unscreen.gif';

const image = new Image();
image.src = userImage;

export class User {
  position: Cell;

  constructor(position: Cell) {
    this.position = position;
  }
  render = (canvas: CanvasRenderingContext2D) => {
    if (this.position) {
      canvas.drawImage(
        image,
        this.position.x * Cell.getCellSize(),
        this.position.y * Cell.getCellSize(),
        Cell.getCellSize(),
        Cell.getCellSize()
      );
    }
  };
}
