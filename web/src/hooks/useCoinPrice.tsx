import { queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type CoinGeckoResponse = {
  market_data: {
    current_price: {
      usd: number;
    };
  };
};

export const useCoinPrice = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.coin_price],
    refetchInterval: 10000, // Refetch every 60 seconds
    queryFn: async () => {
      try {
        const response = await axios.get<number>(
          `${import.meta.env.VITE_NODE_SERVER}/akash-coin-price`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching Akash Coin price:", error);
        return null;
      }
    },
  });
  return data ?? 0;
};
