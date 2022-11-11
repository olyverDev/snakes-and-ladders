import { ImageName } from '../gameImagesService';
import { LoopCallbackFunctionType } from '../gameLoop';
import { checkPointsMatch, normalizeVector } from '../utils';
import { Cell } from './Cell';
import { Coffin } from './Coffin';
import { UNLUCKY_POSITION } from './constants';
import { GameObject, GameObjectTypes } from './GameObject';
import { Ladder } from './Ladder';
import { PraiseHands } from './PraiseHands';
import { Snake } from './Snake';
import { SnakesNest } from './SnakesNest';
import { User } from './User';

type UserMoveAnimationType = {
  callback: LoopCallbackFunctionType;
  xVec: number;
  yVec: number;
  xTo: number;
  yTo: number;
  speed: number;
  gameObj: Game;
};

export type PlayerConfig = {
  key: string;
  automatic: boolean;
  imageName?: ImageName;
}

export class Game {
  finishId = 0;
  isInitialized = false;
  loopInitialized = false;
  map: Cell[][] = [[]];
  gameObjects: GameObject[] = [];
  userMoveAnimations: UserMoveAnimationType[] = [];
  size = 6;
  praiseHandsCount = 0;
  activePlayerKey: PlayerConfig['key'];
  players: Record<string, User> = {};
  static object: Game;
  static playerConfig: PlayerConfig[];
  static id = 0;

  private static canvas?: CanvasRenderingContext2D | null = null;
  constructor(playerConfig: PlayerConfig[]) {
    Game.object = this;
    Game.playerConfig = playerConfig;
    this.activePlayerKey = playerConfig[0].key;
  }
  setSize = (size: number) => {
    this.size = size;
  };

  getActivePlayer () {
    return this.players[this.activePlayerKey];
  }

  setActivePlayerKey = (activePlayerKey: PlayerConfig['key']) => {
    this.activePlayerKey = activePlayerKey;
  }

  init = (canvas: HTMLCanvasElement | null) => {
    if (this.isInitialized) return;
    Cell.currentId = 0;
    this.map = Game.generaMap(this.size);
    this.finishId = Math.pow(this.size, 2) - 1;
    Game.canvas = canvas?.getContext('2d');
    Game.playerConfig.forEach(({ key, imageName }) => {
      this.players[key] = new User(this.map[0][0], key, imageName);
    }, {});

    this.isInitialized = true;

    this.gameObjects.push(new Snake(this.getCellById(32), this.getCellById(18)));
    this.gameObjects.push(new Snake(this.getCellById(26), this.getCellById(12)));
    this.gameObjects.push(new Ladder(this.getCellById(17), this.getCellById(4)));
    this.gameObjects.push(new Ladder(this.getCellById(34), this.getCellById(21)));
    this.gameObjects.push(new PraiseHands(this.getCellById(16)));
    this.gameObjects.push(new Coffin(this.getCellById(UNLUCKY_POSITION)));
    this.gameObjects.push(
      new SnakesNest({
        position: this.getCellById(15),
        snakeFrom: this.getCellById(20),
        snakeTo: this.getCellById(10),
      }),
    );
  };

  render = (delta: number) => {
    const canvas = Game.canvas;
    if (canvas) {
      this.map.flat().forEach(({ render }) => render(canvas));
      Object.values(this.players).forEach(player => player.render(canvas, delta));
      this.gameObjects.forEach(({ render }) => render(canvas));
      PraiseHands.renderAsBonuses(canvas, this.praiseHandsCount);
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
    const { getCellById, checkGameObjects } = this;
    const user = this.getActivePlayer();
    if (user) {
      const currentPosition = user.position;
      const newPosition = getCellById(toId == null ? currentPosition.id + countMoves : toId);
      user.position = newPosition || currentPosition;
      if (!newPosition) {
        this.moveUser({ toId: this.finishId });
        return;
      }

      const { x: xVec, y: yVec } = normalizeVector({
        x: currentPosition.x - newPosition.x,
        y: currentPosition.y - newPosition.y,
      });

      this.userMoveAnimations.push({
        callback: function (delta) {
          const { xVec, yVec, xTo, yTo, speed, gameObj } = this || {};
          if (!gameObj) return;

          const gameObjUser = gameObj.players[gameObj.activePlayerKey];

          if (!gameObjUser) return;

          if (
            checkPointsMatch({
              x1: gameObjUser.x,
              y1: gameObjUser.y,
              x2: xTo,
              y2: yTo,
            })
          ) {
            gameObj.userMoveAnimations.shift();
            gameObjUser.x = xTo;
            gameObjUser.y = yTo;
            return;
          }
          gameObjUser.x -= xVec * speed * delta * Cell.cellSize;
          gameObjUser.y -= yVec * speed * delta * Cell.cellSize;
        },
        xVec,
        yVec,
        xTo: newPosition.x,
        yTo: newPosition.y,
        speed: 0.00002,
        gameObj: this,
      });
      checkGameObjects();
    }
  }

  removeGameObject = (removableId: number) => {
    setTimeout(() => {
      this.gameObjects = this.gameObjects.filter(
        ({ id }) => id !== removableId
      );
    }, 2000);
  };

  checkGameObjects = () => {
    this.gameObjects.forEach((object) => {
      const { fromId, toId, type, id } = object;
  
      const isSnakeNest = type === GameObjectTypes.snakesNest;
    
      const isSnake = type === GameObjectTypes.snake;
      const isLadder = type === GameObjectTypes.ladder;
      const praiseHands = type === GameObjectTypes.praiseHands;
      const moveToStart = type === GameObjectTypes.coffin;
      const user = this.getActivePlayer();

      if (moveToStart && fromId === user?.position.id) {
        this.moveUser({ toId: 0 });
        this.removeGameObject(id);
        return;
      }
      if (isLadder && fromId === user?.position.id) {
        this.moveUser({ toId });
      }
      if (isSnake && fromId === user?.position.id) {
        if (this.praiseHandsCount > 0) {
          this.praiseHandsCount--;
          return;
        }
        this.moveUser({ toId });
      }
      if (praiseHands && fromId === user?.position.id) {
        this.praiseHandsCount++; // TODO: assign to particular player
        this.removeGameObject(id);
      }
      if (isSnakeNest && fromId === user?.position.id) {
        const snake = (object as SnakesNest).snake;
        this.gameObjects.push(snake);
        snake.animate();
        this.removeGameObject(id);
        return;
      }
    });
  };

  getCellById = (searchId: number) =>
    this.map.flat().find(({ id }) => id === searchId);
}
