import i18next from 'i18next';
import { ImageName } from '../gameImagesService';
import { LoopCallbackFunctionType } from '../gameLoop';
import { calcPlayersOnCells, GAME_SIZE, PlaySoundCallbacks } from '../utils';
import { Cell } from './Cell';
import { Cloud } from './Cloud';
import { Coffin } from './Coffin';
import { UNLUCKY_POSITION } from './constants';
import { GameEvent } from './GameEvent';
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

type VoidFn = () => void;

export class Game {
  finishId = 0;
  isInitialized = false;
  loopInitialized = false;
  map: Cell[][] = [[]];
  gameObjects: GameObject[] = [];
  userMoveAnimations: UserMoveAnimationType[] = [];
  size = GAME_SIZE;
  activePlayerKey: PlayerConfig['key'];
  players: Record<string, User> = {};
  playersOnCells: Record<string, number> = {};
  static object: Game;
  static playerConfig: PlayerConfig[];
  private static gameSounds: PlaySoundCallbacks;
  private static canvas?: CanvasRenderingContext2D | null = null;
  clouds: Cloud[] = [];
  ladders = 0;
  snakes = 0;

  constructor(playerConfig: PlayerConfig[]) {
    Game.object = this;
    Game.playerConfig = playerConfig;
    this.activePlayerKey = playerConfig[0].key;
  }

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
    this.playersOnCells = calcPlayersOnCells(Object.values(this.players))
    Game.gameSounds = gameSounds;
    this.isInitialized = true;

    this.gameObjects.push(
      new Snake(this.getCellById(62), this.getCellById(35))
    );

    this.gameObjects.push(
      new Snake(this.getCellById(60), this.getCellById(43))
    );

    this.gameObjects.push(
      new Snake(this.getCellById(55), this.getCellById(21))
    );

    this.gameObjects.push(
      new Snake(this.getCellById(31), this.getCellById(14))
    );

    this.gameObjects.push(
      new Snake(this.getCellById(43), this.getCellById(29))
    );

    this.gameObjects.push(
      new Snake(this.getCellById(18), this.getCellById(1))
    );

    this.gameObjects.push(
      new Snake(this.getCellById(25), this.getCellById(8))
    );

    this.gameObjects.push(
      new Ladder(this.getCellById(21), this.getCellById(4))
    );

    this.gameObjects.push(
      new Ladder(this.getCellById(36), this.getCellById(21))
    );

    this.gameObjects.push(
      new Ladder(this.getCellById(61), this.getCellById(33))
    );


    this.gameObjects.push(
      new Ladder(this.getCellById(9), this.getCellById(7))
    );


    this.gameObjects.push(
      new Ladder(this.getCellById(58), this.getCellById(41))
    );

    this.gameObjects.push(
      new Ladder(this.getCellById(28), this.getCellById(13))
    );

    this.gameObjects.push(new PraiseHands(this.getCellById(20)));
    this.gameObjects.push(new PraiseHands(this.getCellById(38)));
    this.gameObjects.push(new PraiseHands(this.getCellById(52)));
  
    this.gameObjects.push(new Coffin(this.getCellById(UNLUCKY_POSITION - 1)));
    this.gameObjects.push(new Coffin(this.getCellById(47)));
    this.gameObjects.push(new Coffin(this.getCellById(57)));

    this.gameObjects.push(
      new SnakesNest({
        position: this.getCellById(30),
        snakeFrom: this.getCellById(45),
        snakeTo: this.getCellById(30),
      })
    );

    this.gameObjects.push(
      new SnakesNest({
        position: this.getCellById(9),
        snakeFrom: this.getCellById(22),
        snakeTo: this.getCellById(7),
      })
    );

    this.gameObjects.push(
      new SnakesNest({
        position: this.getCellById(2),
        snakeFrom: this.getCellById(17),
        snakeTo: this.getCellById(0),
      })
    );

