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
import { useTranslation } from 'react-i18next';
import SoundCheckModal from '../Modals/SoundCheckModal';

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


  const { t } = useTranslation();

  const getInitialModalId = () => {
    const availableModals = Object.keys(modalsLinkedListRef.current);

    return availableModals.find((key) =>
      Boolean(modalsLinkedListRef.current[key]?.initial)
    );
  }

  useEffect(() => {
    const eventId = GameEvent.addListener('gameEnd', (payload) => {
      const realPlayers = Game.playerConfig.filter(player => !player.automatic);

      if (realPlayers.length <= 1) {
        logAnalyticsEvent(AnalyticsEvent.Finish);

        const availableModals = Object.keys(modalsLinkedListRef.current);
        const endGameModalId = availableModals.find(key => Boolean(modalsLinkedListRef.current[key]?.gameEnding));
        setActiveModalId(endGameModalId);

        if (IS_PROMO_GAME_VERSION && realPlayers.length === 0)  setPromoWin(true);
      }
    });

    return () => {
      GameEvent.removeListener(eventId);
    };
  }, []);

  const [muted, setMuted] = useState(false);

  const SCREENS = useMemo(
    () => ({
      [Screens.Menu]: (
        <Menu
          loading={!imagesLoaded}
          onPlayPress={() => {
            logAnalyticsEvent(AnalyticsEvent.PressPlay);
            setActiveModalId(getInitialModalId());
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
  });

  return (
    <div className="App">
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
      {currentScreen && <div className="GameWrapper">{SCREENS[currentScreen]}</div>}
    </div>
  );
}

export default App;
