import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AudioPlayer from '../AudioPlayer';
import Dice, { DiceRef } from '../Dice';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import { isMobileBrowser, useGameSounds, useWindowResize } from '../../utils';
import './GameComponent.css';
import { GameEvent } from '../../game/GameEvent';
import { Cloud } from '../../game/Cloud';

function GameComponent({ muted }: { muted: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => Game.object, []);
  const gameSounds = useGameSounds(muted);
  const { t } = useTranslation();

  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const eventId = GameEvent.addListener('gameEnd', (payload) => {
      game.clouds.push(new Cloud({ fromUser: game.players[game.activePlayerKey], label: t('clouds.finish') as string }));
    });

    return () => {
      GameEvent.removeListener(eventId);
    };
  }, []);

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

  const [botLabel, setBotLabel] = useState('');

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

      // NOTE: no need to roll dice as only bots left
      if (realPlayers.length === 0) return;

      if (nextPlayer.automatic && DiceRef.current) {
        const botLabel = t('dice.bot');
        setBotLabel(botLabel);
        DiceRef.current?.rollDice();
      } else {
        setBotLabel('');
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
      const canvasSize = isMobileBrowser()
        ? canvasRef.current.scrollWidth * 2
        : canvasRef.current.scrollWidth;
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
        <AudioPlayer muted={muted} />
        <Dice botLabel={botLabel} muted={muted} disabled={moving} onRoll={onRoll} />
      </div>
    </div>
  );
}

export default GameComponent;
