"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockHeightAndAkashPrice = exports.loadBidsFromDB = exports.saveBidsToDB = exports.getAdminDB = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const akashPrice_1 = require("./akashPrice");
const client_1 = require("../akash-js/client");
const getAdminDB = () => {
    const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SERVICE_ROLE_KEY);
    return supabase;
};
exports.getAdminDB = getAdminDB;
async function saveBidsToDB(bids, blockHeight) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SERVICE_ROLE_KEY);
        const { akashPrice } = await (0, exports.getBlockHeightAndAkashPrice)();
        const output = bids.map((bid) => {
            return {
                id: bid.escrowAccount?.id?.xid ?? "",
                json: JSON.stringify(bid),
                akash_price_usd: akashPrice,
                block_height: blockHeight,
            };
        });
        const { error } = await supabase.from("bids").upsert(output);
        if (error) {
            throw error;
        }
    }
    catch (error) {
        console.error("Error saving bids to database:", error);
        throw error;
    }
}
exports.saveBidsToDB = saveBidsToDB;
async function loadBidsFromDB() {
    const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SERVICE_ROLE_KEY);
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
const getBlockHeightAndAkashPrice = async () => {
    const akashPrice = await (0, akashPrice_1.getAkashCoinPrice)();
    const { client } = await (0, client_1.loadPrerequisites)();
    const blockHeight = await client.getHeight();
    return { blockHeight, akashPrice };
};
exports.getBlockHeightAndAkashPrice = getBlockHeightAndAkashPrice;
//# sourceMappingURL=db.js.map