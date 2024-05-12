import { exec } from "child_process";
import { promisify } from "util";

import { SuccessfulLease } from "../../type";
import { generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../../utils/akash/createDeployment";
import { fetchBids } from "../../utils/akash/bids";
import { RAW_SDL_T2 } from "../../utils/akash/consts";
import { createLease } from "../../utils/akash/lease";
import { Bid, Lease } from "@akashnetwork/akash-api/akash/market/v1beta4";

export const handleSdlFlow = async () => {
  const respondersLength = await deployGenericSDL();
  const { bids } = await deployAllBiddersSDL(respondersLength);

  // await saveBidsToDB(bids);

  let filteredBids: Bid[] = [];
  const gseqArray = [...new Set(bids.map((bid) => bid?.bid?.bidId?.gseq))];

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

  const leases = await createLease(filteredBids);

  const leasesFulfilled = leases.filter((lease) => lease.bidId);
  // TODO: add rejected leases to a blacklist of providers
  const leasedRejected = leases.filter((lease) => !lease.bidId);

  return { leasesFulfilled, leasedRejected };
};

export const deployGenericSDL = async (
  AKASH_KEY_NAME = "myWallet-akt",
): Promise<number> => {
  const data = await createDeployment();

  const bids = await fetchBids(data.id.dseq, data.id.owner);

  return bids.length;
};

export const deployAllBiddersSDL = async (respondersLength: number) => {
  generateYamlWithWebs(respondersLength);

  const deploymentRes = await createDeployment(RAW_SDL_T2);

  await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait 15 seconds

  const bids = await fetchBids(deploymentRes.id.dseq, deploymentRes.id.owner);

  if (bids.length === 0) {
    throw new Error("No bids found in T-2");
  }

  return { bids, owner: deploymentRes.id.owner };
};
