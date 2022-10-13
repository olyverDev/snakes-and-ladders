import { Cell } from './Cell';
import { GameObject } from './GameObject';
import { Ladder } from './Ladder';
import { Snake } from './Snake';
import { User } from './User';

export class Game {
  isInitialized = false;
  map: Cell[][] = [[]];
  snakes: GameObject[] = [];
  ladders: GameObject[] = [];
  size = 6;
  private user?: User;
  private static canvas?: CanvasRenderingContext2D | null = null;

  setSize = (size: number) => {
    this.size = size;
  };

  init = (canvas: HTMLCanvasElement | null) => {
    if (this.isInitialized) return;
    Cell.currentId = 0;
    this.map = Game.generaMap(this.size);
    Game.canvas = canvas?.getContext('2d');
    this.user = new User(this.map[0][0]);
    this.isInitialized = true;

    this.snakes.push(new Snake(this.getCellById(22), this.getCellById(9)));

    // this.ladders.push(new Ladder(this.getCellById(7), this.getCellById(0)));

  };

  render = () => {
    const canvas = Game.canvas;
    if (canvas) {
      this.map.flat().forEach(({ render }) => render(canvas));
      this.user?.render(canvas);
      this.snakes.forEach(({ render }) => render(canvas));
      this.ladders.forEach(({ render }) => render(canvas));
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
      const newPosition = this.getCellById(currentPosition.id + countMoves);

      this.user.position = newPosition || currentPosition;
      this.render();
    }
  };
  getCellById = (searchId: number) =>
    this.map.flat().find(({ id }) => id === searchId);
}
