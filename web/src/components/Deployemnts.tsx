import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";

import { DeploymentsResponse } from "@/types/deployment";
import { Card, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { NODE_SERVER_API, queryKeys } from "@/lib/consts";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";

export const Deployments = () => {
  const [akashKey, setAkashKey] = useState<string>(
    "akash1yddk6apmrtkcfzn85h5arnz7dfel8qxdyc02xa",
  );
  const debouncedKey = useDebounce(akashKey, 500);

  const { data, isPending, isError } = useQuery({
    queryKey: [queryKeys.deployments, debouncedKey],
    queryFn: async () => {
      const response = await axios.get<DeploymentsResponse>(
        "https://akash-api.polkachu.com/akash/deployment/v1beta3/deployments/list",
        {
          params: {
            ["filters.owner"]: debouncedKey,
            ["filters.state"]: ["active", "closed"],
          },
        },
      );
      return response.data;
    },
  });

  const { mutateAsync: handleCloseDeployment } = useMutation({
    mutationKey: [queryKeys.close_deployment],
    mutationFn: async (id: string) =>
      await axios.post(`${NODE_SERVER_API}/deploy/delete`, {
        body: {
          id,
        },
      }),
  });

  if (isError) return <div>Error</div>;

  const sortedDploymentsByDesc =
    data?.deployments.sort(
      (a, b) =>
        Number(b.deployment.deployment_id.dseq) -
        Number(a.deployment.deployment_id.dseq),
    ) || [];

  return (
    <div className="flex flex-col gap-4 w-full">
      <Input
        placeholder="Akash key.."
        onChange={(e) => setAkashKey(e.target.value)}
        value={akashKey}
      />
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
          {sortedDploymentsByDesc.map((deployment) => (
            <Card
              key={deployment.escrow_account.id.xid}
              className="p-4 flex gap-4 items-center"
            >
              <CardTitle>{deployment.deployment.created_at}</CardTitle>
              {deployment.deployment.state === "active" && (
                <Button
                  variant="secondary"
                  className="ml-auto"
                  onClick={() =>
                    handleCloseDeployment(deployment.escrow_account.id.xid)
                  }
                >
                  {isPending ? "Closing..." : "Close Deployment"}
                </Button>
              )}
              <Badge
                className={`${
                  deployment.deployment.state === "active"
                    ? "bg-green-500"
                    : "bg-slate-500"
                } ml-auto`}
              >
                {deployment.deployment.state}
              </Badge>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};
