import { Cell } from './Cell';

export class Game {
  map: Cell[][] = [[]];
  size = 6;
  private canvas?: CanvasRenderingContext2D | null = null;

  setSize = (size: number) => {
    this.size = size;
  };

  init = (canvas: HTMLCanvasElement | null) => {
    this.map = Game.generaMap(this.size);
    this.canvas = canvas?.getContext('2d');
  };

  render = () => {
    const canvas = this.canvas;
    if (canvas) {
      this.map.forEach((row) => row.forEach((cell) => cell.render(canvas)));
    }
  };

  private static generaMap = (size: number) =>
    Array(size)
      .fill(null)
      .map((_, x) => Game.generateColumn(size, x));

  private static generateColumn = (size: number, x: number) =>
    Array(size)
      .fill(null)
      .map((_, y) => new Cell(x, y));
}
