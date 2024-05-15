import { queryKeys } from "@/lib/consts";
import { db } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useDashboardSummary = () => {
  const {
    data: nodes,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard, "summary"],
    queryFn: async () => {
      const { data, error } = await db
        .from("nodes")
        .select("*")
        .order("dseq", { ascending: false });
      if (error) {
        throw error;
      }
      return data;
    },
  });

  return { nodes, error, isPending };
};
