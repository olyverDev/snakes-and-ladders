import { Cell } from './Cell';
import { User } from './User';

export class Game {
  isInitialized = false;
  map: Cell[][] = [[]];
  size = 6;
  private user?: User;
  private static canvas?: CanvasRenderingContext2D | null = null;

  setSize = (size: number) => {
    this.size = size;
  };

  init = (canvas: HTMLCanvasElement | null) => {
    if (this.isInitialized) return;

    this.map = Game.generaMap(this.size);
    Game.canvas = canvas?.getContext('2d');
    this.user = new User(this.map[0][0]);
    this.isInitialized = true;
  };

  render = () => {
    const canvas = Game.canvas;
    if (canvas) {
      this.map.forEach((row) => row.forEach((cell) => cell.render(canvas)));
      this.user?.render(canvas);
    }
  };

  private static generaMap = (size: number) =>
    Array(size)
      .fill(null)
      .map((_, y, { length: columnsCount }) =>
        Game.generateRow(size, y, columnsCount)
      );

  private static generateRow = (
    rowsCount: number,
    y: number,
    columnsCount: number
  ) => {
    const isRowOdd = y % 2;
    return Array(rowsCount)
      .fill(null)
      .map(
        (_, x) =>
          new Cell(isRowOdd ? columnsCount - x - 1 : x, columnsCount - y - 1)
      );
  };

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
