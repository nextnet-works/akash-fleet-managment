import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate";
import { getClient } from "./client";
import { MsgCreateCertificate } from "@akashnetwork/akash-api/akash/cert/v1beta3";
import { createCertificate } from "@akashnetwork/akashjs/build/certificates";
import { toBase64 } from "pvutils";
import { signAndBroadcast } from "../lib/utils";

export async function createCert() {
  const { client, offlineSigner } = await getClient();
  const accounts = await offlineSigner.getAccounts();

  const certificate = await createCertificate(accounts[0].address);

  const certificateMessage = {
    typeUrl: getTypeUrl(MsgCreateCertificate),
    value: MsgCreateCertificate.create({
      owner: accounts[0].address,
      cert: Uint8Array.from(atob(toBase64(certificate.csr)), (c) =>
        c.charCodeAt(0)
      ),
      pubkey: Uint8Array.from(atob(toBase64(certificate.publicKey)), (c) =>
        c.charCodeAt(0)
      ),
    }),
  };

  await signAndBroadcast(
    client,
    accounts[0].address,
    [certificateMessage],
    "create certificate"
  );
}
