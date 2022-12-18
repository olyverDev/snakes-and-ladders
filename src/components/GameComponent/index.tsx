import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice, { DiceRef } from '../Dice';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import {
  useGameSounds,
  useWindowResize,
} from '../../utils';
import './GameComponent.css';
import { GameEvent } from '../../game/GameEvent';

import { PlayerConfig } from '../../game/Game';

type GameComponentPropsType = {
  players: PlayerConfig[];
  isGameEnd: boolean;
};

function GameComponent({
  isGameEnd,
}: GameComponentPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => Game.object, []);
  const gameSounds = useGameSounds();

  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const userStartMoveId = GameEvent.addListener('userStartMove', () => {
      setMoving(true);
    });
    const userEndMoveId = GameEvent.addListener('userEndMove', () => {
      setMoving(false);
    });

    return () => {
      GameEvent.removeListener(userStartMoveId);
      GameEvent.removeListener(userEndMoveId);
    };
  }, []);

  useEffect(() => {
    const eventId = GameEvent.addListener('nextTurn', () => {
      const turnIndex = Game.playerConfig
        .map((p) => p.key)
        .indexOf(game.activePlayerKey);
      const isLastPlayer = turnIndex === Game.playerConfig.length - 1;
      const nextIndex = isLastPlayer ? 0 : turnIndex + 1;
      const nextPlayer = Game.playerConfig[nextIndex];
      game.setActivePlayerKey(nextPlayer.key);

      const realPlayers = Game.playerConfig.filter(
        (player) => !player.automatic
      );

      if (realPlayers.length === 0) {
        // NOTE: no need to roll dice as only bots left
        return;
      }

      if (nextPlayer.automatic && DiceRef.current) {
        DiceRef.current?.rollDice();
      }
    });

    return () => {
      GameEvent.removeListener(eventId);
    };
  }, []);

  useEffect(() => {
    if (!game || game.loopInitialized) return;
    const gameLoop = gameLoopFactory([game.update, game.render]);
    window.requestAnimationFrame(() => {
      gameLoop(window.performance.now());
    });
    game.loopInitialized = true;
  }, [game]);

  const onRoll = useCallback((countMoves: number) => {
    GameEvent.fire('userStartMove');
    game.moveUser({ countMoves });
  }, []);

  const onResize = useCallback(() => {
    if (canvasRef.current && game) {
      const canvasSize = canvasRef.current.scrollWidth;
      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;
      Cell.cellSize = canvasSize / game.size;
    }
  }, [game]);

  useEffect(() => {
    if (game.isInitialized || !canvasRef.current || !game || !gameSounds)
      return;
    game.init(canvasRef.current, gameSounds);
  }, [gameSounds]);

  useWindowResize(onResize);

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        <canvas ref={canvasRef} className="Canvas" />
      </div>
      <div className="SideControls">
        <AudioPlayer />
        {!isGameEnd && <Dice disabled={moving} onRoll={onRoll} />}
      </div>
    </div>
  );
}

export default GameComponent;
