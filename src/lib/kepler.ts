import { CHAIN_ID } from "./consts";

export const getKeplerAccounts = async () => {
  if (!window.keplr) {
    alert("Please install keplr extension");
    return [];
  }
  await window.keplr.enable(CHAIN_ID);
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);

  return await offlineSigner.getAccounts();
};
