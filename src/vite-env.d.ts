/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OFICINA_PASSCODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
