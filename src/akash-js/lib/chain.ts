import { ChainInfo } from "@keplr-wallet/types";

export const AkashChainInfo: ChainInfo = {
  chainId: "akashnet-2",
  chainName: "akash",
  rpc: "https://rpc.akash.network",
  rest: "https://api.akashnet.net",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "akash",
    bech32PrefixAccPub: "akashpub",
    bech32PrefixValAddr: "akashvaloper",
    bech32PrefixValPub: "akashvaloperpub",
    bech32PrefixConsAddr: "akashvalcons",
    bech32PrefixConsPub: "akashvalconspub",
  },
  currencies: [
    {
      coinDenom: "AKT",
      coinMinimalDenom: "uakt",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "AKT",
      coinMinimalDenom: "uakt",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.025,
        average: 0.03,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: "AKT",
    coinMinimalDenom: "uakt",
    coinDecimals: 6,
  },
  features: ["stargate", "ibc-transfer"],
};
