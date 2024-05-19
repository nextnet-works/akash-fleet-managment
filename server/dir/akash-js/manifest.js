"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendManifest = void 0;
const https_1 = __importDefault(require("https"));
const rpc_1 = require("@akashnetwork/akashjs/build/rpc");
const v1beta3_1 = require("@akashnetwork/akash-api/akash/provider/v1beta3");
const consts_1 = require("./lib/consts");
const client_1 = require("./client");
const axios_1 = __importDefault(require("axios"));
const lease_1 = require("./lease");
async function sendManifest(leaseId) {
  try {
    const { certificate, sdl } = await (0, client_1.loadPrerequisites)(
      consts_1.RAW_SDL_T2,
    );
    const { dseq, provider } = leaseId;
    const rpc = await (0, rpc_1.getRpc)(consts_1.RPC_ENDPOINT);
    const client = new v1beta3_1.QueryClientImpl(rpc);
    const request = v1beta3_1.QueryProviderRequest.fromPartial({
      owner: provider,
    });
    const tx = await client.Provider(request);
    if (!tx.provider) {
      return { serviceUris: [] };
    }
    const providerInfo = tx.provider;
    const manifest = sdl.manifestSortedJSON();
    const path = `/deployment/${dseq}/manifest`;
    const uri = new URL(providerInfo.hostUri);
    // Axios configuration for HTTPS with a custom agent
    const agent = new https_1.default.Agent({
      cert: certificate.csr,
      key: certificate.privateKey,
      rejectUnauthorized: false,
    });
    await axios_1.default.put(`${uri.origin}${path}`, manifest, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Length": manifest.length.toString(),
      },
      httpsAgent: agent,
    });
    const leaseStatus = await (0, lease_1.queryLeaseStatus)(leaseId);
    const { servicesUri, ports } = await (0, lease_1.queryLeaseServices)(
      leaseId,
    );
    return {
      servicesUri,
      uri,
      ports,
      lease: leaseStatus,
    };
  } catch (error) {
    console.error(error);
    return {
      serviceUris: [],
    };
  }
}
exports.sendManifest = sendManifest;
//# sourceMappingURL=manifest.js.map