    setTimeout(() => {
      this.showActivePlayerCloud({ label: i18next.t('clouds.start') as string })
    }, 750);
  };

  render = (delta: number) => {
    const canvas = Game.canvas;
    if (canvas) {
      this.map.flat().forEach(({ render }) => render(canvas));
      this.gameObjects.forEach(({ render }) => render(canvas));
      Object.values(this.players).forEach((player) => {
        player.render(
          canvas,
          delta,
          this.playersOnCells[player.name]
        );
      });
      this.clouds.forEach(({ render }) => render(canvas));
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
    const { getCellById, createGameObjectsHandlers, addMoveUserAnimation } =
      this;
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

      const isEnd = newPosition.id === this.finishId;

      const { extraAction, isExtraMove } =
        createGameObjectsHandlers(newPosition);

      const callback = () => {
        if (isEnd) {
          const turnIndex = Game.playerConfig
            .map((p) => p.key)
            .indexOf(this.activePlayerKey);
          const isLastPlayer = turnIndex === Game.playerConfig.length - 1;
          const nextIndex = isLastPlayer ? 0 : turnIndex + 1;
          const nextPlayer = Game.playerConfig[nextIndex];

          Game.playerConfig = Game.playerConfig.filter(
            ({ key }) => key !== this.activePlayerKey
          );
          GameEvent.fire('gameEnd', {
            player: this.activePlayerKey,
            data: user,
          });
          this.setActivePlayerKey(nextPlayer?.key);
        }

        if (extraAction) {
          extraAction();
        }

        if (!isExtraMove) {
          GameEvent.fire('userEndMove');
          GameEvent.fire('nextTurn');
        }
      };

      if (directMove) {
        addMoveUserAnimation({
          currentPosition,
          newPosition,
          callback,
        });
      } else {
        Game.gameSounds.userMoveSound();
        new Array(newPosition.id - currentPosition.id)
          .fill(null)
          .forEach((_, index, { length }) => {
            const currentAnimationPosition = this.getCellById(
              currentPosition.id + index
            );
            const newAnimationPosition = this.getCellById(
              currentPosition.id + index + 1
            );
            if (!currentAnimationPosition || !newAnimationPosition) return;

            const isLastStep = index === length - 1;

            if (isLastStep) {
              addMoveUserAnimation({
                currentPosition: currentAnimationPosition,
                newPosition: newAnimationPosition,
                callback,
              });
            } else {
              addMoveUserAnimation({
                currentPosition: currentAnimationPosition,
                newPosition: newAnimationPosition,
              });
            }
          });
      }
    }
    this.playersOnCells = calcPlayersOnCells(Object.values(this.players));
  }
  addMoveUserAnimation = ({
    currentPosition,
    newPosition,
    callback = () => {},
  }: {
    currentPosition: Cell;
    newPosition: Cell;
    callback?: VoidFn;
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
          callback();

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

  showActivePlayerCloud = ({ label }: { label: string }) => {
    this.clouds.push(new Cloud({ fromUser: this.players[this.activePlayerKey], label }));
    setTimeout(() => {
      this.clouds.splice(this.clouds.length -1, 1);
    }, 3000);
  }

  createGameObjectsHandlers = (
    position: Cell
  ): { extraAction?: VoidFn; isExtraMove: boolean } => {
    const user = this.getActivePlayer();
    const positionId = position?.id;
    let isExtraMove = false;

    const handlers = this.gameObjects.reduce<VoidFn[]>((acc, object) => {
      const { fromId, toId, type, id } = object;

      const isPositionMatch = fromId === positionId;

      if (!isPositionMatch) return acc;

      const isSnakeNest = type === GameObjectTypes.snakesNest;
      const isSnake = type === GameObjectTypes.snake;
      const isLadder = type === GameObjectTypes.ladder;
      const praiseHands = type === GameObjectTypes.praiseHands;
      const moveToStart = type === GameObjectTypes.coffin;

      if (moveToStart) {
        isExtraMove = true;
        acc.push(() => {
          this.moveUser({ toId: 0, directMove: true });
          this.removeGameObject(id);
          Game.gameSounds.coffinSound();
          this.showActivePlayerCloud({ label: i18next.t('clouds.coffin') as string });
        });
        return acc;
      }

      if (isLadder) {
        isExtraMove = true;
        this.ladders++;
        const oneLadder = this.ladders === 1;
        acc.push(() => {
          this.moveUser({ toId, directMove: true });
          Game.gameSounds.ladderSound();

          if (oneLadder) {
            this.showActivePlayerCloud({ label: i18next.t('clouds.ladder') as string });
          }
        });
        return acc;
      }

      if (isSnake) {
        if (user.getAntidotesCount() > 0) {
          acc.push(() => {
            user.useAntidote();
            Game.gameSounds.usePraiseHandsSound();
            this.showActivePlayerCloud({ label: i18next.t('clouds.useAntidote') as string });
          });
          return acc;
        }

        isExtraMove = true;
        this.snakes++;
        acc.push(() => {
          this.moveUser({ toId, directMove: true });
          Game.gameSounds.snakeSound();

          if (this.snakes === 1) {
            this.showActivePlayerCloud({ label: i18next.t('clouds.snake') as string });
          }
        });
        return acc;
      }

      if (praiseHands) {
        acc.push(() => {
          user.addAntidote();
          this.removeGameObject(id);
          Game.gameSounds.getPraiseHandsSound();

          if (user.getAntidotesCount() <= 1) {
            this.showActivePlayerCloud({ label: i18next.t('clouds.antidote') as string });
          }
        });
        return acc;
      }

      if (isSnakeNest) {
        acc.push(() => {
          const snake = (object as SnakesNest).snake;
          this.gameObjects.push(snake);
          this.removeGameObject(id);
          snake.animate();
          Game.gameSounds.snakesNestSound();
        });
        return acc;
      }

      return acc;
    }, []);

    const extraAction = handlers.length
      ? () => {
          handlers.forEach((handler) => handler());
        }
      : undefined;

    return { extraAction, isExtraMove };
  };

  getCellById = (searchId: number) =>
    this.map.flat().find(({ id }) => id === searchId);
}
