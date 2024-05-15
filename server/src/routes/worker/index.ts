import {
  BidID,
  Lease_State,
} from "@akashnetwork/akash-api/akash/market/v1beta4";
import { getAdminDB } from "../../utils/db";
import { loadPrerequisites } from "../../utils/akash/client";
import { queryLeaseServices, queryLeaseStatus } from "../../utils/akash/lease";
import { CronJob } from "cron";

export const updateNodes = async () => {
  console.log("Updating nodes");
  const db = getAdminDB();
  const { data, error } = await db
    .from("nodes")
    .select("*")
    .neq("state", Lease_State.closed);
  if (error) console.log("Error fetching nodes", error);
  if (!data) throw new Error("No nodes found");

  const { wallet } = await loadPrerequisites();
  const account = await wallet.getAccounts();
  const promises = data.map(async (node) => {
    const bidId: BidID = {
      $type: "akash.market.v1beta4.BidID",
      gseq: node.gseq,
      dseq: node.dseq as unknown as Long,
      oseq: 1,
      owner: account[0].address,
      provider: node.akash_provider,
    };
    const lease = await queryLeaseStatus(bidId);
    const state = lease?.lease?.state;
    const { servicesUri } = await queryLeaseServices(bidId);
    return { state, servicesUri, lease, id: node.id };
  });

  const results = await Promise.all(promises);

  const updates = results.map(async (result) => {
    const { error } = await db
      .from("nodes")
      .update({
        state: result.state,
        provider_uris: result.servicesUri ?? [],
        lease_first_block: result.lease?.lease?.createdAt.toNumber(),
        // lease_last_block: result.lease?.lease?.closedOn.toNumber(),
      })
      .eq("id", result.id);
    if (error) throw new Error(error.message);
  });

  await Promise.all(updates);

  const { data: closedNodes, error: closedNodesError } = await db
    .from("nodes")
    .select("*")
    .eq("state", Lease_State.closed)
    .is("lease_last_block", null);

  if (closedNodesError) throw new Error("Error fetching closed nodes");
  if (!closedNodes) {
    return;
  }

  const closedUpdates = closedNodes.map(async (node) => {
    const bidId: BidID = {
      $type: "akash.market.v1beta4.BidID",
      gseq: node.gseq,
      dseq: node.dseq as unknown as Long,
      oseq: 1,
      owner: account[0].address,
      provider: node.akash_provider,
    };
    const lease = await queryLeaseStatus(bidId);
    const state = lease?.lease?.state;
    const { servicesUri } = await queryLeaseServices(bidId);
    return {
      state,
      servicesUri,
      lease,
      id: node.id,
    };
  });

  const closedResults = await Promise.all(closedUpdates);

  const closedNodeUpdates = closedResults.map(async (result) => {
    const { error } = await db
      .from("nodes")
      .update({
        lease_last_block: result.lease?.lease?.closedOn.toNumber(),
      })
      .eq("id", result.id);
    if (error) throw new Error(error.message);
  });

  await Promise.all(closedNodeUpdates);
};
