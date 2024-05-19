import { generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../../akash-js/createDeployment";
import { fetchBids } from "../../akash-js/bids";
import { RAW_SDL_T1, RAW_SDL_T2 } from "../../akash-js/lib/consts";
import { createLease } from "../../akash-js/lease";
import * as fs from "fs";
import * as YAML from "yaml";
import {
  QueryBidResponse,
  QueryLeaseResponse,
} from "@akashnetwork/akash-api/akash/market/v1beta4";
import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";

export const handleSdlFlow = async (sdlFile: Record<string, any>) => {
  const respondersLength = await deployGenericSDL(sdlFile);
  const { bids } = await deployAllBiddersSDL(respondersLength);

  const filteredBids: QueryBidResponse["bid"][] = [];
  const gseqArray = [
    ...new Set(bids.filter((gseq) => gseq).map((bid) => bid?.bid?.bidId?.gseq)),
  ];

  gseqArray.forEach((gseq) => {
    const gseqBids = bids.filter((bid) => bid?.bid?.bidId?.gseq === gseq);
    const sortedBids = gseqBids.sort(
      (a, b) => Number(a?.bid?.price?.amount) - Number(b?.bid?.price?.amount),
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

  // TODO: add rejected leases to a blacklist of providers
  const leasedRejected = nodes.filter((lease) => !lease.bidId);

  return { activeNodes, leasedRejected };
};

export const deployGenericSDL = async (sdlFile: Record<string, any>) => {
  const yamlStr = YAML.stringify(sdlFile);

  fs.writeFileSync(RAW_SDL_T1, yamlStr, "utf8");
  const { dseq, owner, tx } = await createDeployment(RAW_SDL_T1);

  const bids = await fetchBids(dseq, owner, tx.height);

  return bids.length;
};

export const deployAllBiddersSDL = async (respondersLength: number) => {
  generateYamlWithWebs(respondersLength);

  const { dseq, owner, tx } = await createDeployment(RAW_SDL_T2);

  const bids = await fetchBids(dseq, owner, tx.height, 6);

  return { bids, owner };
};
