import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { GAME_SOUNDS } from './components/AudioPlayer/constants';
import { PlayerConfig } from './game/Game';
import { User } from './game/User';

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
export const useGameSounds = (muted: boolean): PlaySoundCallbacks => {
  const [audio] = useState(new Audio());

  const audioEffects = Object.entries(GAME_SOUNDS).reduce(
    (acc = {} as PlaySoundCallbacks, [key, value]) => ({
      ...acc,
      [key as SoundKeyType]: useCallback(() => {
        if (muted) {
          audio.pause();
          audio.muted = true;
          return;
        };
  
        audio.pause();
        audio.setAttribute('src', value);
        audio.volume = 0.6;
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

export const IS_PROMO_GAME_VERSION =
  import.meta.env.VITE_IS_PROMO_GAME_VERSION === 'true';

export const getInitialPlayersConfig = () =>
  IS_PROMO_GAME_VERSION ? SINGLE_PLAYER_CONFIG : TWO_PLAYERS_CONFIG;

export enum Modals {
  GameRuleModal = 'gameRuleModal',
  EndGameModal = 'endGameModal',
  SelectGameModeModal = 'selectGameModeModal',
  PromoGreetingModal = 'promoGreetingModal',
  PromoEndGameModal = 'promoEndGameModal',
  SoundCheckModal = 'soundCheckModal',
}

type ModalConfigListItemT = {
  id: Modals;
  next?: Modals | null;
  gameEnding?: boolean;
  initial?: boolean;
};
type ModalsLinkedListT = Record<string, ModalConfigListItemT>;

export const PROMO_VERSION_MODALS_LINKED_LIST: ModalsLinkedListT = {
  [Modals.PromoGreetingModal]: {
    id: Modals.PromoGreetingModal,
    next: Modals.GameRuleModal,
    initial: true,
  },
  [Modals.GameRuleModal]: {
    id: Modals.GameRuleModal,
    next: Modals.SoundCheckModal,
  },
  [Modals.PromoEndGameModal]: {
    id: Modals.PromoEndGameModal,
    next: null,
    gameEnding: true,
  },
  [Modals.SoundCheckModal]: {
    id: Modals.SoundCheckModal,
    next: null,
  },
};

export const DEFAULT_MODALS_LINKED_LIST: ModalsLinkedListT = {
  [Modals.GameRuleModal]: {
    id: Modals.GameRuleModal,
    next: Modals.SoundCheckModal,
    initial: true,
  },
  [Modals.SelectGameModeModal]: {
    id: Modals.SelectGameModeModal,
    next: null,
  },
  [Modals.EndGameModal]: {
    id: Modals.EndGameModal,
    next: null,
    gameEnding: true,
  },
  [Modals.SoundCheckModal]: {
    id: Modals.SoundCheckModal,
    next: Modals.SelectGameModeModal,
  },
};

export const RESTART_MODALS_LINKED_LIST: ModalsLinkedListT = {
  [Modals.SelectGameModeModal]: {
    id: Modals.SelectGameModeModal,
    next: null,
    initial: true,
  },
  [Modals.EndGameModal]: {
    id: Modals.EndGameModal,
    next: null,
    gameEnding: true,
  },
};

export const getInitialModalsLinkedList = (): ModalsLinkedListT =>
  IS_PROMO_GAME_VERSION
    ? PROMO_VERSION_MODALS_LINKED_LIST
    : DEFAULT_MODALS_LINKED_LIST;

export enum GameModeSelection {
  VsBot = 'vsBot',
  VsPlayer = 'vsPlayer',
}

export const calcPlayersOnCells = (players: User[]) => {
  const playersPositions = players.reduce(
    (positions, player) => ({
      ...positions,
      [player.position.id]: [
        ...(positions[player.position.id] || []),
        player?.name,
      ],
    }),
    {} as Record<number, Array<string | undefined>>
  );

  return players.reduce(
    (playersOnCells, player) => ({
      ...playersOnCells,
      [player.name]: playersPositions[player.position.id].indexOf(player.name),
    }),
    {} as Record<string, number>
  );
};

export const GAME_SIZE = 8;

export const isMobileBrowser = (): boolean => {
  // @ts-expect-error Property 'opera' does not exist on type 'Window & typeof globalThis'.
  const agent = navigator.userAgent || navigator.vendor || window.opera;

  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4));
};
