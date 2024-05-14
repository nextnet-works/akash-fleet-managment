import https from "https";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";

import {
  QueryClientImpl as QueryProviderClient,
  QueryProviderRequest,
} from "@akashnetwork/akash-api/akash/provider/v1beta3";

import { RAW_SDL_T2, RPC_ENDPOINT } from "./consts";
import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta3";
import { loadPrerequisites } from "./client";
import axios from "axios";

export async function sendManifest(leaseId: BidID) {
  try {
    const { certificate, sdl } = await loadPrerequisites(RAW_SDL_T2);
    const { dseq, provider } = leaseId;
    const rpc = await getRpc(RPC_ENDPOINT);
    const client = new QueryProviderClient(rpc);
    const request = QueryProviderRequest.fromPartial({
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
    const agent = new https.Agent({
      cert: certificate.csr,
      key: certificate.privateKey,
      rejectUnauthorized: false,
    });

    const response = await axios.put(`${uri.origin}${path}`, manifest, {
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
  } catch (error: any) {
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
