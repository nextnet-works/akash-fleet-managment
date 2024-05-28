import { RPC_ENDPOINT } from "@/lib/consts";
import { BidAPI } from "@/types/akash";
import axios from "axios";

export async function fetchBids(
  dseq: number,
  owner: string,
  minAttempts = 3
): Promise<BidAPI[]> {
  const startTime = Date.now();
  const timeout = 1000 * 60 * 1; // 1 minutes timeout
  let attempts = 0;

  // Loop until the timeout is reached or minimum attempts are satisfied
  while (Date.now() - startTime < timeout || attempts < minAttempts) {
    console.log("Fetching bids...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    const bids = await axios.get<{ bids: { bid: BidAPI }[] }>(
      `${RPC_ENDPOINT}/akash/market/v1beta4/bids/list`,
      {
        params: {
          "filters.owner": owner,
          "filters.dseq": dseq,
        },
      }
    );

    attempts++;
    // If bids are found and minimum attempts have been met
    if (
      bids.data.bids.length > 0 &&
      bids.data.bids[0].bid !== undefined &&
      attempts >= minAttempts
    ) {
      console.log("Bid fetched!");
      return bids.data.bids.map((bid) => bid.bid);
    }
  }

  return [];
}
