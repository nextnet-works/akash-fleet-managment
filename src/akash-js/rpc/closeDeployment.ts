import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { getClient } from "./client";
import { signAndBroadcast } from "../lib/utils";

export async function closeDeployment(dseq: string) {
  const { offlineSigner, client } = await getClient();

  const [account] = await offlineSigner.getAccounts();

  const message = MsgCloseDeployment.create({
    id: {
      dseq,
      owner: account.address,
    },
  });

  const msg = {
    typeUrl: getTypeUrl(MsgCloseDeployment),
    value: message,
  };

  const txHash = await signAndBroadcast(
    client,
    account.address,
    [msg],
    "close deployment"
  );

  return txHash;
}
