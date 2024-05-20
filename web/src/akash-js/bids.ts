import { getRpc } from "@akashnetwork/akashjs/build/rpc";
import {
  QueryBidsRequest,
  QueryBidsResponse,
  QueryClientImpl as QueryMarketClient,
} from "@akashnetwork/akash-api/akash/market/v1beta4";

import { RPC_ENDPOINT } from "./lib/consts";

export async function fetchBids(
  dseq: number,
  owner: string,
  minAttempts = 3
): Promise<QueryBidsResponse["bids"]> {
  const rpc = await getRpc(RPC_ENDPOINT);
  const client = new QueryMarketClient(rpc);

  const request = QueryBidsRequest.fromPartial({
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

  // Loop until the timeout is reached or minimum attempts are satisfied
  while (Date.now() - startTime < timeout || attempts < minAttempts) {
    console.log("Fetching bids...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    const bids = await client.Bids(request);
    attempts++;

    // If bids are found and minimum attempts have been met
    if (
      bids.bids.length > 0 &&
      bids.bids[0].bid !== undefined &&
      attempts >= minAttempts
    ) {
      console.log("Bid fetched!");
      return bids.bids;
    }
  }

  return [];
}
