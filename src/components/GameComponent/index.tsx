import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AudioPlayer from '../AudioPlayer';
import Dice, { DiceRef } from '../Dice';
import Game from '../../game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import {
  getInitialPlayersConfig,
  Modals,
  getInitialModalsLinkedList,
  DEFALT_MODALS_LINKED_LIST,
  SINGLE_PLAYER_CONFIG,
  TWO_PLAYERS_CONFIG,
  useGameSounds,
  useWindowResize,
} from '../../utils';
import './GameComponent.css';
import { GameEvent } from '../../game/GameEvent';

import GameRuleModal from '../Modals/GameRuleModal';
import EndGameModal from '../Modals/EndGameModal';
import PromoGreetingModal from '../Modals/PromoGreetingModal';
import PromoEndGameModal from '../Modals/PromoEndGameModal';
import SelectGameModeModal from '../Modals/SelectGameModeModal';

// FIXME: start game only after game mode selectino and assigning needed players config OR greeting in promo mode
const Players = getInitialPlayersConfig();
new Game(Players);

function GameComponent() {
  const [history, setHistory] = useState([0]);
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const game = useMemo(() => Game.object, []);
  const gameSounds = useGameSounds();


  const [moving, setMoving] = useState(false);
  const [isGameEnd, setGameEnd] = useState(false);

  const modalsLinkedListRef = useRef(getInitialModalsLinkedList());
  const availableModals = Object.keys(modalsLinkedListRef.current);
  const initialActiveModalId = availableModals.find(key => Boolean(modalsLinkedListRef.current[key]?.initial));
  const [activeModalId, setActiveModalId] = useState<string | null | undefined>(initialActiveModalId);

  useEffect(() => {
    const eventId = GameEvent.addListener('gameEnd', (payload) => {
      alert(t('gameEndedForPlayer', { name: payload.player }));

      const realPlayers = Game.playerConfig.filter(player => !player.automatic);

      if (realPlayers.length === 0) {
        setGameEnd(true);
        const endGameModalId = availableModals.find(key => Boolean(modalsLinkedListRef.current[key]?.gameEnding));
        setActiveModalId(endGameModalId);
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


  const closeModalFactory = (callback?: (result?: unknown) => unknown) => (result?: unknown) => {
    if (activeModalId) {
      setActiveModalId(modalsLinkedListRef.current[activeModalId]?.next);
    }

    if (callback) callback(result);
  };

  const handleCloseEndGameModal = closeModalFactory(() => {
    // TODO: restart game properly
    modalsLinkedListRef.current = DEFALT_MODALS_LINKED_LIST;
    Game.playerConfig = Players;
    onResize();
    setGameEnd(false);
  });

  const handleCloseSelectGameModeModal = closeModalFactory((result) => {
    // TODO: restart game properly
    // modalsLinkedListRef.current = DEFALT_MODALS_LINKED_LIST;
    // const newPlayersConfig = result === 'vsBot' ? SINGLE_PLAYER_CONFIG : TWO_PLAYERS_CONFIG;
    // Game.playerConfig = newPlayersConfig;
    // onResize();
    // setGameEnd(false);
  });

  return (
    <div className="GameContainer">
      <div className="GameComponent">
        <canvas ref={canvasRef} className="Canvas" />
      </div>
      <div className="SideControls">
        <AudioPlayer />
        {!isGameEnd && <Dice disabled={moving} onRoll={onRoll} />}
      </div>

      {activeModalId === Modals.GameRuleModal && <GameRuleModal onClose={closeModalFactory()} />}
      {activeModalId === Modals.SelectGameModeModal && <SelectGameModeModal onClose={handleCloseSelectGameModeModal} />}
      {activeModalId === Modals.PromoGreetingModal && <PromoGreetingModal onClose={closeModalFactory()} />}
      {activeModalId === Modals.EndGameModal && <EndGameModal onClose={handleCloseEndGameModal} />}
      {activeModalId === Modals.PromoEndGameModal && <PromoEndGameModal isWinner onClose={closeModalFactory()} />}
    </div>
  );
}

export default GameComponent;
