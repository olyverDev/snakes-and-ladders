import { GameImagesService } from '../gameImagesService';
import { GameObject } from './GameObject';

const { collection: images } = GameImagesService;

export class Cell extends GameObject {
  private static currentId = 0;
  private static cellSize = 0;
  static getCellSize = () => Cell.cellSize;

  static setCellSize = (size: number) => {
    Cell.cellSize = size;
  };

  id = 0;

  constructor(x: number, y: number) {
    super();
    this.id = Cell.currentId++;
    this.X = x
    this.Y = y;
    if (x % 2 !== 0) {
      this.color = y % 2 === 0 ? images.redCell : images.blueCell;
    } else {
      this.color = y % 2 !== 0 ? images.redCell : images.blueCell;
    }
  }

  color = images.redCell;

  render = (canvas: CanvasRenderingContext2D) => {
    if (!this.color) return;

    canvas.drawImage(
      this.color,
      this.X * Cell.cellSize,
      this.Y * Cell.cellSize,
      Cell.cellSize,
      Cell.cellSize
    );

    // TODO: remove me ---------------
    canvas.font = '35px serif';
    canvas.fillText(
      '' + this.id,
      this.x * Cell.cellSize + Cell.cellSize / 2,
      this.y * Cell.cellSize + Cell.cellSize / 2
    );
    // TODO: remove me ---------------
  };
}
