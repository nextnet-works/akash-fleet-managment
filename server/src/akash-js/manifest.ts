import https from "https";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";

import {
  QueryClientImpl as QueryProviderClient,
  QueryProviderRequest,
} from "@akashnetwork/akash-api/akash/provider/v1beta3";

import { RAW_SDL_T2, RPC_ENDPOINT } from "./lib/consts";
import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { loadPrerequisites } from "./client";
import axios from "axios";
import { queryLeaseServices, queryLeaseStatus } from "./lease";

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
      return { serviceUris: [] };
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

    await axios.put(`${uri.origin}${path}`, manifest, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Length": manifest.length.toString(),
      },
      httpsAgent: agent,
    });

    const leaseStatus = await queryLeaseStatus(leaseId);
    const { servicesUri, ports } = await queryLeaseServices(leaseId);

    return {
      servicesUri,
      uri,
      ports,
      lease: leaseStatus,
    };
  } catch (error: any) {
    console.error(error);
    return {
      serviceUris: [],
    };
  }
}
