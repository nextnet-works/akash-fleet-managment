import { generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../../utils/akash/createDeployment";
import { fetchBids } from "../../utils/akash/bids";
import { RAW_SDL_T2 } from "../../utils/akash/consts";
import { createLease } from "../../utils/akash/lease";
import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta3";

export const handleSdlFlow = async () => {
  const respondersLength = await deployGenericSDL();
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

  const leases = await createLease(filteredBids);

  const leasesFulfilled = leases.filter((lease) => lease.bidId);
  // TODO: add rejected leases to a blacklist of providers
  const leasedRejected = leases.filter((lease) => !lease.bidId);

  return { leasesFulfilled, leasedRejected };
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
