import { defaultRegistryTypes, SigningStargateClient } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
import { AminoTypes } from "@cosmjs/stargate";
import {
  Certificate,
  MsgRevokeCertificate,
} from "@akashnetwork/akash-api/akash/cert/v1beta3";
import { MsgCreateCertificate } from "@akashnetwork/akash-api/deprecated/akash/cert/v1beta1";
import {
  getAkashTypeRegistry,
  Message,
} from "@akashnetwork/akashjs/build/stargate";
import { RPC_ENDPOINT } from "./lib/consts";
import { CHAIN_ID } from "@/lib/consts";
import {
  MsgCloseDeployment,
  MsgCloseGroup,
  MsgCreateDeployment,
  MsgDepositDeployment,
  MsgPauseGroup,
  MsgStartGroup,
  MsgUpdateDeployment,
} from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { MsgCreateLease } from "@akashnetwork/akash-api/akash/market/v1beta4";

type Chain = {
  id: string;
};
export function getSigner(chain: Chain) {
  if (!window.keplr || !window.getOfflineSignerAuto) {
    throw new Error("Please install keplr extension");
  }
  return window.getOfflineSignerAuto(chain.id);
}

export async function getClient() {
  if (!window.keplr) {
    throw new Error("Please install keplr extension");
  }
  await window.keplr.enable(CHAIN_ID);

  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);

  const customAminoTypes = new AminoTypes({
    "/akash.cert.v1beta2.MsgCreateCertificate": {
      aminoType: "cert/cert-create-certificate",
      toAmino: ({ cert, pubkey }: MsgCreateCertificate) => {
        const buf = Certificate.encode(
          Certificate.fromPartial({
            cert,
            pubkey,
          })
        ).finish();
        const encoded = Buffer.from(buf);
        return encoded.toString("base64");
      },
      fromAmino: ({ cert, pubkey }: MsgCreateCertificate) => {
        return Certificate.fromPartial({
          cert,
          pubkey,
        });
      },
    },
  });

  const map = new Map([...defaultRegistryTypes, ...getAkashTypeRegistry()]);

  map.set(Message.MsgCreateCertificate, MsgCreateCertificate);
  map.set(Message.MsgRevokeCertificate, MsgRevokeCertificate);
  map.set(Message.MsgCreateDeployment, MsgCreateDeployment);
  map.set(Message.MsgCloseDeployment, MsgCloseDeployment);
  map.set(Message.MsgDepositDeployment, MsgDepositDeployment);
  map.set(Message.MsgUpdateDeployment, MsgUpdateDeployment);
  map.set(Message.MsgCloseGroup, MsgCloseGroup);
  map.set(Message.MsgPauseGroup, MsgPauseGroup);
  map.set(Message.MsgStartGroup, MsgStartGroup);
  map.set(Message.MsgCreateLease, MsgCreateLease);

  const myRegistry = new Registry(map);

  const client = await SigningStargateClient.connectWithSigner(
    RPC_ENDPOINT,
    offlineSigner,
    {
      registry: myRegistry,
      aminoTypes: customAminoTypes,
    }
  );

  return { client, offlineSigner };
}
