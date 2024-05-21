import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";

import { getClient } from "./client";

export async function closeDeployment(dseq: string) {
  try {
    const { offlineSigner, client } = await getClient();

    const [account] = await offlineSigner.getAccounts();

    const message = MsgCloseDeployment.fromPartial({
      id: {
        dseq,
        owner: account.address,
      },
    });

    const msgAny = {
      typeUrl: getTypeUrl(MsgCloseDeployment),
      value: message,
    };

    const fee = {
      amount: [
        {
          denom: "uakt",
          amount: "20000",
        },
      ],
      gas: "80000",
    };

    const signedMessage = await client.signAndBroadcast(
      account.address,
      [msgAny],
      fee,
      "take down deployment",
    );

    if (signedMessage.code === 200) {
      return "Deployment closed successfully";
    }
    return "Deployment close failed";
  } catch (e) {
    return e;
  }
}
