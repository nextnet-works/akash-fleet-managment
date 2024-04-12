import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";

import { DeploymentsResponse } from "@/types/deployment";
import { Card, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { queryKeys } from "@/lib/consts";

export const Deployments = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: [queryKeys.deployments],
    queryFn: async () => {
      const response = await axios.get<DeploymentsResponse>(
        "https://akash-api.polkachu.com/akash/deployment/v1beta3/deployments/list",
        {
          params: {
            ["filters.owner"]: "akash1d8zv92ex2chz29gyje8a8c9rtza6qs5pxyvjdc",
            ["filters.state"]: "active",
          },
        },
      );
      return response.data;
    },
  });

  const { mutateAsync: handleCloseDeployment } = useMutation({
    mutationKey: [queryKeys.close_deployment],
    mutationFn: async (id: string) =>
      await axios.post(`${import.meta.env.VITE_NODE_SERVER}/deploy/delete`, {
        body: {
          id,
        },
      }),
  });

  if (isError) return <div>Error</div>;

  return (
    <div className="flex flex-col gap-4">
      {data?.deployments.map((deployment) => (
        <Card
          key={deployment.escrow_account.id.xid}
          className="p-4 flex gap-4 justify-center items-center"
        >
          <CardTitle>{deployment.escrow_account.id.xid}</CardTitle>
          <Badge>{deployment.deployment.state}</Badge>
          <Button
            variant="secondary"
            onClick={() =>
              handleCloseDeployment(deployment.escrow_account.id.xid)
            }
          >
            {isPending ? "Closing..." : "Close Deployment"}
          </Button>
        </Card>
      ))}
    </div>
  );
};
