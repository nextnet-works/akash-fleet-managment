import { Bid } from "../type";
import { createClient } from "@supabase/supabase-js";
import { getAkashCoinPrice } from "../utils/price";

export async function saveBidsToDB(bids: Bid[]): Promise<void> {
    try {
      const supabase = createClient(
        process.env.SUPABASE_PROJECT_URL!,
        process.env.SERVICE_ROLE_KEY!,
      );
      const akashPrice = await getAkashCoinPrice();
  
      const output = bids.map((bid) => {
        return {
          id: bid.escrow_account.id.xid,
          json: bid,
          akash_price_usd: akashPrice,
        };
      });
      const { error } = await supabase.from("bids").upsert(output);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error saving bids to database:", error);
      throw error;
    }
  }
  
  export async function loadBidsFromDB(): Promise<{ id: string; owner: unknown }[]> {
    const supabase = createClient(
      process.env.SUPABASE_PROJECT_URL!,
      process.env.SERVICE_ROLE_KEY!,
    );
    const { data, error } = await supabase.from("bids").select(`
    id,
    owner:  json->bid->bid_id->owner
  `);
    if (error) {
      throw error;
    }
    return data ?? [];
  }
  