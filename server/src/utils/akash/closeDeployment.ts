import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import {
  getAkashTypeRegistry,
  getTypeUrl,
} from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCloseDeployment } from "@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg";
import { SigningStargateClient } from "@cosmjs/stargate";
import { network } from "@akashnetwork/akashjs";
import { log } from "console";
export async function closeDeployment(deploymentId: string) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env.MNEMONIC!,
      {
        prefix: "akash",
      }
    );

    // get first account
    const [account] = await wallet.getAccounts();

    // Use the encode method for the message to wrap the data
    const dseq = deploymentId.split("/")[1];
    const message = MsgCloseDeployment.fromPartial({
      id: {
        dseq,
        owner: account.address,
      },
    });

    // Set the appropriate typeUrl and attach the encoded message as the value
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

    console.log(signedMessage);

    if (signedMessage.code === 200) {
      return "Deployment closed successfully";
    }
    return "Deployment close failed";
  } catch (e) {
    console.log(e);
    return e;
  }
}
