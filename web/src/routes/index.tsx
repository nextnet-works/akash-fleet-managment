import { createFileRoute } from "@tanstack/react-router";

import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { queryKeys } from "@/lib/consts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { useEffect } from "react";
import { Dashboard } from "@/components/home/Dashboard";

import { addRanking } from "@/components/home/utils";
import { Tables } from "@/types/supabase.gen";
import { DashboardTable } from "@/components/home/Table";
import { Deployments } from "@/components/home/Deployments";
import { Compare } from "@/components/home/Compare";
// import { Compare } from "@/components/home/Compare";
export const Route = createFileRoute("/")({
  component: Home,
  loader: Loader,
  errorComponent: ErrorUI,
});

function Home() {
  const queryClient = useQueryClient();
  const {
    data: nodes,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard],
    queryFn: async () => {
      const { data, error } = await db
        .from("nodes")
        .select("*, sdl(*)")
        .eq("state", Lease_State.active)
        .order("dseq", { ascending: false });
      if (error) {
        throw error;
      }

      return addRanking(data) as unknown as (Tables<"nodes"> & {
        sdl: Tables<"sdl">;
        rank: number;
      })[];
    },
  });

  const currentBlock = useLatestBlock();

  useEffect(() => {
    const listener = db
      .channel("nodes_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nodes" },
        async () => {
          return await queryClient.invalidateQueries({
            queryKey: [queryKeys.dashboard],
          });
        }
      )
      .subscribe();
    return () => {
      listener.unsubscribe();
    };
  }, []);

  if (isPending) return <Loader />;
  if (error) return <ErrorUI message={error.message} />;
  return (
    <div className="flex flex-col gap-4">
      <Deployments />
      {nodes.length > 0 ? (
        <>
          <Dashboard />
          <Compare />
          <DashboardTable nodes={nodes} currentBlock={currentBlock} />
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-medium">No active nodes found</p>
        </div>
      )}
    </div>
  );
}
