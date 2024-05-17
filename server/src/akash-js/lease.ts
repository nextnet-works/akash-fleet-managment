import https from "https";
import {
  MsgCreateLease,
  QueryLeaseRequest,
  QueryClientImpl as QueryClientImplMarket,
} from "@akashnetwork/akash-api/akash/market/v1beta4";
import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { getRpc } from "@akashnetwork/akashjs/build/rpc";

import { loadPrerequisites } from "./client";
import { RPC_ENDPOINT } from "./lib/consts";
import {
  QueryProviderRequest,
  QueryClientImpl as QueryProviderClient,
} from "@akashnetwork/akash-api/akash/provider/v1beta3";

import { sendManifest } from "./manifest";
import axios from "axios";
import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { createClient } from "@supabase/supabase-js";
import { ForwarderPortStatus } from "@akashnetwork/akash-api/akash/provider/lease/v1";

export async function createLease(bids: QueryBidResponse["bid"][]) {
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

  await client.signAndBroadcast(
    accounts[0].address,
    leasesMessage,
    fee,
    "create lease"
  );

  ///
  const successfulLeases = await Promise.all(
    bids.map(async (bid) => {
      if (!bid?.bidId) {
        return { bidId: undefined, serviceUris: [] as string[], uri: "" };
      }
      const { serviceUris, uri, lease, ports } = await sendManifest(bid?.bidId);

      return {
        bidId: bid?.bidId,
        serviceUris,
        uri: uri?.toString() ?? "",
        lease,
        ports,
      };
    })
  );

  return successfulLeases;
}

interface ServiceInfo {
  name: string;
  available: number;
  total: number;
  uris: string[] | null;
  observed_generation: number;
  replicas: number;
  updated_replicas: number;
  ready_replicas: number;
  available_replicas: number;
}

interface LeaseStatusResponse {
  services: Record<string, ServiceInfo>;
  forwarded_ports: Record<string, ForwarderPortStatus>;
  ips: null | string[];
}

export async function queryLeaseStatus(leasId: BidID) {
  const client = new QueryClientImplMarket(await getRpc(RPC_ENDPOINT));

  const getLeaseStatusRequest = QueryLeaseRequest.fromPartial({ id: leasId });

  const leaseStatusResponse = await client.Lease(getLeaseStatusRequest);

  return leaseStatusResponse;
}

export async function queryLeaseServices(bidId: BidID | undefined): Promise<{
  servicesUri: string[];
  ports: string[];
}> {
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

    const servicesUri: string[] = [];
    const ports: string[] = [];

    for (const service in response?.data?.services) {
      servicesUri.push(...(response?.data?.services[service]?.uris ?? []));
    }

    // run on each forwarded port and create port using his host + externalPort
    for (const port in response?.data?.forwarded_ports) {
      const portStatus = response?.data?.forwarded_ports[port];
      if (portStatus?.externalPort && portStatus?.host) {
        ports.push(`${portStatus.host}:${portStatus.externalPort}`);
      }
    }

    return { servicesUri, ports: ports };
  } catch (error: any) {
    return { servicesUri: [], ports: [] };
  }
}
