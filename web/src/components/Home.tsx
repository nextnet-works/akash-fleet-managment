import axios from "axios";

import { Card } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProviderResources } from "@/types/akash";

import { Deployments } from "./Deployemnts";
import { NODE_SERVER_API, queryKeys } from "@/lib/consts";
import { useCoinPrice } from "@/hooks/useCoinPrice";
import { useState } from "react";
import { PriceChart } from "./PriceChart";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export const Home = () => {
  const coinPrice = useCoinPrice();
  const [activeTShirts, setActiveTShirts] = useState<string[]>([]);
  const {
    data: providers,
    isPending,
    error,
  } = useQuery({
    queryKey: [queryKeys.create_deployment, activeTShirts],
    queryFn: async () => {
      const response = await axios.post<ProviderResources[]>(
        `${NODE_SERVER_API}/deploy/create`,
        {
          body: {
            deployment: activeTShirts[0],
          },
        },
      );
      return response.data;
    },
    enabled: activeTShirts.length > 0,
  });

  const handleButtonClick = async (c: string) => {
    setActiveTShirts((ps) => {
      if (ps.includes(c)) {
        return ps.filter((p) => p !== c);
      }
      return [...ps, c];
    });
  };

  const sortedProviders = providers?.sort((a, b) => {
    return a.price - b.price;
  })
    ? providers
    : [];

  const totalDeployments = sortedProviders?.reduce(
    (acc, curr) => {
      return {
        cpu: acc.cpu + curr.cpu,
        gpu: acc.gpu + curr.gpu,
        memory: acc.memory + curr.memory,
        storage: acc.storage + curr.storage,
      };
    },
    { cpu: 0, gpu: 0, memory: 0, storage: 0 },
  );

  return (
    <div
      className="p-4 gap-4 flex flex-col align-center w-full"
      style={{
        alignItems: "center",
      }}
    >
      <span className="text-2xl">Akash Coin Price: ${coinPrice}</span>
      <Tabs defaultValue="create">
        <TabsList className="grid  mx-auto w-[400px] grid-cols-2 ">
          <TabsTrigger value="list">Active Deployments</TabsTrigger>
          <TabsTrigger value="create">Create new Deploy</TabsTrigger>
        </TabsList>
        <TabsContent
          value="list"
          className="flex flex-col gap-4 align-items-center w-full"
        >
          <Deployments />
        </TabsContent>
        <TabsContent
          value="create"
          className="flex flex-col gap-4 align-items-center w-full text-center"
        >
          <ToggleGroup type="multiple" value={activeTShirts}>
            <ToggleGroupItem
              value="MORPHEUS"
              onClick={() => handleButtonClick("MORPHEUS")}
            >
              Mopheus
            </ToggleGroupItem>
            <ToggleGroupItem
              value="B"
              onClick={() => handleButtonClick("B")}
              disabled
            >
              TShirt-B
            </ToggleGroupItem>
            <ToggleGroupItem
              value="C"
              onClick={() => handleButtonClick("C")}
              disabled
            >
              TShirt-C
            </ToggleGroupItem>
            <ToggleGroupItem
              value="D"
              onClick={() => handleButtonClick("D")}
              disabled
            >
              TShirt-D
            </ToggleGroupItem>
          </ToggleGroup>
          {isPending && <h2>Loading...</h2>}
          {error && <h1>Error</h1>}
          {!isPending && !error ? (
            <>
              {!sortedProviders || sortedProviders.length === 0 ? (
                <h1>No Bids</h1>
              ) : (
                <>
                  <h1>Providers</h1>
                  <PriceChart
                    providers={sortedProviders ?? []}
                    coinPrice={coinPrice}
                  />
                  <div className="flex flex-col justify-between p-4 align-center">
                    <Card className="flex justify-between p-4">
                      <div className="w-[200px]">Provider</div>
                      <div className="w-[200px]">Deployment occupied</div>
                      <div className="w-[200px]">T-shirt average price</div>
                    </Card>
                    {sortedProviders.map((provider) => (
                      <Card
                        key={provider.provider}
                        className="flex justify-between p-4"
                      >
                        <div className="w-[200px]">
                          Akash -{" "}
                          {provider?.provider
                            ?.replace("akash", "")
                            .slice(0, 7) + "..."}
                        </div>
                        <div className="w-[200px]">
                          {provider.cpu} / {totalDeployments.cpu}{" "}
                        </div>
                        <div className="w-[200px]">{provider.price}</div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
};

{
  /* <div className="w-[200px]">
                          {Math.round(
                            provider.availableStats.memory / 1000000000
                          )}
                        </div>
                        <div className="w-[200px]">
                          {Math.round(
                            provider.availableStats.storage / 1000000000000
                          )}
                        </div>
                        <div className="w-[200px] flex flex-col gap-2">
                          {provider.gpuModels.map((gpu) => (
                            <Card key={gpu.model} className="flex gap-2 p-2">
                              <span>{gpu.vendor}</span>
                              <span>{gpu.model}</span>
                              <span>{gpu.ram}</span>
                              <span>{gpu.interface}</span>
                            </Card>
                          ))}
                        </div> */
}
