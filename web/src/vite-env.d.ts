/// <reference types="vite/client" />

interface ImportMetaEnv {
  NODE_SERVER_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
