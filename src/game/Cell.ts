import { CELL_COLORS } from '../constants';

export class Cell {
  private static currentId = 0;
  id = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.id = Cell.currentId++;
  }

  x = 0;
  y = 0;
  color = CELL_COLORS.RED;
  render = (canvas: CanvasRenderingContext2D) => {
    console.log(`rendered cell x:${this.x} y:${this.y} color:${this.color}`);
  };
}
