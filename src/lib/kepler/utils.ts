import { Keplr } from "@keplr-wallet/types";
import { CHAIN_ID } from "../consts";

export const getKeplrFromWindow: () => Promise<
  Keplr | undefined
> = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

export const getKeplerAccounts = async () => {
  if (!window.keplr) {
    alert("Please install keplr extension");
    return [];
  }
  await window.keplr.enable(CHAIN_ID);
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);

  return await offlineSigner.getAccounts();
};
