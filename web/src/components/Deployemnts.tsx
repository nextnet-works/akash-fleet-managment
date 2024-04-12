import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";

import { DeploymentsResponse } from "@/types/deployment";

export const Deployments = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["Deployments"],
    queryFn: async () => {
      const response = await axios.get<DeploymentsResponse>("https://akash-api.polkachu.com/akash/deployment/v1beta3/deployments/list", {
        params: {
          ["filters.owner"]: "akash1d8zv92ex2chz29gyje8a8c9rtza6qs5pxyvjdc",
          ["filters.state"]: "active",
        },
      });
      return response.data;
    },
  });

  const { mutateAsync: handleCloseDeployment } = useMutation({
    mutationKey: ["Close_Deployment"],
    mutationFn: async (id: string) =>
      await axios.post(`http://localhost:3001/deploy/delete`, {
        body: {
          id,
        },
      }),
  });

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div>
      <h1>Deployments</h1>
      {data?.deployments.map((deployment) => (
        <div
          key={deployment.escrow_account.id.xid}
          style={{
            border: "1px solid black",
            display: "flex",
            gap: "15px",
            padding: "10px",
            alignItems: "center",
            width: "fit-content",
            borderRadius: "10px",
          }}
        >
          <h2>{deployment.escrow_account.id.xid}</h2>
          <h2>{deployment.deployment.state}</h2>
          <button onClick={() => handleCloseDeployment(deployment.escrow_account.id.xid)}>Close Deployment</button>
        </div>
      ))}
    </div>
  );
};
