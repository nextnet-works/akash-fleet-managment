import { generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../../akash-js/createDeployment";
import { fetchBids } from "../../akash-js/bids";
import { createLease } from "../../akash-js/lease";
import * as YAML from "yaml";
import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta4";

export const handleSdlFlow = async (sdlFile: Record<string, unknown>) => {
  const respondersLength = await deployGenericSDL(sdlFile);
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

  await new Promise((resolve) => setTimeout(resolve, 15000));

  await createLease(filteredBids);

  return filteredBids.map((bid) => bid?.bidId);
};

export const deployGenericSDL = async (sdlFile: Record<string, unknown>) => {
  const yamlStr = YAML.stringify(sdlFile);

  const { owner, tx } = await createDeployment(yamlStr);

  console.log("Deployment tx", tx);

  const bids = await fetchBids(tx.height, owner);

  return bids.length;
};

export const deployAllBiddersSDL = async (respondersLength: number) => {
  const yamlStr = generateYamlWithWebs(respondersLength);

  const { owner, tx } = await createDeployment(yamlStr);

  const bids = await fetchBids(tx.height, owner, 6);

  return { bids, owner };
};
