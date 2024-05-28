import { GenericYaml, generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../../akash-js/createDeployment";
import { fetchBids } from "../../akash-js/bids";
import { createLease } from "../../akash-js/lease";
import * as YAML from "yaml";
import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { SigningStargateClient } from "@cosmjs/stargate";
import { StdFee } from "@keplr-wallet/types";
export const handleSdlFlow = async (sdlFile: GenericYaml) => {
  const respondersLength = await deployGenericSDL(sdlFile);
  const { bids } = await deployAllBiddersSDL(respondersLength, sdlFile);

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

export const deployGenericSDL = async (sdlFile: GenericYaml) => {
  const yamlStr = YAML.stringify(sdlFile);

  const { owner, height } = await createDeployment(yamlStr);

  const bids = await fetchBids(height, owner);

  return bids.length;
};

export const deployAllBiddersSDL = async (
  respondersLength: number,
  sdlFile: GenericYaml
) => {
  const yamlStr = generateYamlWithWebs(respondersLength, sdlFile);

  const { owner, height } = await createDeployment(yamlStr);

  const bids = await fetchBids(height, owner, 6);

  return { bids, owner };
};

async function computeSHA256(input: string): Promise<Uint8Array> {
  // Convert the input string to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Compute the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the ArrayBuffer to Uint8Array
  return new Uint8Array(hashBuffer);
}

export async function manifestVersion() {
  const versionString = "2.0";
  return await computeSHA256(versionString);
}

export async function getFees(
  client: SigningStargateClient,
  address: string,
  msg: { typeUrl: string; value: unknown }[]
): Promise<StdFee> {
  const gasNeeded = await client.simulate(address, msg, "simulate");
  return {
    amount: [
      {
        denom: "uakt",
        amount: "1000000",
      },
    ],
    gas: gasNeeded.toString(),
  };
}
