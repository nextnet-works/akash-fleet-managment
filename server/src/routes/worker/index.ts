import { Router } from "express";
import {
  BidID,
  Lease_State,
} from "@akashnetwork/akash-api/akash/market/v1beta4";
import { getAdminDB } from "../../utils/db";
import { loadPrerequisites } from "../../utils/akash/client";
import { queryLeaseServices, queryLeaseStatus } from "../../utils/akash/lease";
const router = Router();

router.get("/", async (res, req) => {
  const db = getAdminDB();
  const { data, error } = await db
    .from("nodes")
    .select("*")
    .neq("state", Lease_State.closed);
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data found");

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
    return { state, servicesUri, lease: lease.escrowPayment, id: node.id };
  });

  const results = await Promise.all(promises);

  const updates = results.map(async (result) => {
    const { error } = await db
      .from("nodes")
      .update({ state: result.state, provider_uris: result.servicesUri ?? [] })
      .eq("id", result.id);
    if (error) throw new Error(error.message);
  });

  await Promise.all(updates);

  req.json(results);
});

export default router;
