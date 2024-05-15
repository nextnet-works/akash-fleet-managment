import { Registry } from "@cosmjs/proto-signing";
import {
  getAkashTypeRegistry,
  getTypeUrl,
} from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { SigningStargateClient } from "@cosmjs/stargate";
import { network } from "@akashnetwork/akashjs";
import { loadPrerequisites } from "./client";

export async function closeDeployment(dseq: string) {
  try {
    const { wallet } = await loadPrerequisites();

    const [account] = await wallet.getAccounts();

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

    const nodes = await network.getEndpoints("mainnet", "rpc");
    const myRegistry = new Registry(getAkashTypeRegistry());

    const client = await SigningStargateClient.connectWithSigner(
      nodes[0].address,
      wallet,
      {
        registry: myRegistry,
      }
    );

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
      "take down deployment"
    );

    if (signedMessage.code === 200) {
      return "Deployment closed successfully";
    }
    return "Deployment close failed";
  } catch (e) {
    return e;
  }
}
