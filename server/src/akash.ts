import {
  AccountData,
  DirectSecp256k1HdWallet,
  Registry,
} from "@cosmjs/proto-signing";
import { stargate } from "@akashnetwork/akashjs";
import { SigningStargateClient } from "@cosmjs/stargate";
export interface DeploymentID {
  $type: "akash.deployment.v1beta3.DeploymentID";
  owner: string;
  dseq: Long;
}
export interface MsgCreateDeployment {
  $type: "akash.deployment.v1beta3.MsgCreateDeployment";
  id: DeploymentID | undefined;
  groups: any[];
  version: Uint8Array;
  deposit: any | undefined;
  /** Depositor pays for the deposit */
  depositor: string;
}

export async function sendDeploy(account: AccountData) {
  // Use the encode method for the message to wrap the data
  const message = {
    id: {
      owner: account.address,
    },
  };

  // Set the appropriate typeUrl and attach the encoded message as the value
  const msgAny = {
    typeUrl: stargate.getTypeUrl(),
    value: message,
  };

  // You can use your own RPC node, or get a list of public nodes from akashjs
  const rpcEndpoint = "http://my.rpc.node";

  const myRegistry = new Registry(stargate.getAkashTypeRegistry());

  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    {
      registry: myRegistry,
    }
  );

  const fee = {
    amount: [
      {
        denom: "uakt",
        amount: "5000",
      },
    ],
    gas: "800000",
  };

  const signedMessage = await client.signAndBroadcast(
    account.address,
    [msgAny],
    fee
  );
  return signedMessage;
}

export async function walletFromMnemonic(mnemonic: string) {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "akash" });
}
