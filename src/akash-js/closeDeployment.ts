import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { getClient } from "./client";
import { BroadcastMode, Keplr } from "@keplr-wallet/types";
import { AkashChainInfo } from "./lib/chain";
import protobuf from "protobufjs";

/**
 * Create a TxRaw object and encode it to Uint8Array.
 * @param {Uint8Array} bodyBytes - The body bytes of the transaction.
 * @param {Uint8Array} authInfoBytes - The auth info bytes of the transaction.
 * @param {Uint8Array} signature - The signature bytes of the transaction.
 * @returns {Uint8Array} - The encoded TxRaw object as Uint8Array.
 */
export function createTxRaw(
  bodyBytes: Uint8Array,
  authInfoBytes: Uint8Array,
  signatures: Uint8Array[]
): Uint8Array {
  const TxRaw = root.lookupType("cosmos.tx.v1beta1.TxRaw");

  // Create the TxRaw message
  const message = TxRaw.create({
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
    signatures,
  });

  // Encode the message to Uint8Array
  const buffer = TxRaw.encode(message).finish();

  return buffer;
}
export async function closeDeployment(dseq: string) {
  try {
    const { offlineSigner, client } = await getClient();

    const [account] = await offlineSigner.getAccounts();

    const message = MsgCloseDeployment.create({
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
      gas: "800000",
    };

    const signedMessage = await client.sign(
      account.address,
      [msgAny],
      fee,
      "take down deployment"
    );

    const txBytes = createTxRaw(
      signedMessage.bodyBytes,
      signedMessage.authInfoBytes,
      signedMessage.signatures
    );

    if (!window.keplr) {
      return "Please install keplr extension";
    }

    const txHash = await broadcastTxSync(
      window.keplr,
      AkashChainInfo.chainId,
      txBytes
    );

    return txHash;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export const broadcastTxSync = async (
  keplr: Keplr,
  chainId: string,
  tx: Uint8Array
): Promise<Uint8Array> => {
  return keplr.sendTx(chainId, tx, "sync" as BroadcastMode);
};

const root = protobuf.Root.fromJSON({
  nested: {
    cosmos: {
      nested: {
        tx: {
          nested: {
            v1beta1: {
              nested: {
                TxRaw: {
                  fields: {
                    bodyBytes: {
                      type: "bytes",
                      id: 1,
                    },
                    authInfoBytes: {
                      type: "bytes",
                      id: 2,
                    },
                    signatures: {
                      rule: "repeated",
                      type: "bytes",
                      id: 3,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
