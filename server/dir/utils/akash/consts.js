"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEPLOYMENT_RESOURCES =
  exports.RESOURCES_MORPHEUS =
  exports.DSEQ =
  exports.CERTIFICATE_PATH =
  exports.RAW_SDL_T2 =
  exports.RAW_SDL_T1 =
  exports.RPC_ENDPOINT =
    void 0;
exports.RPC_ENDPOINT = "https://rpc.akashnet.net:443";
exports.RAW_SDL_T1 = "./src/utils/akash/assets/Mor-S-SDL-T1.yml";
exports.RAW_SDL_T2 = "./src/utils/akash/assets/Mor-S-SDL-T2.yml";
exports.CERTIFICATE_PATH = "./src/utils/akash/assets/cert.json";
// you can set this to a specific deployment sequence number to skip the deployment creation
exports.DSEQ = 0;
exports.RESOURCES_MORPHEUS = {
  cpu: 10 ^ 2,
  gpu: 1,
  memory: 10 ^ 8,
  storage: 10 ^ 11,
};
exports.DEPLOYMENT_RESOURCES = {
  MORPHEUS: exports.RESOURCES_MORPHEUS,
};
//# sourceMappingURL=consts.js.map
