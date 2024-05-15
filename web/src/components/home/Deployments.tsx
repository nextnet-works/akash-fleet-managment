import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "@tanstack/react-router";

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
import { useSdl } from "@/hooks/queries/useSdl";
import { useToast } from "../ui/use-toast";

export const Deployments = () => {
  const [sdlID, setSdlID] = useState<string>("");
  const sdls = useSdl();
  const { toast } = useToast();
  const { mutateAsync: handleCreateDeployment, isPending: isCreating } =
    useMutation({
      mutationFn: async (sdlID: string) => {
        if (!sdlID) {
          toast({
            title: "Error",
            description: "Please select a TShirt",
          });
          return;
        }

        const response = await axios.post<ProviderResources[]>(
          `${import.meta.env.VITE_NODE_SERVER_API}/deploy/create`,
          {
            body: {
              deploymentID: Number(sdlID),
            },
          }
        );
        return response.data;
      },
    });

  //   const { mutateAsync: handleStopDeployments, isPending: isStopping } =
  //   useMutation({
  //     mutationFn: async (sdlID: string) => {
  //       const response = await axios.post<ProviderResources[]>(
  //         `${import.meta.env.VITE_NODE_SERVER_API}/deploy/stop`,
  //         {
  //           body: {
  //             deployment: sdlID,
  //           },
  //         }
  //       );
  //       return response.data;
  //     },
  //   });

  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <Select onValueChange={(value) => setSdlID(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select TShirt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">Select TShirt</SelectItem>
              {sdls?.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>{" "}
        <Button asChild variant={"outline"}>
          <Link to="/yaml">Edit New</Link>
        </Button>
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
