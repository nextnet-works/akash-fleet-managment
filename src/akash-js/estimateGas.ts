import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { getClient } from "./client";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { manifestVersion } from "./lib/utils";

export async function estimateGas(sdlData: string) {
  const { client, offlineSigner } = await getClient();
  const accounts = await offlineSigner.getAccounts();
  const sdl = SDL.fromString(sdlData, "beta3");
  const groups = sdl.groups();
  const blockheight = await client.getHeight();

  const deployment = {
    id: {
      owner: accounts[0].address,
      dseq: blockheight,
    },
    groups: groups,
    deposit: {
      denom: "uakt",
      amount: "1000000",
    },
    version: await manifestVersion(),
    depositor: accounts[0].address,
  };

  const msg = {
    typeUrl: getTypeUrl(MsgCreateDeployment),
    value: MsgCreateDeployment.fromPartial(deployment),
  };

  const gasEstimated = await client.simulate(
    accounts[0].address,
    [msg],
    "simulate",
  );

  return gasEstimated;
}
