import { NODE_SERVER_API, queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCoinPrice = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.coin_price],
    refetchInterval: 10000, // Refetch every 60 seconds
    queryFn: async () => {
      try {
        const response = await axios.get<number>(
          `${NODE_SERVER_API}/akash-coin-price`,
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
