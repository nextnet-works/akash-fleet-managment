"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendManifest = void 0;
const https_1 = __importDefault(require("https"));
const rpc_1 = require("@akashnetwork/akashjs/build/rpc");
const query_1 = require("@akashnetwork/akashjs/build/protobuf/akash/provider/v1beta3/query");
const consts_1 = require("./consts");
const client_1 = require("./client");
const axios_1 = __importDefault(require("axios"));
async function sendManifest(leaseId) {
    try {
        const { certificate, sdl } = await (0, client_1.loadPrerequisites)(consts_1.RAW_SDL_T2);
        const { dseq, provider } = leaseId;
        const rpc = await (0, rpc_1.getRpc)(consts_1.RPC_ENDPOINT);
        const client = new query_1.QueryClientImpl(rpc);
        const request = query_1.QueryProviderRequest.fromPartial({
            owner: provider,
        });
        const tx = await client.Provider(request);
        if (!tx.provider) {
            return false;
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
        const response = await axios_1.default.put(`${uri.origin}${path}`, manifest, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Content-Length": manifest.length,
            },
            httpsAgent: agent,
        });
        if (response.status !== 200) {
            return false;
        }
        return true;
    }
    catch (error) {
        // const startTime = Date.now();
        // const timeout = 1000 * 60 * 10;
        // while (Date.now() - startTime < timeout) {
        //   console.log(`Waiting for deployment to start... (leaseId: ${leaseId})`);
        //   const status = await queryLeaseStatus(leaseId).catch((err) => {
        //     if (err.includes("Could not query lease status: 404")) {
        //       return undefined;
        //     }
        //     throw err;
        //   });
        //   if (status) {
        //     for (const [name, service] of Object.entries(status.services)) {
        //       if (service.uris) {
        //         console.log(`Service ${name} is available at:`, service.uris[0]);
        //         return;
        //       }
        //     }
        //   }
        //   // Wait 3 seconds before trying again
        //   await new Promise((resolve) => setTimeout(resolve, 3000));
        // }
        // throw new Error(`Could not start deployment. Timeout reached.`);
        return false;
    }
}
exports.sendManifest = sendManifest;
//# sourceMappingURL=manifest.js.map