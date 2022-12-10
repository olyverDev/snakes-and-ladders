import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { GAME_SOUNDS } from './components/AudioPlayer/constants';
import { PlayerConfig } from './game/Game';

export const useWindowResize = (callback: () => unknown) => {
  useLayoutEffect(() => {
    function updateSize() {
      callback();
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
};

const matchDistance = 0.1;

export const checkPointsMatch = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) < matchDistance;

export const normalizeVector = ({ x, y }: { x: number; y: number }) => {
  const length = Math.sqrt(x * x + y * y);
  return { x: x / length, y: y / length };
};

export type SoundKeyType = keyof typeof GAME_SOUNDS;
export type PlaySoundCallbacks = Record<SoundKeyType, () => void>;
export const useGameSounds = (): PlaySoundCallbacks => {
  const [audio] = useState(new Audio());

  const audioEffects = Object.entries(GAME_SOUNDS).reduce(
    (acc = {} as PlaySoundCallbacks, [key, value]) => ({
      ...acc,
      [key as SoundKeyType]: useCallback(() => {
        audio.pause();
        audio.setAttribute('src', value);
        audio.play();
      }, []) as () => void,
    }),
    {} as PlaySoundCallbacks
  );

  useEffect(() => {
    const onEnd = () => audio.pause();
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  return audioEffects;
};


export const SINGLE_PLAYER_CONFIG: PlayerConfig[] = [
  {
    key: 'player',
    imageName: 'userDanceBlack',
    automatic: false,
  },
  {
    key: 'bot',
    imageName: 'userDanceWhite',
    automatic: true,
  },
];

export const TWO_PLAYERS_CONFIG: PlayerConfig[] = [
  {
    key: 'player',
    imageName: 'userDanceBlack',
    automatic: false,
  },
  {
    key: 'player2',
    imageName: 'userDanceYellow',
    automatic: false,
  },
];

export const isPromoGameVersion = import.meta.env.VITE_IS_PROMO_GAME_VERSION === 'true';

export const getInitialPlayersConfig = () => isPromoGameVersion ? SINGLE_PLAYER_CONFIG : TWO_PLAYERS_CONFIG;

export enum Modals {
  GameRuleModal = 'gameRuleModal',
  EndGameModal = 'endGameModal',
  SelectGameModeModal = 'selectGameModeModal',
  PromoGreetingModal = 'promoGreetingModal',
  PromoEndGameModal = 'promoEndGameModal'
}

export const PROMO_VERSION_MODALS_LINKED_LIST = {
  [Modals.PromoGreetingModal]: {
    id: Modals.PromoGreetingModal,
    next: Modals.GameRuleModal,
    initial: true,
  },
  [Modals.GameRuleModal]: {
    id: Modals.GameRuleModal,
    next: null,
  },
  [Modals.PromoEndGameModal]: {
    id: Modals.PromoGreetingModal,
    next: Modals.SelectGameModeModal,
  },
  [Modals.SelectGameModeModal]: {
    id: Modals.GameRuleModal,
    next: null,
  },
};

export const DEFALT_MODALS_LINKED_LIST = {
  [Modals.GameRuleModal]: {
    id: Modals.GameRuleModal,
    next: Modals.SelectGameModeModal,
    initial: true,
  },
  [Modals.SelectGameModeModal]: {
    id: Modals.GameRuleModal,
    next: null,
  },
  [Modals.EndGameModal]: {
    id: Modals.EndGameModal,
    next: Modals.SelectGameModeModal,
  },
};

export const getInitialModalsLinkedList = () => isPromoGameVersion ? PROMO_VERSION_MODALS_LINKED_LIST : DEFALT_MODALS_LINKED_LIST;
