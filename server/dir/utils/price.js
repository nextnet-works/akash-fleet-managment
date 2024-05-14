"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAkashCoinPrice = void 0;
const axios_1 = __importDefault(require("axios"));
const getAkashCoinPrice = async () => {
    const url = "https://api.coingecko.com/api/v3/coins/akash-network";
    const headers = {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY,
    };
    try {
        const response = await axios_1.default.get(url, { headers });
        const price = response.data.market_data.current_price.usd; // Accessing the USD price
        return price;
    }
    catch (error) {
        console.error("Error fetching Akash Coin price:", error);
        return null;
    }
};
exports.getAkashCoinPrice = getAkashCoinPrice;
//# sourceMappingURL=price.js.map