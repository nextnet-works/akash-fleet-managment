import { queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCoinPrice = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.coin_price],
    refetchInterval: 60000, // Refetch every 60 seconds
    queryFn: async () => {
      try {
        const response = await axios.get<number>(
          `${import.meta.env.VITE_NODE_SERVER_API}/akash-coin-price`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
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
