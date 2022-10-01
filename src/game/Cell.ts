import { IMAGES } from '../images';

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
      this.color = y % 2 === 0 ? IMAGES.RED_CELL : IMAGES.BLUE_CELL;
    }
    else {
      this.color = y % 2 !== 0 ? IMAGES.RED_CELL : IMAGES.BLUE_CELL;
    }
  }

  color = IMAGES.RED_CELL;

  render = (canvas: CanvasRenderingContext2D) => {
    canvas.drawImage(
      this.color,
      this.x * Cell.cellSize,
      this.y * Cell.cellSize,
      Cell.cellSize,
      Cell.cellSize
    );
  };
}
