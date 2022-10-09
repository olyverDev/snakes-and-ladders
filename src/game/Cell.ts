import { GameImagesService } from '../gameImagesService';

const { collection: images } = GameImagesService;

export class Cell {
  private static currentId = 0;
  private static cellSize = 0;
  static getCellSize = () => Cell.cellSize;

  static setCellSize = (size: number) => {
    Cell.cellSize = size;
  };

  id = 0;
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.id = Cell.currentId++;
    this.x = x;
    this.y = y;
    if (x % 2 !== 0) {
      this.color = y % 2 === 0 ? images.redCell : images.blueCell;
    }
    else {
      this.color = y % 2 !== 0 ? images.redCell : images.blueCell;
    }
  }

  color = images.redCell;

  render = (canvas: CanvasRenderingContext2D) => {
    if (!this.color) return;

    canvas.drawImage(
      this.color,
      this.x * Cell.cellSize,
      this.y * Cell.cellSize,
      Cell.cellSize,
      Cell.cellSize
    );
  };
}
