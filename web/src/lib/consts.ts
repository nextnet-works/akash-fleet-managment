export const queryKeys = {
  deployments: "deployments",
  close_deployment: "close_Deployment",
  create_deployment: "create_Deployment",
  approve_bid: "approve_bid",
  coin_price: "coin_price",
  last_block: "last_block",
  sdl: "sdl",
  dashboard: "dashboard",
  total_balance: "total_balance",
} as const;

export const BLOCK_TIME_MS = 6098; // MILISECONDS
export const MAIN_NET = "https://akash-api.polkachu.com";

export const green =
  "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
export const yellow =
  "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
export const red =
  "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";

export const CHAIN_ID = "akashnet-2";

export const RPC_ENDPOINT = "https://akash-api.polkachu.com";

export const sdls = [
  {
    name: "mor-1",
    file: {
      version: "2.0",
      services: {
        node: {
          image: "ghcr.io/akash-network/cosmos-omnibus:v0.4.16-akash-v0.34.1",
          env: [
            "MONIKER=my-moniker-1",
            "CHAIN_JSON=https://raw.githubusercontent.com/akash-network/net/main/mainnet/meta.json",
            "MINIMUM_GAS_PRICES=0.025uakt",
            "FASTSYNC_VERSION=v0",
            "P2P_POLKACHU=1",
            "STATESYNC_POLKACHU=1",
          ],
          expose: [
            {
              port: 26657,
              as: 80,
              to: [
                {
                  global: true,
                },
              ],
            },
            {
              port: 26656,
              to: [
                {
                  global: true,
                },
              ],
            },
          ],
        },
      },
      profiles: {
        compute: {
          node: {
            resources: {
              cpu: {
                units: 4,
              },
              memory: {
                size: "8Gi",
              },
              storage: {
                size: "100Gi",
              },
            },
          },
        },
        placement: {
          dcloud: {
            attributes: {
              host: "akash",
            },
            signedBy: {
              anyOf: ["akash1365yvmc4s7awdyj3n2sav7xfx76adc6dnmlx63"],
            },
            pricing: {
              node: {
                denom: "uakt",
                amount: 1000,
              },
            },
          },
        },
      },
      deployment: {
        node: {
          dcloud: {
            profile: "node",
            count: 1,
          },
        },
      },
    },
  },
];
