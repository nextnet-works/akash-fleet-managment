import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate";

import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";

import { getClient } from "./client";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { manifestVersion } from "./lib/utils";

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

  const fee = {
    amount: [
      {
        denom: "uakt",
        amount: "20000",
      },
    ],
    gas: "800000",
  };

  const msg = {
    typeUrl: getTypeUrl(MsgCreateDeployment),
    value: deployment,
  };

  const tx = await client.signAndBroadcast(
    accounts[0].address,
    [msg],
    fee,
    "create deployment",
  );

  if (tx.code !== undefined && tx.code === 0) {
    return { tx, owner: accounts[0].address };
  }

  throw new Error(`Could not create deployment: ${tx.rawLog} `);
}
