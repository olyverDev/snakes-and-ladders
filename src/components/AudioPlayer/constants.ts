export enum Platform {
  Soundcloud = 'soundcloud',
  Youtube = 'youtube',
  Chill = 'chill',
}

export const PLATFORMS: Record<Platform, { id: Platform; label: string; url: string }> = {
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
  }
};
