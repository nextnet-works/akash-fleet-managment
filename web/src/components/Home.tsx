import axios from "axios";

import { Card } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Provider } from "@/types/akash";

// import { DeployButton } from "./DeployButton";
import { Deployments } from "./Deployemnts";
import { NODE_SERVER_API, queryKeys } from "@/lib/consts";
import { useCoinPrice } from "@/hooks/useCoinPrice";
// import { Input } from "./ui/input";
import { useState } from "react";
import { PriceChart } from "./PriceChart";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export const Home = () => {
  const coinPrice = useCoinPrice();
  const [activeTShirts, setActiveTShirts] = useState<string[]>([]);
  // const [fileName, setFileName] = useState<string>("morpheus-deploy");
  const {
    data: providers,
    isPending,
    error,
  } = useQuery({
    queryKey: [queryKeys.create_deployment, activeTShirts],
    queryFn: async () => {
      const response = await axios.post<Provider[]>(
        `${NODE_SERVER_API}/deploy/create`,
        {
          body: {
            fileName: activeTShirts,
          },
        }
      );
      return response.data;
    },
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
  });

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
            <ToggleGroupItem value="A" onClick={() => handleButtonClick("A")}>
              TShirt-A
            </ToggleGroupItem>
            <ToggleGroupItem value="B" onClick={() => handleButtonClick("B")}>
              TShirt-B
            </ToggleGroupItem>
            <ToggleGroupItem value="C" onClick={() => handleButtonClick("C")}>
              TShirt-C
            </ToggleGroupItem>
            <ToggleGroupItem value="D" onClick={() => handleButtonClick("D")}>
              TShirt-D
            </ToggleGroupItem>
          </ToggleGroup>

          {isPending ? <h1>Loading...</h1> : null}
          {error ? <h1>Error</h1> : null}
          {!sortedProviders || sortedProviders.length === 0 ? (
            <h1>No Bids</h1>
          ) : (
            <>
              <h1>Providers</h1>
              <PriceChart providers={sortedProviders} coinPrice={coinPrice} />
              <div className="flex flex-col justify-between p-4 align-center">
                <Card className="flex justify-between p-4">
                  <div className="w-[200px]">Provider</div>
                  <div className="w-[200px]">Price (USD/hr)</div>

                  <div className="w-[200px]">CPU (Units)</div>
                  <div className="w-[200px]">GPU (Units)</div>
                  <div className="w-[200px]">Memory (GB)</div>
                  <div className="w-[200px]">Storage (TB)</div>
                  <div className="w-[200px]">GPU type</div>
                </Card>
                {sortedProviders.map((provider) => (
                  <Card
                    key={provider.createdHeight}
                    className="flex justify-between p-4"
                  >
                    <div className="w-[200px]">
                      {provider?.name?.replace("provider.", "")}
                    </div>
                    <div className="w-[200px]">
                      {(
                        ((provider.price * 438000) / 1000000) *
                        coinPrice
                      ).toFixed(1)}
                    </div>
                    <div className="w-[200px]">
                      {provider.availableStats.cpu / 1000}
                    </div>
                    <div className="w-[200px]">
                      {provider.availableStats.gpu}
                    </div>
                    <div className="w-[200px]">
                      {Math.round(provider.availableStats.memory / 1000000000)}
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
                    </div>

                    {/* <DeployButton
                      dseq={bid.bid.bid_id.dseq}
                      provider={bid.bid.bid_id.provider}
                    /> */}
                  </Card>
                ))}
              </div>
            </>
          )}
          {/* <Input
            placeholder="Type the <xxx>.sdl.yaml file"
            onChange={(e) => setFileName(e.target.value)}
            value={fileName}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
