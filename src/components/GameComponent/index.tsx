import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice, { DiceRef } from '../Dice';
import Game from '../../game';
import { PlayerConfig } from '../../game/Game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import { getInitialPlayersConfig, useGameSounds, useWindowResize } from '../../utils';
import './GameComponent.css';
import GameRuleModal from '../GameRuleModal';
import { GameEvent } from '../../game/GameEvent';

const Players = getInitialPlayersConfig();

new Game(Players);

enum Modals {
  GameRuleModal = 'gameRuleModal',
}

const ModalsLinkedList = {
  [Modals.GameRuleModal]: {
    id: Modals.GameRuleModal,
    next: null,
  },
};

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => Game.object, []);
  const gameSounds = useGameSounds();

  const [activeModal, setActiveModal] = useState<Modals | null>(Modals.GameRuleModal);

  const handleCloseRulesModal = () => {
    setActiveModal(ModalsLinkedList[Modals.GameRuleModal].next);
  };

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
      const turnIndex = Players.map(p => p.key).indexOf(game.activePlayerKey);
      const isLastPlayer = turnIndex === Players.length - 1;
      const nextIndex = isLastPlayer ? 0 : turnIndex + 1;
      const nextPlayer = Players[nextIndex];
      game.setActivePlayerKey(nextPlayer.key);

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

  const onRoll = useCallback(
    (countMoves: number) => {
      GameEvent.fire('userStartMove');
      setHistory((previous) => [...previous, countMoves]);
      game.moveUser({ countMoves });
    },
    [],
  );

  const onResize = useCallback(() => {
    if (canvasRef.current && game) {
      const canvasSize = canvasRef.current.scrollWidth;
      canvasRef.current.width = canvasSize;
      canvasRef.current.height = canvasSize;
      Cell.cellSize = canvasSize / game.size;
    }
  }, [game]);

  useEffect(() => {
    if (game.isInitialized || !canvasRef.current || !game || !gameSounds) return;
    game.init(canvasRef.current, gameSounds);
    onResize();
  }, [onResize, gameSounds]);

  useWindowResize(onResize);

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        <canvas ref={canvasRef} className="Canvas" />
      </div>
      <div className="SideControls">
        <AudioPlayer />
        <Dice disabled={moving} onRoll={onRoll} />
      </div>

      {activeModal === Modals.GameRuleModal && <GameRuleModal onClose={handleCloseRulesModal} />}
    </div>
  );
}

export default GameComponent;
