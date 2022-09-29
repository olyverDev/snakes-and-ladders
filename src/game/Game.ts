import { Cell } from './Cell';
import { User } from './User';

export class Game {
  isInitialized = false;
  map: Cell[][] = [[]];
  size = 6;
  private user?: User;
  private canvas?: CanvasRenderingContext2D | null = null;

  setSize = (size: number) => {
    this.size = size;
  };

  init = (canvas: HTMLCanvasElement | null) => {
    if (this.isInitialized) return;

    this.map = Game.generaMap(this.size);
    this.canvas = canvas?.getContext('2d');
    this.user = new User(this.map[0][0]);
    this.isInitialized = true;
  };

  render = () => {
    const canvas = this.canvas;
    if (canvas) {
      this.map.forEach((row) => row.forEach((cell) => cell.render(canvas)));
      this.user?.render(canvas);
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
  moveUser = (countMoves: number) => {
    if (this.user) {
      const currentPosition = this.user.position;
      const newPosition = this.map
        .flat()
        .find(({ id }) => id === currentPosition.id + countMoves);

      this.user.position = newPosition || currentPosition;
      this.render();
    }
  };
}
