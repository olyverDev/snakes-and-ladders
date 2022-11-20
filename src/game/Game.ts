import { ImageName } from '../gameImagesService';
import { LoopCallbackFunctionType } from '../gameLoop';
import {
  PlaySoundCallbacks,
} from '../utils';
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
  xFrom: number;
  yFrom: number;
  xTo: number;
  yTo: number;
  duration: number;
  gameObj: Game;
  currentDuration: number;
};

export type PlayerConfig = {
  key: string;
  automatic: boolean;
  imageName?: ImageName;
};

export class Game {
  finishId = 0;
  isInitialized = false;
  loopInitialized = false;
  map: Cell[][] = [[]];
  gameObjects: GameObject[] = [];
  userMoveAnimations: UserMoveAnimationType[] = [];
  size = 6;
  activePlayerKey: PlayerConfig['key'];
  players: Record<string, User> = {};
  static object: Game;
  static playerConfig: PlayerConfig[];
  static id = 0;
  private static gameSounds: PlaySoundCallbacks;
  private static canvas?: CanvasRenderingContext2D | null = null;
  constructor(playerConfig: PlayerConfig[]) {
    Game.object = this;
    Game.playerConfig = playerConfig;
    this.activePlayerKey = playerConfig[0].key;
  }
  setSize = (size: number) => {
    this.size = size;
  };

  getActivePlayer() {
    return this.players[this.activePlayerKey];
  }

  setActivePlayerKey = (activePlayerKey: PlayerConfig['key']) => {
    this.activePlayerKey = activePlayerKey;
  };

  init = (canvas: HTMLCanvasElement | null, gameSounds: PlaySoundCallbacks) => {
    if (this.isInitialized) return;
    Cell.currentId = 0;
    this.map = Game.generaMap(this.size);
    this.finishId = Math.pow(this.size, 2) - 1;
    Game.canvas = canvas?.getContext('2d');
    Game.playerConfig.forEach(({ key, imageName }) => {
      this.players[key] = new User(this.map[0][0], key, imageName);
    }, {});
    Game.gameSounds = gameSounds;
    this.isInitialized = true;

    this.gameObjects.push(
      new Snake(this.getCellById(32), this.getCellById(18))
    );
    this.gameObjects.push(
      new Snake(this.getCellById(26), this.getCellById(12))
    );
    this.gameObjects.push(
      new Ladder(this.getCellById(17), this.getCellById(4))
    );
    this.gameObjects.push(
      new Ladder(this.getCellById(34), this.getCellById(21))
    );
    this.gameObjects.push(new PraiseHands(this.getCellById(16)));
    this.gameObjects.push(new Coffin(this.getCellById(UNLUCKY_POSITION)));
    this.gameObjects.push(
      new SnakesNest({
        position: this.getCellById(15),
        snakeFrom: this.getCellById(20),
        snakeTo: this.getCellById(10),
      })
    );
  };

  render = (delta: number) => {
    const canvas = Game.canvas;
    if (canvas) {
      this.map.flat().forEach(({ render }) => render(canvas));
      Object.values(this.players).forEach((player) => {
        player.render(canvas, delta);
        // TODO: display praise hands bonus (antidotes) by each player
        PraiseHands.renderAsBonuses(canvas, player.getAntidotesCount());
      });
      this.gameObjects.forEach(({ render }) => render(canvas));
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

  moveUser({
    countMoves = 0,
    toId,
    directMove = false,
  }: {
    countMoves?: number;
    toId?: number;
    directMove?: boolean;
  }) {
    const { getCellById, checkGameObjects, addMoveUserAnimation } = this;
    const user = this.getActivePlayer();
    if (user) {
      const currentPosition = user.position;
      const newPosition = getCellById(
        toId == null ? currentPosition.id + countMoves : toId
      );
      user.position = newPosition || currentPosition;
      if (!newPosition) {
        this.moveUser({ toId: this.finishId });
        return;
      }
      if (directMove) {
        this.addMoveUserAnimation({ currentPosition, newPosition });
      } else {
        Game.gameSounds.userMoveSound();
        new Array(newPosition.id - currentPosition.id)
          .fill(null)
          .forEach((_, index) => {
            const currentAnimationPosition = this.getCellById(
              currentPosition.id + index
            );
            const newAnimationPosition = this.getCellById(
              currentPosition.id + index + 1
            );
            if (!currentAnimationPosition || !newAnimationPosition) return;
            this.addMoveUserAnimation({
              currentPosition: currentAnimationPosition,
              newPosition: newAnimationPosition,
            });
          });
      }

      checkGameObjects();
    }
  }
  addMoveUserAnimation = ({
    currentPosition,
    newPosition,
  }: {
    currentPosition: Cell;
    newPosition: Cell;
  }) => {
    this.userMoveAnimations.push({
      callback: function (delta) {
        this.currentDuration += delta;
        const { xFrom, yFrom, xTo, yTo, duration, gameObj, currentDuration } =
          this || {};
        if (!gameObj) return;

        const gameObjUser = gameObj.players[gameObj.activePlayerKey];

        if (!gameObjUser) return;

        if (currentDuration >= duration) {
          gameObj.userMoveAnimations.shift();
          gameObjUser.x = xTo;
          gameObjUser.y = yTo;
          return;
        }
        gameObjUser.x = xFrom + ((xTo - xFrom) * currentDuration) / duration;
        gameObjUser.y = yFrom + ((yTo - yFrom) * currentDuration) / duration;
      },
      xFrom: currentPosition.x,
      yFrom: currentPosition.y,
      xTo: newPosition.x,
      yTo: newPosition.y,
      duration: 500,
      gameObj: this,
      currentDuration: 0,
    });
  };
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
        this.moveUser({ toId: 0, directMove: true });
        this.removeGameObject(id);
        Game.gameSounds.coffinSound();
        return;
      }
      if (isLadder && fromId === user?.position.id) {
        this.moveUser({ toId, directMove: true });
        Game.gameSounds.ladderSound();
        return;
      }
      if (isSnake && fromId === user?.position.id) {
        if (user.getAntidotesCount() > 0) {
          user.useAntidote();
          Game.gameSounds.usePraiseHandsSound();
          return;
        }
        this.moveUser({ toId, directMove: true });
        Game.gameSounds.snakeSound();
      }
      if (praiseHands && fromId === user?.position.id) {
        user.addAntidote();
        this.removeGameObject(id);
        Game.gameSounds.getPraiseHandsSound();
      }
      if (isSnakeNest && fromId === user?.position.id) {
        const snake = (object as SnakesNest).snake;
        this.gameObjects.push(snake);
        snake.animate();
        this.removeGameObject(id);
        Game.gameSounds.snakesNestSound();
        return;
      }
    });
  };

  getCellById = (searchId: number) =>
    this.map.flat().find(({ id }) => id === searchId);
}
