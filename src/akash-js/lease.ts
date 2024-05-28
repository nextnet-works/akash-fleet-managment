import { MsgCreateLease } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { getClient } from "./client";

import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { broadcastTxSync, createTxRaw } from "./closeDeployment";
import { AkashChainInfo } from "./lib/chain";
import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate";
import { MsgCreateCertificate } from "@akashnetwork/akash-api/akash/cert/v1beta3";
import { getFees } from "./lib/utils";

export async function createLease(bids: QueryBidResponse["bid"][]) {
  const { client, offlineSigner } = await getClient();
  const accounts = await offlineSigner.getAccounts();

  const leasesMessage = bids.map((bid) => {
    return {
      typeUrl: getTypeUrl(MsgCreateLease),
      value: MsgCreateLease.create({ bidId: bid?.bidId }),
    };
  });

  const fee = await getFees(client, accounts[0].address, leasesMessage);

  const signedMessage = await client.sign(
    accounts[0].address,
    leasesMessage,
    fee,
    "create lease"
  );

  const txBytes = createTxRaw(
    signedMessage.bodyBytes,
    signedMessage.authInfoBytes,
    signedMessage.signatures
  );

  if (!window.keplr) {
    throw new Error("Please install keplr extension");
  }

  await broadcastTxSync(window.keplr, AkashChainInfo.chainId, txBytes);

  const certificateMessage = {
    typeUrl: getTypeUrl(MsgCreateCertificate),
    value: MsgCreateCertificate.create({
      owner: accounts[0].address,
      pubkey: accounts[0].pubkey,
    }),
  };

  const signedCertificateMessage = await client.sign(
    accounts[0].address,
    [certificateMessage],
    fee,
    "create certificate"
  );

  const certificateTxBytes = createTxRaw(
    signedCertificateMessage.bodyBytes,
    signedCertificateMessage.authInfoBytes,
    signedCertificateMessage.signatures
  );

  await broadcastTxSync(
    window.keplr,
    AkashChainInfo.chainId,
    certificateTxBytes
  );
}
