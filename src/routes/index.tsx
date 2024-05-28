import { createFileRoute } from "@tanstack/react-router";

import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { RPC_ENDPOINT, queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import { useLatestBlock } from "@/hooks/queries/useLatestBlock";
import { Analytics } from "@/components/dashboard/Analytics";

import { DashboardTable } from "@/components/dashboard/Table";
import { CreateDeployment } from "@/components/dashboard/CreateDeployment";
import axios from "axios";

import { LeaseResponse } from "@/types/akash";
import { useStore } from "@/store";
import { useState } from "react";
import { TableFilters } from "@/components/dashboard/TableFilters";
export const Route = createFileRoute("/")({
  component: Home,
});

export type Filters = {
  "pagination.limit": number;
  "filters.state": "active" | "closed" | null;
  "pagination.count_total": boolean;
};

function Home() {
  const akashKey = useStore((state) => state.akashKey);

  const [filters, setFilters] = useState<Filters>({
    "pagination.limit": 1000,
    "filters.state": "active",
    "pagination.count_total": true,
  });
  const {
    data: leases,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard, filters],
    queryFn: async () => {
      const res = await axios.get(
        `${RPC_ENDPOINT}/akash/market/v1beta4/leases/list`,
        {
          params: {
            "filters.owner": akashKey,
            ...filters,
          },
        }
      );

      return res.data.leases as LeaseResponse[];
    },
    refetchInterval: 10000,
    enabled: !!akashKey,
  });

  const currentBlock = useLatestBlock();

  if (!akashKey) {
    return (
      <div className="flex items-center justify-center h-96">
        Login with Keplr to view your deployments
      </div>
    );
  }

  if (isPending) return <Loader />;
  if (error) return <ErrorUI message={error.message} />;
  return (
    <div className="flex flex-col gap-4">
      <CreateDeployment />
      <hr />
      <TableFilters setFilters={setFilters} filters={filters} />
      {leases.length > 0 ? (
        <>
          <Analytics />
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
