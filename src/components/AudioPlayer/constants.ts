import coffinSound from '../../assets/coffin.mp3';
import getPraiseHandsSound from '../../assets/get_praise_hands.mp3';
import ladderSound from '../../assets/ladder.mp3';
import snakeSound from '../../assets/snake.mp3';
import snakesNestSound from '../../assets/snakes_nest.mp3';
import usePraiseHandsSound from '../../assets/use_praise_hands.mp3';
import userMoveSound from '../../assets/user_move.mp3';

export enum Platform {
  Soundcloud = 'soundcloud',
  Youtube = 'youtube',
  Chill = 'chill',
}

export const PLATFORMS: Record<
  Platform,
  { id: Platform; label: string; url: string }
> = {
  soundcloud: {
    id: Platform.Soundcloud,
    label: 'SoundCloud',
    url: 'https://soundcloud.com/lofi_girl/sets/lofi-hiphop',
  },
  youtube: {
    id: Platform.Youtube,
    label: 'YouTube',
    url: '',
  },
  chill: {
    id: Platform.Chill,
    label: 'Chill',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
};
export const GAME_SOUNDS = {
  coffinSound,
  getPraiseHandsSound,
  ladderSound,
  snakeSound,
  snakesNestSound,
  usePraiseHandsSound,
  userMoveSound,
};
