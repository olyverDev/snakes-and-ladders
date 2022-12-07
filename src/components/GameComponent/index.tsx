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
import EndGameModal from '../EndGameModal';
import { GameEvent } from '../../game/GameEvent';
import { useTranslation } from 'react-i18next';

const Players = getInitialPlayersConfig();

new Game(Players);

enum Modals {
  GameRuleModal = 'gameRuleModal',
  EndGameModal = 'endGameModal',
}

const ModalsLinkedList = {
  [Modals.GameRuleModal]: {
    id: Modals.GameRuleModal,
    next: null,
  },
  [Modals.EndGameModal]: {
    id: Modals.EndGameModal,
    next: null,
  },
};

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => Game.object, []);
  const gameSounds = useGameSounds();

  const [activeModal, setActiveModal] = useState<Modals | null>(Modals.GameRuleModal);

  const [moving, setMoving] = useState(false);
  const [isGameEnd, setGameEnd] = useState(false);


  useEffect(() => {
    const eventId = GameEvent.addListener('gameEnd', (payload) => {
      alert(t('endGame.forPlayer', { name: payload.player }));

      const realPlayers = Game.playerConfig.filter(player => !player.automatic);

      if (realPlayers.length === 0) {
        setGameEnd(true);
        setActiveModal(Modals.EndGameModal);
      }
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

  useEffect(() => {
    const eventId = GameEvent.addListener('nextTurn', () => {
      const turnIndex = Game.playerConfig.map(p => p.key).indexOf(game.activePlayerKey);
      const isLastPlayer = turnIndex === Game.playerConfig.length - 1;
      const nextIndex = isLastPlayer ? 0 : turnIndex + 1;
      const nextPlayer = Game.playerConfig[nextIndex];
      game.setActivePlayerKey(nextPlayer.key);

      const realPlayers = Game.playerConfig.filter(player => !player.automatic);

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

  const handleCloseRulesModal = () => {
    setActiveModal(ModalsLinkedList[Modals.GameRuleModal].next);
  };

  const handleCloseEndGameModal = () => {
    setActiveModal(ModalsLinkedList[Modals.EndGameModal].next);
    // TODO: restart game properly
    Game.playerConfig = Players;
    onResize();
    setGameEnd(false);
  };

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        <canvas ref={canvasRef} className="Canvas" />
      </div>
      <div className="SideControls">
        <AudioPlayer />
        {!isGameEnd && <Dice disabled={moving} onRoll={onRoll} />}
      </div>

      {activeModal === Modals.GameRuleModal && <GameRuleModal onClose={handleCloseRulesModal} />}
      {activeModal === Modals.EndGameModal && <EndGameModal onClose={handleCloseEndGameModal} />}
    </div>
  );
}

export default GameComponent;
