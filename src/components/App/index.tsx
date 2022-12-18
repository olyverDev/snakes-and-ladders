import '@fontsource/nunito';
import '@fontsource/jost/300.css';

import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { AnalyticsEvent, logAnalyticsEvent } from '../../firebase';

import { GameImagesService } from '../../gameImagesService';
import GameComponent from '../GameComponent';
import Menu from '../Menu';
import './App.css';
import Game from '../../game';
import {
  DEFAULT_MODALS_LINKED_LIST,
  getInitialModalsLinkedList,
  getInitialPlayersConfig,
  Modals,
} from '../../utils';
import GameRuleModal from '../Modals/GameRuleModal';
import EndGameModal from '../Modals/EndGameModal';
import PromoGreetingModal from '../Modals/PromoGreetingModal';
import PromoEndGameModal from '../Modals/PromoEndGameModal';
import SelectGameModeModal from '../Modals/SelectGameModeModal';
import { GameEvent } from '../../game/GameEvent';
import { useTranslation } from 'react-i18next';

// FIXME: start game only after game mode selection and assigning needed players config OR greeting in promo mode
const players = getInitialPlayersConfig();
new Game(players);

function App() {
  const modalsLinkedListRef = useRef(getInitialModalsLinkedList());
  const availableModals = Object.keys(modalsLinkedListRef.current);
  const { loaded: imagesLoaded } = GameImagesService.useLoad();
  const [isGameEnd, setGameEnd] = useState(false);
  const initialActiveModalId = availableModals.find((key) =>
    Boolean(modalsLinkedListRef.current[key]?.initial)
  );
  const [activeModalId, setActiveModalId] = useState<string | null | undefined>();

  useEffect(() => {
    if (isGameEnd) {
      new Game(players);
      setGameEnd(false);
    }
  }, [isGameEnd]);

  const { t } = useTranslation();

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

  const closeModalFactory =
    (callback?: (result?: unknown) => unknown) => (result?: unknown) => {
      if (activeModalId) {
        setActiveModalId(modalsLinkedListRef.current[activeModalId]?.next);
      }

      if (callback) callback(result);
    };

  const handleCloseEndGameModal = closeModalFactory(() => {
    modalsLinkedListRef.current = DEFAULT_MODALS_LINKED_LIST;
    Game.playerConfig = players;
    setGameEnd(false);
  });

  const handleCloseSelectGameModeModal = closeModalFactory((result) => {
    // Game.playerConfig = players;
    // setGameEnd(false);
  });

  const SCREENS = useMemo(
    () => ({
      MENU: (
        <Menu
          loading={!imagesLoaded}
          onPlayPress={() => {
            logAnalyticsEvent(AnalyticsEvent.PressPlay);
            setCurrentRoute(SCREENS.GAME);
            setActiveModalId(initialActiveModalId);
          }}
        />
      ),
      GAME: (
        <GameComponent
          isGameEnd={isGameEnd}
        />
      ),
    }),
    [imagesLoaded, isGameEnd, setGameEnd]
  );
  const [currentRoute, setCurrentRoute] = useState<ReactElement>(SCREENS.MENU);
  useEffect(() => {
    setCurrentRoute(SCREENS.MENU);
  }, [SCREENS]);

  if (isGameEnd) return null;

  return (
    <>
      {activeModalId === Modals.GameRuleModal && (
        <GameRuleModal onClose={closeModalFactory()} />
      )}
      {activeModalId === Modals.SelectGameModeModal && (
        <SelectGameModeModal onClose={handleCloseSelectGameModeModal} />
      )}
      {activeModalId === Modals.PromoGreetingModal && (
        <PromoGreetingModal onClose={closeModalFactory()} />
      )}
      {activeModalId === Modals.EndGameModal && (
        <EndGameModal onClose={handleCloseEndGameModal} />
      )}
      {activeModalId === Modals.PromoEndGameModal && (
        <PromoEndGameModal isWinner onClose={closeModalFactory()} />
      )}
      <div className="App">{currentRoute}</div>;
    </>
  );
}

export default App;
