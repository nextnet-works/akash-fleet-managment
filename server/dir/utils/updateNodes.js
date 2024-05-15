"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNodes = void 0;
const v1beta4_1 = require("@akashnetwork/akash-api/akash/market/v1beta4");
const db_1 = require("./db");
const client_1 = require("../akash-js/client");
const lease_1 = require("../akash-js/lease");
const updateNodes = async () => {
    console.log("Updating nodes");
    const db = (0, db_1.getAdminDB)();
    const { data, error } = await db
        .from("nodes")
        .select("*")
        .neq("state", v1beta4_1.Lease_State.closed);
    if (error)
        console.log("Error fetching nodes", error);
    if (!data)
        throw new Error("No nodes found");
    const { wallet } = await (0, client_1.loadPrerequisites)();
    const account = await wallet.getAccounts();
    const promises = data.map(async (node) => {
        const bidId = {
            $type: "akash.market.v1beta4.BidID",
            gseq: node.gseq,
            dseq: node.dseq,
            oseq: 1,
            owner: account[0].address,
            provider: node.akash_provider,
        };
        const lease = await (0, lease_1.queryLeaseStatus)(bidId);
        const state = lease?.lease?.state;
        const { servicesUri } = await (0, lease_1.queryLeaseServices)(bidId);
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
        })
            .eq("id", result.id);
        if (error)
            throw new Error(error.message);
    });
    await Promise.all(updates);
    const { data: closedNodes, error: closedNodesError } = await db
        .from("nodes")
        .select("*")
        .eq("state", v1beta4_1.Lease_State.closed)
        .is("lease_last_block", null);
    if (closedNodesError)
        throw new Error("Error fetching closed nodes");
    if (!closedNodes) {
        return;
    }
    const closedUpdates = closedNodes.map(async (node) => {
        const bidId = {
            $type: "akash.market.v1beta4.BidID",
            gseq: node.gseq,
            dseq: node.dseq,
            oseq: 1,
            owner: account[0].address,
            provider: node.akash_provider,
        };
        const lease = await (0, lease_1.queryLeaseStatus)(bidId);
        const state = lease?.lease?.state;
        const { servicesUri } = await (0, lease_1.queryLeaseServices)(bidId);
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
        if (error)
            throw new Error(error.message);
    });
    await Promise.all(closedNodeUpdates);
};
exports.updateNodes = updateNodes;
//# sourceMappingURL=updateNodes.js.map