import { queryKeys } from "@/lib/consts";
import { useStore } from "@/store";
import { LeaseResponse } from "@/types/akash";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDashboardSummary = () => {
  const akashKey = useStore((state) => state.akashKey);
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
            "filters.owner": akashKey,
            "pagination.limit": 200,
            "pagination.count_total": true,
          },
        }
      );

      return res.data.leases as LeaseResponse[];
    },
    enabled: !!akashKey,
  });

  return { leases, error, isPending };
};
