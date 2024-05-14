import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { loadPrerequisites } from "./client";

export async function estimateGas() {
  const { wallet, client, sdl } = await loadPrerequisites();
  const accounts = await wallet.getAccounts();
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
    version: await sdl.manifestVersion(),
    depositor: accounts[0].address,
  };

  const msg = {
    typeUrl: getTypeUrl(MsgCreateDeployment),
    value: MsgCreateDeployment.fromPartial(deployment),
  };

  const gasEstimated = await client.simulate(
    accounts[0].address,
    [msg],
    "simulate"
  );

  return gasEstimated;
}
