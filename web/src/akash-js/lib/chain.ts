import { RPC_ENDPOINT } from "@/lib/consts";
import { ChainInfo } from "@keplr-wallet/types";

export const AkashChainInfo: ChainInfo = {
  // Chain-id of the Osmosis chain.
  chainId: "akashnet-2",
  // The name of the chain to be displayed to the user.
  chainName: "Akash Network",
  // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
  rpc: RPC_ENDPOINT,
  // REST endpoint of the chain.
  rest: RPC_ENDPOINT,
  // Staking coin information
  // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
  // The 'stake' button in Keplr extension will link to the webpage.
  // walletUrlForStaking: "",
  // The BIP44 path.
  bip44: {
    // You can only set the coin type of BIP44.
    // 'Purpose' is fixed to 44.
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
  // List of all coin/tokens used in this chain.
  currencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: "akt",
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: "uakt",
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: "akt",
      // Actual denom (i.e. uosmo, uscrt) used by the blockchain.
      coinMinimalDenom: "uakt",
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: 6,
    },
  ],
};
