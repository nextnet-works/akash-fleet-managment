import { MsgCreateLease } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { getClient } from "./client";

import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate";
import { signAndBroadcast } from "../lib/utils";
import { BidAPI } from "@/types/akash";

export async function createLease(bids: BidAPI[]) {
  const { client, offlineSigner } = await getClient();
  const accounts = await offlineSigner.getAccounts();

  const leasesMessage = bids.map((bid) => ({
    typeUrl: getTypeUrl(MsgCreateLease),
    value: MsgCreateLease.create({ bidId: bid?.bid_id }),
  }));

  await signAndBroadcast(
    client,
    accounts[0].address,
    leasesMessage,
    "create lease"
  );
}
