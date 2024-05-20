import { MsgCreateLease } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { getClient } from "./client";

import { QueryBidResponse } from "@akashnetwork/akash-api/akash/market/v1beta4";

export async function createLease(bids: QueryBidResponse["bid"][]) {
  const { client, offlineSigner } = await getClient();
  const accounts = await offlineSigner.getAccounts();

  const leasesMessage = bids.map((bid) => {
    return {
      typeUrl: `/${MsgCreateLease.$type}`,
      value: MsgCreateLease.fromPartial({ bidId: bid?.bidId }),
    };
  });

  const fee = {
    amount: [
      {
        denom: "uakt",
        amount: "50000",
      },
    ],
    gas: "2000000",
  };

  await client.signAndBroadcast(
    accounts[0].address,
    leasesMessage,
    fee,
    "create lease"
  );
}
