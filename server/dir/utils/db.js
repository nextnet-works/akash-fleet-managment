"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBidsFromDB = exports.saveBidsToDB = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const price_1 = require("../utils/price");
async function saveBidsToDB(bids) {
  try {
    const supabase = (0, supabase_js_1.createClient)(
      process.env.SUPABASE_PROJECT_URL,
      process.env.SERVICE_ROLE_KEY,
    );
    const akashPrice = await (0, price_1.getAkashCoinPrice)();
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
exports.saveBidsToDB = saveBidsToDB;
async function loadBidsFromDB() {
  const supabase = (0, supabase_js_1.createClient)(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SERVICE_ROLE_KEY,
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
exports.loadBidsFromDB = loadBidsFromDB;
//# sourceMappingURL=db.js.map
