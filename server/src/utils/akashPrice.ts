import axios from "axios";

type CoinGeckoResponse = {
  market_data: {
    current_price: {
      usd: number;
    };
  };
};

export const getAkashCoinPrice = async () => {
  const url = "https://api.coingecko.com/api/v3/coins/akash-network";
  const headers = {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY,
  };

  try {
    const response = await axios.get<CoinGeckoResponse>(url, { headers });
    const price = response.data.market_data.current_price.usd; // Accessing the USD price
    return price;
  } catch (error) {
    console.error("Error fetching Akash Coin price:", error);
    return null;
  }
};
