import { ChainInfo } from "@keplr-wallet/types";
import protobuf from "protobufjs";

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

export const ROOT_PROTO = protobuf.Root.fromJSON({
  nested: {
    cosmos: {
      nested: {
        tx: {
          nested: {
            v1beta1: {
              nested: {
                TxRaw: {
                  fields: {
                    bodyBytes: {
                      type: "bytes",
                      id: 1,
                    },
                    authInfoBytes: {
                      type: "bytes",
                      id: 2,
                    },
                    signatures: {
                      rule: "repeated",
                      type: "bytes",
                      id: 3,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
