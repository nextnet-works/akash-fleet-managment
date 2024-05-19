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
import { PlusIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { sdls } from "@/lib/consts";

export const Deployments = () => {
  const [sdlID, setSdlID] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
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
          }
        );
        return response.data;
      },
    });

  const localSDL = localStorage.getItem("sdl");
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
              {localSDL && (
                <SelectItem value="local">Your Local SDL</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>{" "}
        <Button onClick={() => handleCreateDeployment(sdlID)}>
          {isCreating ? "Processing.." : "Deploy"}
        </Button>
        <Button
          onClick={() => navigate({ to: "/sdl-editor" })}
          size="icon"
          variant="secondary"
        >
          <PlusIcon />
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
