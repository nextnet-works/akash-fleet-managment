import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProviderResources } from "@/types/akash";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

const sdls = [
  {
    name: "grafana-cpu-2vcpu-4gram-small",
    file: {
      version: "2.0",
      profiles: {
        compute: {
          grafana: {
            resources: {
              cpu: { units: 2 },
              memory: { size: "4Gi" },
              storage: [{ size: "64GB" }],
            },
          },
        },
        placement: {
          akash: {
            pricing: { grafana: { denom: "uakt", amount: 10000 } },
            attributes: { host: "akash" },
          },
        },
      },
      services: {
        grafana: {
          image: "grafana/grafana",
          expose: [{ as: 80, to: [{ global: true }], port: 3000 }],
        },
      },
      deployment: { grafana: { akash: { count: 1, profile: "grafana" } } },
    },
  },
  {
    name: "mining-rig-cpu-16vcpu-24gram-small",
    file: {
      version: "2.0",
      profiles: {
        compute: {
          "miner-xmrig": {
            resources: {
              cpu: { units: 16 },
              memory: { size: "24Gi" },
              storage: { size: "64Gi" },
            },
          },
        },
        placement: {
          akash: {
            pricing: { "miner-xmrig": { denom: "uakt", amount: 10000 } },
          },
        },
      },
      services: {
        "miner-xmrig": {
          env: [
            "ALGO=rx/0",
            "POOL=gulf.moneroocean.stream:20032",
            "WALLET=ZEPHYR2fAsLTnJG9v94FeHF6JaiZhnxH3bq5YkYYfQM8T7gfRW34T81jJPwNJtPyvPHhRsgFdbkGtcaNeGX4HiYH2d84FzMGcwv1y",
            "WORKER=akash",
            "PASS=x",
            "TLS=true",
            "TLS_FINGERPRINT=",
            "RANDOMX_MODE=fast",
            "CUSTOM_OPTIONS=",
            "AKASH_PROVIDER_STARTUP_CHECK=true",
          ],
          image: "cryptoandcoffee/akash-xmrig:40",
          expose: [
            { as: 80, to: [{ global: true }], port: 8080, proto: "tcp" },
          ],
        },
      },
      deployment: {
        "miner-xmrig": { akash: { count: 1, profile: "miner-xmrig" } },
      },
    },
  },
];

export const Deployments = () => {
  const [sdlID, setSdlID] = useState<string>("");
  const { toast } = useToast();
  const { mutateAsync: handleCreateDeployment, isPending: isCreating } =
    useMutation({
      mutationFn: async (sdl: string) => {
        if (!sdl) {
          toast({
            title: "Error",
            description: "Please select a SDL",
          });
          return;
        }
        const sdlFile = sdls.find((item) => item.name === sdl);
        if (!sdlFile) {
          toast({
            title: "Error",
            description: "SDL not found",
          });
          return;
        }

        const response = await axios.post<ProviderResources[]>(
          `${import.meta.env.VITE_NODE_SERVER_API}/deploy/create`,
          {
            body: {
              sdlFile: sdlFile.file,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );
        return response.data;
      },
    });

  // const { mutateAsync: handleStopDeployments, isPending: isStopping } =
  // useMutation({
  //   mutationFn: async (sdlID: string) => {
  //     const response = await axios.post<ProviderResources[]>(
  //       `${import.meta.env.VITE_NODE_SERVER_API}/deploy/stop`,
  //       {
  //         body: {
  //           deployment: sdlID,
  //         },
  //       }
  //     );
  //     return response.data;
  //   },
  // });

  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <Select onValueChange={(value) => setSdlID(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select SDL" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">Select SDL</SelectItem>
              {sdls?.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>{" "}
        <Button onClick={() => handleCreateDeployment(sdlID)}>
          {isCreating ? "Processing.." : "Deploy"}
        </Button>
      </div>
      <div>
        {isCreating && (
          <p className="text-sm text-gray-500">
            Your deployment is being processed, please wait a moment. The active
            node will be shown in the table below.
          </p>
        )}
      </div>
    </div>
  );
};
