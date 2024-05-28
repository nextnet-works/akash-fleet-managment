import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate";

import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";

import { getClient } from "./client";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { manifestVersion, signAndBroadcast } from "../lib/utils";

export async function createDeployment(sdlData: string) {
  const { client, offlineSigner } = await getClient();
  const sdl = SDL.fromString(sdlData, "beta3");
  const blockHeight = await client.getHeight();
  const groups = sdl.groups();
  const accounts = await offlineSigner.getAccounts();

  const deployment = MsgCreateDeployment.create({
    id: {
      owner: accounts[0].address,
      dseq: blockHeight,
    },
    groups: groups,
    deposit: {
      denom: "uakt",
      amount: "1000000",
    },
    version: await manifestVersion(),
    depositor: accounts[0].address,
  });

  const msg = {
    typeUrl: getTypeUrl(MsgCreateDeployment),
    value: deployment,
  };

  const txHash = await signAndBroadcast(
    client,
    accounts[0].address,
    [msg],
    "create deployment"
  );

  return { owner: accounts[0].address, tx: txHash, height: blockHeight };
}
