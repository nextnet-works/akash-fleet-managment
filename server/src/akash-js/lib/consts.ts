export const RPC_ENDPOINT = "https://rpc.akashnet.net:443";
export const RAW_SDL_T1 = "./src/akash-js/assets/Mor-S-SDL-T1.yml";
export const RAW_SDL_T2 = "./src/akash-js/assets/Mor-S-SDL-T2.yml";
export const CERTIFICATE_PATH = "./src/akash-js/assets/cert.json";

// you can set this to a specific deployment sequence number to skip the deployment creation
export const DSEQ = 0;

export const RESOURCES_MORPHEUS = {
  cpu: 10 ^ 2,
  gpu: 1,
  memory: 10 ^ 8,
  storage: 10 ^ 11,
} as const;

export const DEPLOYMENT_RESOURCES = {
  ["Mor-S-SDL"]: RESOURCES_MORPHEUS,
} as const;
