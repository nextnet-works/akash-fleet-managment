import https from "https";
import { MsgCreateLease } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta3";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";

import { loadPrerequisites } from "./client";
import { RPC_ENDPOINT } from "./consts";
import {
  QueryProviderRequest,
  QueryClientImpl as QueryProviderClient,
} from "@akashnetwork/akash-api/akash/provider/v1beta3";
import { sendManifest } from "./manifest";
import axios from "axios";
import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta3";

export async function createLease(
  bids: QueryBidResponse["bid"][]
): Promise<{ bidId: BidID | undefined }[]> {
  const { wallet, client } = await loadPrerequisites();
  const accounts = await wallet.getAccounts();

  const leasesMessage = bids.map((bid) => {
    return {
      typeUrl: `/${MsgCreateLease.$type}`,
      value: MsgCreateLease.fromPartial({ bidId: bid?.bidId }),
    };
  });

  const fee = {
    amount: [
      {
        denom: "uakt",
        amount: "50000",
      },
    ],
    gas: "2000000",
  };

  const leasesMessages = await client.signAndBroadcast(
    accounts[0].address,
    leasesMessage,
    fee,
    "create lease"
  );

  const height = leasesMessages.height;

  const successfulLeases = await Promise.all(
    bids.map(async (bid) => {
      if (!bid?.bidId) {
        return { bidId: undefined };
      }
      const isSuccess = await sendManifest(bid?.bidId);

      if (!isSuccess) {
        return { bidId: undefined };
      }

      return { bidId: bid?.bidId };
    })
  );
  return successfulLeases;
}

interface ServiceInfo {
  uris: string[];
}

interface LeaseStatusResponse {
  services: Record<string, ServiceInfo>;
}

export async function queryLeaseStatus(
  bidId: BidID | undefined
): Promise<LeaseStatusResponse> {
  if (!bidId) {
    throw new Error("Bid ID is required");
  }

  // Load required certificates
  const { certificate } = await loadPrerequisites();

  // Build the path and set up the custom HTTPS agent
  const leasePath = `/lease/${bidId.dseq}/${bidId.gseq}/${bidId.oseq}/status`;

  const agent = new https.Agent({
    cert: certificate.csr,
    key: certificate.privateKey,
    rejectUnauthorized: false,
  });

  // Retrieve provider information
  const request = QueryProviderRequest.fromPartial({
    owner: bidId.provider,
  });

  const client = new QueryProviderClient(await getRpc(RPC_ENDPOINT));
  const tx = await client.Provider(request);

  if (!tx.provider) {
    throw new Error(`Could not find provider ${bidId.provider}`);
  }

  const providerInfo = tx.provider;
  const uri = new URL(providerInfo.hostUri);

  try {
    const response = await axios.get<LeaseStatusResponse>(
      `${uri.origin}${leasePath}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        httpsAgent: agent,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(`Could not query lease status: ${error.message}`);
  }
}
