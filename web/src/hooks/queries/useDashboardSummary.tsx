import { queryKeys } from "@/lib/consts";
import { LeaseResponse } from "@/types/akash";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDashboardSummary = () => {
  const {
    data: leases,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard, "summary"],
    queryFn: async () => {
      const res = await axios.get(
        "https://akash-api.polkachu.com/akash/market/v1beta4/leases/list",
        {
          params: {
            "filters.owner": "akash1yddk6apmrtkcfzn85h5arnz7dfel8qxdyc02xa",
            "pagination.limit": 1000,
            "pagination.count_total": true,
          },
        }
      );

      return res.data.leases as LeaseResponse[];
    },
  });

  return { leases, error, isPending };
};
