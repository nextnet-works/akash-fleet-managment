import { createFileRoute } from "@tanstack/react-router";

import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { Dashboard } from "@/components/home/Dashboard";

import { DashboardTable } from "@/components/home/Table";
import { Deployments } from "@/components/home/Deployments";
import axios from "axios";
import { LeaseResponse } from "@/types/akash";
export const Route = createFileRoute("/")({
  component: Home,
  loader: Loader,
  errorComponent: ErrorUI,
});

function Home() {
  const {
    data: leases,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard],
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

  const currentBlock = useLatestBlock();

  if (isPending) return <Loader />;
  if (error) return <ErrorUI message={error.message} />;
  return (
    <div className="flex flex-col gap-4">
      <Deployments />
      {leases.length > 0 ? (
        <>
          <Dashboard />
          <DashboardTable leases={leases} currentBlock={currentBlock} />
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-medium">No active nodes found</p>
        </div>
      )}
    </div>
  );
}
