import '@fontsource/nunito';
import '@fontsource/jost/300.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnalyticsEvent, logAnalyticsEvent } from '../../firebase';

import { GameImagesService } from '../../gameImagesService';
import GameComponent from '../GameComponent';
import Menu from '../Menu';
import './App.css';
import Game from '../../game';
import {
  GameModeSelection,
  getInitialModalsLinkedList,
  getInitialPlayersConfig,
  IS_PROMO_GAME_VERSION,
  Modals,
  RESTART_MODALS_LINKED_LIST,
  SINGLE_PLAYER_CONFIG,
  TWO_PLAYERS_CONFIG,
} from '../../utils';
import GameRuleModal from '../Modals/GameRuleModal';
import EndGameModal from '../Modals/EndGameModal';
import PromoGreetingModal from '../Modals/PromoGreetingModal';
import PromoEndGameModal from '../Modals/PromoEndGameModal';
import SelectGameModeModal from '../Modals/SelectGameModeModal';
import { GameEvent } from '../../game/GameEvent';
import SoundCheckModal from '../Modals/SoundCheckModal';
import LanguageSwitcher from './LanguageSwitcher';
import PromoLeaveModal from '../Modals/PromoLeaveModal';

enum Screens {
  Menu = 'menu',
  Game = 'game',
}

function App() {
  const modalsLinkedListRef = useRef(getInitialModalsLinkedList());
  const { loaded: imagesLoaded } = GameImagesService.useLoad();
  const [isGameEnd, setGameEnd] = useState(false);
  const [activeModalId, setActiveModalId] = useState<string | null | undefined>();
  const [isPromoWin, setPromoWin] = useState<boolean>(false);
  const [leaveAttempt, setLeaveAttempt] = useState<boolean>(false);

  const getInitialModalId = () => {
    const availableModals = Object.keys(modalsLinkedListRef.current);

    return availableModals.find((key) =>
      Boolean(modalsLinkedListRef.current[key]?.initial)
    );
  }

  useEffect(() => {
    if (!IS_PROMO_GAME_VERSION) return;

    const listener = (event: BeforeUnloadEvent) => {
      logAnalyticsEvent(AnalyticsEvent.TryToLeave);

      if (!leaveAttempt && !isGameEnd && activeModalId !== Modals.PromoEndGameModal) {
        event.preventDefault();
        event.returnValue = '';

        if (modalsLinkedListRef.current) {
          modalsLinkedListRef.current[Modals.PromoLeaveModal] = {
            id: Modals.PromoLeaveModal,
            next: activeModalId ? modalsLinkedListRef.current[activeModalId]?.next : null,
          };
        }

        setActiveModalId(Modals.PromoLeaveModal);
        setLeaveAttempt(true);
      }
    };
  
    window.addEventListener('beforeunload', listener);

    return () => {
      window.removeEventListener('beforeunload', listener);
    }
  }, [activeModalId, leaveAttempt]);

  useEffect(() => {
    const eventId = GameEvent.addListener('gameEnd', (payload) => {
      const realPlayers = Game.playerConfig.filter(player => !player.automatic);

      if (realPlayers.length <= 1) {
        logAnalyticsEvent(AnalyticsEvent.Finish);

        const availableModals = Object.keys(modalsLinkedListRef.current);
        const endGameModalId = availableModals.find(key => Boolean(modalsLinkedListRef.current[key]?.gameEnding));

        setTimeout(() => {
          setActiveModalId(endGameModalId);
        }, 1000);

        if (IS_PROMO_GAME_VERSION && realPlayers.length === 0)  setPromoWin(true);
      }
    });

    return () => {
      GameEvent.removeListener(eventId);
    };
  }, []);

  const [isGameStarted, setGameStarted]  = useState(false);
  const [muted, setMuted] = useState(false);

  const SCREENS = useMemo(
    () => ({
      [Screens.Menu]: (
        <Menu
          loading={!imagesLoaded}
          onPlayStart={() => {
            logAnalyticsEvent(AnalyticsEvent.PlayStart, { promo: IS_PROMO_GAME_VERSION });
            setActiveModalId(getInitialModalId());
            setGameStarted(true);
          }}
        />
      ),
      [Screens.Game]: isGameEnd ? null : <GameComponent muted={muted} />,
    }),
    [imagesLoaded, isGameEnd, muted]
  );

  const [currentScreen, setCurrentScreen] = useState<Screens | null>(Screens.Menu);

  const closeModalFactory =
    (callback?: (result?: unknown) => unknown) => (result?: unknown) => {
      if (activeModalId) {
        setActiveModalId(modalsLinkedListRef.current[activeModalId]?.next);
      }

      if (callback) callback(result);
    };

  const handleCloseSoundCheckModal = closeModalFactory((withSound) => {
    setMuted(!withSound);

    if (modalsLinkedListRef.current?.[Modals.SoundCheckModal]?.next) return;

    new Game(getInitialPlayersConfig());
    setCurrentScreen(Screens.Game);
  });

  const handleCloseSelectGameModeModal = closeModalFactory((gameModeResponse) => {
    const players = gameModeResponse === GameModeSelection.VsBot ? SINGLE_PLAYER_CONFIG : TWO_PLAYERS_CONFIG;
    new Game(players);
    setCurrentScreen(Screens.Game);

    if (isGameEnd) setGameEnd(false);
  });

  const handleCloseEndGameModal = closeModalFactory(() => {
    setGameEnd(true);
    setCurrentScreen(null);
    modalsLinkedListRef.current = RESTART_MODALS_LINKED_LIST;
    setActiveModalId(getInitialModalId());
    logAnalyticsEvent(AnalyticsEvent.CloseEndGameModal);
  });

  const handleClosePromoLeaveModal = closeModalFactory(() => {
    logAnalyticsEvent(AnalyticsEvent.ClosePromoLeaveModal);
  });

  return (
    <div className="App">
      {isGameStarted && <LanguageSwitcher />}
      {activeModalId === Modals.GameRuleModal && (
        <GameRuleModal onClose={closeModalFactory()} />
      )}
      {activeModalId === Modals.SoundCheckModal && (
        <SoundCheckModal onClose={handleCloseSoundCheckModal} />
      )}
      {activeModalId === Modals.SelectGameModeModal && (
        <SelectGameModeModal onClose={handleCloseSelectGameModeModal} />
      )}
      {activeModalId === Modals.EndGameModal && (
        <EndGameModal onClose={handleCloseEndGameModal} />
      )}
      {activeModalId === Modals.PromoGreetingModal && (
        <PromoGreetingModal onClose={closeModalFactory()} />
      )}
      {activeModalId === Modals.PromoEndGameModal && (
        <PromoEndGameModal isWinner={isPromoWin} onClose={handleCloseEndGameModal} />
      )}
      {activeModalId === Modals.PromoLeaveModal && (
        <PromoLeaveModal onClose={handleClosePromoLeaveModal} />
      )}
      {currentScreen && <div className="GameWrapper">{SCREENS[currentScreen]}</div>}
    </div>
  );
}

export default App;
