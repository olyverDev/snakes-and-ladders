import { Cell } from './Cell';

export class Game {
  map: Cell[][] = [[]];
  private size = 4;
  private canvas: HTMLCanvasElement | null = null;

  setSize = (size: number) => (this.size = size);
  setCanvas = (canvas: HTMLCanvasElement | null) => (this.canvas = canvas);

  init = () => {
    this.map = Game.generaMap(this.size);
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
