import { CELL_COLORS } from '../constants';

export class Cell {
  private static currentId = 0;
  private static cellSize = 0;
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
      this.color = y % 2 === 0 ? CELL_COLORS.RED : CELL_COLORS.BLUE;
    }
    else {
      this.color = y % 2 !== 0 ? CELL_COLORS.RED : CELL_COLORS.BLUE;
    }
  }

  color = CELL_COLORS.RED;

  render = (canvas: CanvasRenderingContext2D) => {
    canvas.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${Math.random() * 255} )`;
    canvas.drawImage(
      this.color,
      this.x * Cell.cellSize,
      this.y * Cell.cellSize,
      Cell.cellSize,
      Cell.cellSize
    );
  };
}
