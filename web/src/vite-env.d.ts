/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_SERVER: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
