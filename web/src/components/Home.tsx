import axios from "axios";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Bid } from "@/types/bid";

import { DeployButton } from "./DeployButton";
import { Deployments } from "./Deployemnts";
import { queryKeys } from "@/lib/consts";
import { useCoinPrice } from "@/hooks/useCoinPrice";

export const Home = () => {
  const coinPrice = useCoinPrice();
  const {
    data: bids,
    isPending,
    error,
    mutateAsync: deploy,
  } = useMutation({
    mutationKey: [queryKeys.create_deployment],
    mutationFn: async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const response = await axios.post<Bid[]>(
        `${import.meta.env.VITE_NODE_SERVER}/deploy/create`
      );
      return response.data;
    },
  });

  return (
    <div
      className="p-4 gap-4 flex flex-col align-center w-full"
      style={{
        alignItems: "center",
      }}
    >
      <span className="text-2xl">Akash Coin Price: ${coinPrice}</span>
      <Tabs defaultValue="list">
        <TabsList className="grid  mx-auto w-[400px] grid-cols-2 ">
          <TabsTrigger value="list">Active Deployments</TabsTrigger>
          <TabsTrigger value="create">Create new Deploy</TabsTrigger>
        </TabsList>
        <TabsContent
          value="list"
          className="p-4 flex-col gap-4 align-items-center w-full"
        >
          <Deployments />
        </TabsContent>
        <TabsContent value="create" className="text-center">
          {isPending ? <h1>Loading...</h1> : null}
          {error ? <h1>Error</h1> : null}
          {!bids || bids.length === 0 ? (
            <h1>No Bids</h1>
          ) : (
            <>
              <h1>Bids</h1>
              <div className="flex flex-col justify-between p-4 gap-4">
                {bids.map((bid) => (
                  <Card
                    key={bid.bid.bid_id.dseq}
                    className="flex justify-between p-4"
                  >
                    {bid.bid.bid_id.dseq}
                    <h2>{bid.bid.state}</h2>
                    <DeployButton bidId={bid.bid.bid_id.dseq} />
                  </Card>
                ))}
              </div>
            </>
          )}
          <Button onClick={deploy}>Create Deployment</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
