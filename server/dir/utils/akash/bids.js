"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBids = void 0;
const rpc_1 = require("@akashnetwork/akashjs/build/rpc");
const v1beta3_1 = require("@akashnetwork/akash-api/akash/market/v1beta3");
const consts_1 = require("./consts");
async function fetchBids(dseq, owner) {
    const rpc = await (0, rpc_1.getRpc)(consts_1.RPC_ENDPOINT);
    const client = new v1beta3_1.QueryClientImpl(rpc);
    const request = v1beta3_1.QueryBidsRequest.fromPartial({
        filters: {
            owner: owner,
            dseq: dseq,
            // gseq: 0, // Uncomment or add this if needed
        },
    });
    // Set timeout and minimum attempts
    const startTime = Date.now();
    const timeout = 1000 * 60 * 5; // 5 minutes timeout
    let attempts = 0;
    const minAttempts = 3;
    // Loop until the timeout is reached or minimum attempts are satisfied
    while (Date.now() - startTime < timeout || attempts < minAttempts) {
        console.log("Fetching bids...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        const bids = await client.Bids(request);
        attempts++;
        // If bids are found and minimum attempts have been met
        if (bids.bids.length > 0 &&
            bids.bids[0].bid !== undefined &&
            attempts >= minAttempts) {
            console.log("Bid fetched!");
            return bids.bids;
        }
    }
    return [];
}
exports.fetchBids = fetchBids;
//# sourceMappingURL=bids.js.map