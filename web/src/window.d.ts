import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {
    getWorker: (moduleId: string, label: string) => void;
  }
}
