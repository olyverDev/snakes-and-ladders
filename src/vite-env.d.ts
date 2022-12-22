/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_PROMO_GAME_VERSION: string;
  readonly VITE_SOUNDCLOUD_URL: string;
  readonly VITE_YOUTUBE_URL: string;
  readonly VITE_YOUTUBE_URL_CHILL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
