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

export const RPC_ENDPOINT = "https://akash-api.polkachu.com/akash";

export const sdls = [
  {
    name: "grafana-cpu-2vcpu-4gram-small",
    file: {
      version: 2.0,
      profiles: {
        compute: {
          grafana: {
            resources: {
              cpu: { units: 2 },
              memory: { size: "4Gi" },
              storage: [{ size: "64GB" }],
            },
          },
        },
        placement: {
          akash: {
            pricing: { grafana: { denom: "uakt", amount: 10000 } },
            attributes: { host: "akash" },
          },
        },
      },
      services: {
        grafana: {
          image: "grafana/grafana",
          expose: [{ as: 80, to: [{ global: true }], port: 3000 }],
        },
      },
      deployment: { grafana: { akash: { count: 1, profile: "grafana" } } },
    },
  },
  {
    name: "mining-rig-cpu-16vcpu-24gram-small",
    file: {
      version: "2.0",
      profiles: {
        compute: {
          "miner-xmrig": {
            resources: {
              cpu: { units: 16 },
              memory: { size: "24Gi" },
              storage: { size: "64Gi" },
            },
          },
        },
        placement: {
          akash: {
            pricing: { "miner-xmrig": { denom: "uakt", amount: 10000 } },
          },
        },
      },
      services: {
        "miner-xmrig": {
          env: [
            "ALGO=rx/0",
            "POOL=gulf.moneroocean.stream:20032",
            "WALLET=ZEPHYR2fAsLTnJG9v94FeHF6JaiZhnxH3bq5YkYYfQM8T7gfRW34T81jJPwNJtPyvPHhRsgFdbkGtcaNeGX4HiYH2d84FzMGcwv1y",
            "WORKER=akash",
            "PASS=x",
            "TLS=true",
            "TLS_FINGERPRINT=",
            "RANDOMX_MODE=fast",
            "CUSTOM_OPTIONS=",
            "AKASH_PROVIDER_STARTUP_CHECK=true",
          ],
          image: "cryptoandcoffee/akash-xmrig:40",
          expose: [
            { as: 80, to: [{ global: true }], port: 8080, proto: "tcp" },
          ],
        },
      },
      deployment: {
        "miner-xmrig": { akash: { count: 1, profile: "miner-xmrig" } },
      },
    },
  },
];
