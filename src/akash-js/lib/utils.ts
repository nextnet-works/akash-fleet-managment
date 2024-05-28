import { GenericYaml, generateYamlWithWebs } from "./yaml";
import { createDeployment } from "../rpc/createDeployment";
import { fetchBids } from "../api/bids";
import { createLease } from "../rpc/lease";
import * as YAML from "yaml";
import { SigningStargateClient } from "@cosmjs/stargate";
import { BroadcastMode, Keplr, StdFee } from "@keplr-wallet/types";
import { BidAPI } from "@/types/akash";
import { AkashChainInfo, ROOT_PROTO } from "./consts";

export const handleSdlFlow = async (sdlFile: GenericYaml) => {
  const respondersLength = await deployGenericSDL(sdlFile);
  const { bids } = await deployAllBiddersSDL(respondersLength, sdlFile);

  const filteredBids: BidAPI[] = [];
  const gseqArray = [
    ...new Set(bids.filter((gseq) => gseq).map((bid) => bid?.bid_id?.gseq)),
  ];

  gseqArray.forEach((gseq) => {
    const gseqBids = bids.filter((bid) => bid?.bid_id?.gseq === gseq);
    const sortedBids = gseqBids.sort(
      (a, b) => Number(a?.price?.amount) - Number(b?.price?.amount)
    );

    if (!sortedBids[0]?.bid_id) {
      return;
    }

    filteredBids.push(sortedBids[0]);
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));

  await createLease(filteredBids);

  return filteredBids.map((bid) => bid?.bid_id);
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

async function getFees(
  client: SigningStargateClient,
  address: string,
  msg: { typeUrl: string; value: unknown }[]
): Promise<StdFee> {
  // The 20% buffer is added to the gas estimate to ensure that the transaction does not fail due to insufficient gas.
  const gasNeeded = (await client.simulate(address, msg, "simulate")) * 1.2;

  return {
    amount: [
      {
        denom: "uakt",
        amount: "1000000",
      },
    ],
    gas: Math.round(gasNeeded).toString(),
  };
}

/**
 * Create a TxRaw object and encode it to Uint8Array.
 * @param {Uint8Array} bodyBytes - The body bytes of the transaction.
 * @param {Uint8Array} authInfoBytes - The auth info bytes of the transaction.
 * @param {Uint8Array} signature - The signature bytes of the transaction.
 * @returns {Uint8Array} - The encoded TxRaw object as Uint8Array.
 */
function createTxRaw(
  bodyBytes: Uint8Array,
  authInfoBytes: Uint8Array,
  signatures: Uint8Array[]
): Uint8Array {
  const TxRaw = ROOT_PROTO.lookupType("cosmos.tx.v1beta1.TxRaw");

  // Create the TxRaw message
  const message = TxRaw.create({
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
    signatures,
  });

  // Encode the message to Uint8Array
  const buffer = TxRaw.encode(message).finish();

  return buffer;
}

const broadcastTxSync = async (
  keplr: Keplr,
  chainId: string,
  tx: Uint8Array
): Promise<Uint8Array> => {
  return keplr.sendTx(chainId, tx, "sync" as BroadcastMode);
};

export async function signAndBroadcast(
  client: SigningStargateClient,
  address: string,
  msg: { typeUrl: string; value: unknown }[],
  message: string
): Promise<Uint8Array> {
  const fees = await getFees(client, address, msg);
  const signedMessage = await client.sign(address, msg, fees, message);
  const txBytes = createTxRaw(
    signedMessage.bodyBytes,
    signedMessage.authInfoBytes,
    signedMessage.signatures
  );

  if (!window.keplr) {
    throw new Error("Please install keplr extension");
  }

  await broadcastTxSync(window.keplr, AkashChainInfo.chainId, txBytes);

  return txBytes;
}
