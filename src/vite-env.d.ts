/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GREEN_API_URL?: string;
  readonly VITE_GREEN_ID_INSTANCE?: string;
  readonly VITE_GREEN_API_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
