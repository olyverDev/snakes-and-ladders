/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_PROMO_GAME_VERSION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
