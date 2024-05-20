import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry } from "cosmwasm";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import { RPC_ENDPOINT } from "./lib/consts";
import { CHAIN_ID } from "@/lib/consts";

export async function getClient() {
  if (!window.keplr) {
    throw new Error("Please install keplr extension");
  }

  const myRegistry = new Registry(getAkashTypeRegistry());
  await window.keplr.enable(CHAIN_ID);

  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);

  const client = await SigningStargateClient.connectWithSigner(
    RPC_ENDPOINT,
    offlineSigner,
    {
      registry: myRegistry,
    }
  );

  return { client, offlineSigner };
}
