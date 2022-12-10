import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AudioPlayer from '../AudioPlayer';
import Dice, { DiceRef } from '../Dice';
import Game from '../../game';
import { PlayerConfig } from '../../game/Game';
import { Cell } from '../../game/Cell';
import { gameLoopFactory } from '../../gameLoop';
import {
  getInitialPlayersConfig,
  isPromoGameVersion,
  Modals,
  getInitialModalsLinkedList,
  PROMO_VERSION_MODALS_LINKED_LIST,
  DEFALT_MODALS_LINKED_LIST,
  SINGLE_PLAYER_CONFIG,
  TWO_PLAYERS_CONFIG,
  useGameSounds,
  useWindowResize,
} from '../../utils';
import './GameComponent.css';
import GameRuleModal from '../GameRuleModal';
import EndGameModal from '../EndGameModal';
import PromoGreetingModal from '../PromoGreetingModal';
import { GameEvent } from '../../game/GameEvent';
import { useTranslation } from 'react-i18next';
import PromoEndGameModal from '../PromoEndGameModal';
import SelectGameModeModal from '../SelectGameModeModal';

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

  const [modalsLinkedList, setModalsLinkedList] = useState(getInitialModalsLinkedList());
  const initialActiveModal = Object.keys(modalsLinkedList).find(key => Boolean(modalsLinkedList[key].initial));
  const [activeModal, setActiveModal] = useState<Modals | null | undefined>(initialActiveModal);

  useEffect(() => {
    const eventId = GameEvent.addListener('gameEnd', (payload) => {
      alert(t('gameEndedForPlayer', { name: payload.player }));

      const realPlayers = Game.playerConfig.filter(player => !player.automatic);

      if (realPlayers.length === 0) {
        setGameEnd(true);
        setActiveModal(isPromoGameVersion ? Modals.PromoEndGameModal : Modals.EndGameModal);
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
    if (activeModal && modalsLinkedList[activeModal]) {
      setActiveModal(modalsLinkedList[activeModal]?.next);
    }

    if (callback) callback(result);
  };

  const handleCloseEndGameModal = closeModalFactory(() => {
    // TODO: restart game properly
    setModalsLinkedList(DEFALT_MODALS_LINKED_LIST);
    Game.playerConfig = Players;
    onResize();
    setGameEnd(false);
  });

  const handleCloseSelectGameModeModal = closeModalFactory((result) => {
    // TODO: restart game properly
    setModalsLinkedList(DEFALT_MODALS_LINKED_LIST);
    const newPlayersConfig = result === 'vsBot' ? SINGLE_PLAYER_CONFIG : TWO_PLAYERS_CONFIG;
    Game.playerConfig = newPlayersConfig;
    onResize();
    setGameEnd(false);
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

      {activeModal === Modals.GameRuleModal && <GameRuleModal onClose={closeModalFactory()} />}
      {activeModal === Modals.EndGameModal && <EndGameModal onClose={handleCloseEndGameModal} />}
      {activeModal === Modals.PromoGreetingModal && <PromoGreetingModal onClose={closeModalFactory()} />}
      {activeModal === Modals.PromoEndGameModal && <PromoEndGameModal isWinner onClose={closeModalFactory()} />}
      {activeModal === Modals.SelectGameModeModal && <SelectGameModeModal onClose={handleCloseSelectGameModeModal} />}
    </div>
  );
}

export default GameComponent;
