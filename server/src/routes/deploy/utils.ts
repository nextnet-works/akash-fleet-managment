import { status } from "@grpc/grpc-js";
import { generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../../akash-js/createDeployment";
import { fetchBids } from "../../akash-js/bids";
import { RAW_SDL_T2 } from "../../akash-js/lib/consts";
import { createLease, saveLeasesToDB } from "../../akash-js/lease";
import {
  Lease_State,
  QueryBidResponse,
  QueryLeaseResponse,
} from "@akashnetwork/akash-api/akash/market/v1beta4";
import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { Json } from "../../types/supabase.gen";

export const handleSdlFlow = async (deploymentID: number) => {
  const respondersLength = await deployGenericSDL();
  const { bids } = await deployAllBiddersSDL(respondersLength);

  const filteredBids: QueryBidResponse["bid"][] = [];
  const gseqArray = [
    ...new Set(bids.filter((gseq) => gseq).map((bid) => bid?.bid?.bidId?.gseq)),
  ];

  gseqArray.forEach((gseq) => {
    const gseqBids = bids.filter((bid) => bid?.bid?.bidId?.gseq === gseq);
    const sortedBids = gseqBids.sort(
      (a, b) => Number(a?.bid?.price?.amount) - Number(b?.bid?.price?.amount)
    );

    if (!sortedBids[0]?.bid) {
      return;
    }

    filteredBids.push(sortedBids[0].bid);
  });

  //wait 15 seconds for the bids to be processed
  await new Promise((resolve) => setTimeout(resolve, 15000));

  const nodes = await createLease(filteredBids);

  const activeNodes = nodes.filter((lease) => lease.bidId) as {
    bidId: BidID;
    serviceUris: string[];
    uri: string;
    lease?: QueryLeaseResponse;
    ports: string[];
  }[];

  const output = activeNodes.map((lease) => {
    return {
      dseq: lease.bidId.dseq.toNumber(),
      gseq: lease.bidId.gseq,
      akash_provider: lease.bidId.provider,
      wallet_address: lease.bidId.owner,
      json: lease as unknown as Json,
      provider_uris: lease.serviceUris ?? [],
      provider_domain: lease.uri,
      ports: lease.ports,
      bid_id: `${lease.bidId.owner}/${lease.bidId.dseq}/${lease.bidId.gseq}/1/${lease.bidId.provider}`,
      price_per_block: lease.lease?.lease?.price?.amount
        ? Number(lease.lease?.lease?.price?.amount)
        : 0,
      state: (lease.lease?.lease?.state ?? Lease_State.UNRECOGNIZED) as number,
      lease_first_block: lease.lease?.lease?.createdAt?.toNumber() ?? 0,
      sdl_id: deploymentID,
      resources: {},
    };
  });

  await saveLeasesToDB(output);
  // TODO: add rejected leases to a blacklist of providers
  const leasedRejected = nodes.filter((lease) => !lease.bidId);

  return { activeNodes, leasedRejected };
};

export const deployGenericSDL = async () => {
  const { dseq, owner, tx } = await createDeployment();

  const bids = await fetchBids(dseq, owner, tx.height);

  return bids.length;
};

export const deployAllBiddersSDL = async (respondersLength: number) => {
  generateYamlWithWebs(respondersLength);

  const { dseq, owner, tx } = await createDeployment(RAW_SDL_T2);

  const bids = await fetchBids(dseq, owner, tx.height, 6);

  return { bids, owner };
};
