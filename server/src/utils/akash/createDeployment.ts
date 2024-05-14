import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate";

import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";

import { DSEQ } from "./consts";
import { loadPrerequisites } from "./client";

export async function createDeployment(sdlPath?: string) {
  const { wallet, client, sdl } = await loadPrerequisites(sdlPath);

  const blockHeight = await client.getHeight();
  const groups = sdl.groups();
  const accounts = await wallet.getAccounts();

  // if (DSEQ != 0) {
  //   console.log("Skipping deployment creation...");
  //   return {
  //     id: {
  //       owner: accounts[0].address,
  //       dseq: DSEQ,
  //     },
  //     groups: groups,
  //     deposit: {
  //       denom: "uakt",
  //       amount: "1000000",
  //     },
  //     version: await sdl.manifestVersion(),
  //     depositor: accounts[0].address,
  //   };
  // }

  const deployment = {
    id: {
      owner: accounts[0].address,
      dseq: blockHeight,
    },
    groups: groups,
    deposit: {
      denom: "uakt",
      amount: "1000000",
    },
    version: await sdl.manifestVersion(),
    depositor: accounts[0].address,
  };

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
    value: MsgCreateDeployment.fromPartial(deployment),
  };

  const tx = await client.signAndBroadcast(
    accounts[0].address,
    [msg],
    fee,
    "create deployment",
  );

  if (tx.code !== undefined && tx.code === 0) {
    return { tx, dseq: DSEQ, owner: accounts[0].address };
  }

  throw new Error(`Could not create deployment: ${tx.rawLog} `);
}
