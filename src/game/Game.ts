import { LoopCallbackFunctionType } from '../gameLoop';
import { checkPointsMatch } from '../utils';
import { Cell } from './Cell';
import { GameObject } from './GameObject';
import { Ladder } from './Ladder';
import { Snake } from './Snake';
import { User } from './User';

type UserMoveAnimationType = {
  callback: LoopCallbackFunctionType;
  xFrom: number;
  yFrom: number;
  xTo: number;
  yTo: number;
  speed: number;
  gameObj: Game;
};

export class Game {
  isInitialized = false;
  map: Cell[][] = [[]];
  snakes: Snake[] = [];
  ladders: Ladder[] = [];
  userMoveAnimations: UserMoveAnimationType[] = [];
  size = 6;
  static object: Game;
  static id = 0;
  private user?: User;
  private static canvas?: CanvasRenderingContext2D | null = null;
  constructor() {
    Game.id += 1;
    console.log(`Game.id${Game.id}`);
    Game.object = this;
  }
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

    this.snakes.push(new Snake(this.getCellById(27), this.getCellById(9)));
    this.snakes.push(new Snake(this.getCellById(28), this.getCellById(9)));
    this.snakes.push(new Snake(this.getCellById(24), this.getCellById(9)));
    this.snakes.push(new Snake(this.getCellById(25), this.getCellById(9)));
    this.snakes.push(new Snake(this.getCellById(26), this.getCellById(9)));
    this.snakes.push(new Snake(this.getCellById(29), this.getCellById(9)));

    // this.ladders.push(new Ladder(this.getCellById(32), this.getCellById(27)));
    // this.ladders.push(new Ladder(this.getCellById(32), this.getCellById(28)));
    // this.ladders.push(new Ladder(this.getCellById(32), this.getCellById(24)));
    // this.ladders.push(new Ladder(this.getCellById(32), this.getCellById(25)));
    // this.ladders.push(new Ladder(this.getCellById(32), this.getCellById(26)));
    // this.ladders.push(new Ladder(this.getCellById(32), this.getCellById(29)));

    this.ladders.push(new Ladder(this.getCellById(23), this.getCellById(9)));
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

  update = (delta: number) => {
    const animation = this.userMoveAnimations[0];
    animation?.callback.bind(animation)(delta);
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

  moveUser({ countMoves = 0, toId }: { countMoves?: number; toId?: number }) {
    const { user, getCellById, checkGameObject, render } = this;
    if (user) {
      const currentPosition = user.position;
      const newPosition = getCellById(toId || currentPosition.id + countMoves);
      user.position = newPosition || currentPosition;
      if (!newPosition) return;
      this.userMoveAnimations.push({
        callback: function (delta) {
          const { xFrom, yFrom, xTo, yTo, speed, gameObj } = this || {};
          if (!gameObj || !gameObj.user) return;
          if (
            checkPointsMatch({
              x1: gameObj.user.x,
              y1: gameObj.user.y,
              x2: xTo,
              y2: yTo,
            })
          ) {
            console.log('shifted');
            gameObj.userMoveAnimations.shift();
            gameObj.user.x = xTo;
            gameObj.user.y = yTo;
            return;
          }
          if (gameObj.user.x > xTo) {
            gameObj.user.x -= speed * delta;
            console.log('move x-');
          }
          if (gameObj.user.x < xTo) {
            gameObj.user.x += speed * delta;
            console.log('move x+');
          }
          if (gameObj.user.y > yTo) {
            gameObj.user.y -= speed * delta;
            console.log('move y-');
          }
          if (gameObj.user.y < yTo) {
            gameObj.user.y += speed * delta;
            console.log('move y+');
          }
        },
        xFrom: currentPosition.x,
        yFrom: currentPosition.y,
        xTo: newPosition.x * Cell.cellSize,
        yTo: newPosition.y * Cell.cellSize,
        speed: 0.1,
        gameObj: this,
      });
      this.snakes.forEach(checkGameObject);
      this.ladders.forEach(checkGameObject);
    }
  }

  checkGameObject = ({ fromId, toId }: GameObject) => {
    if (fromId === this.user?.position.id) {
      this.moveUser({ toId });
    }
  };

  getCellById = (searchId: number) =>
    this.map.flat().find(({ id }) => id === searchId);
}
