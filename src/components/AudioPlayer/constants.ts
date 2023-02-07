import coffinSound from '../../assets/coffin.mp3';
import getPraiseHandsSound from '../../assets/get_praise_hands.mp3';
import ladderSound from '../../assets/ladder.mp3';
import snakeSound from '../../assets/snake.mp3';
import snakesNestSound from '../../assets/snakes_nest.mp3';
import usePraiseHandsSound from '../../assets/use_praise_hands.mp3';
import userMoveSound from '../../assets/user_move.mp3';
import { IS_PROMO_GAME_VERSION } from '../../utils';

export enum Platform {
  Soundcloud = 'soundcloud',
  Youtube = 'youtube',
  Chill = 'chill',
}

const PLATFORMS_CONFIG = {
  soundcloud: {
    id: Platform.Soundcloud,
    label: 'SoundCloud',
    url: import.meta.env.VITE_SOUNDCLOUD_URL,
  },
  youtube: {
    id: Platform.Youtube,
    label: 'YouTube',
    url: import.meta.env.VITE_YOUTUBE_URL,
  },
  chill: {
    id: Platform.Chill,
    label: 'Chill',
    url: import.meta.env.VITE_YOUTUBE_URL_CHILL,
  },
};

const USED_PLATFORMS: (keyof typeof PLATFORMS_CONFIG)[] = IS_PROMO_GAME_VERSION ? ['youtube', 'soundcloud', 'chill'] : ['youtube', 'soundcloud'];

export const PLATFORMS: Record<
  Platform,
  { id: Platform; label: string; url: string }
> = USED_PLATFORMS.reduce(
  (acc, platform) => {
    if (PLATFORMS_CONFIG[platform]) {
      acc[platform] = PLATFORMS_CONFIG[platform];
    }
    return acc;
  },
  Object.create(null),
);

export const GAME_SOUNDS = {
  coffinSound,
  getPraiseHandsSound,
  ladderSound,
  snakeSound,
  snakesNestSound,
  usePraiseHandsSound,
  userMoveSound,
};
