import { useMutation } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { sdls } from "@/lib/consts";
import { handleSdlFlow } from "@/akash-js/lib/utils";
// import { createCert } from "@/akash-js/rpc/cert";
import { BidAPI } from "@/types/akash";

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

        let isBidsEmpty = false;
        const leasesResponses: BidAPI["bid_id"][] = [];
        let successfulLeaseCount = 0;
        while (!isBidsEmpty) {
          const leasesIds = await handleSdlFlow(sdlFile.file);
          toast({
            title: "Leases fulfilled",
            description: `${leasesIds.length} leases fulfilled`,
          });
          if (leasesIds.length === 0) {
            isBidsEmpty = true;
            return;
          }

          for (const lease of leasesIds) {
            if (successfulLeaseCount >= 5) {
              isBidsEmpty = true;
              return;
            }

            successfulLeaseCount++;
            if (!lease) {
              continue;
            }
            leasesResponses.push(lease);
          }
        }
      },
    });

  const localSDL = localStorage.getItem("sdl");

  return (
    <div className="flex flex-col items-center justify-between gap-4 min-w-96">
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
      </div>
      <div className="flex gap-4 w-full">
        <Button
          className="w-full"
          variant={"outline"}
          onClick={async (e) => {
            e.stopPropagation();
            await navigate({ to: "/sdl-editor" });
          }}
        >
          Create A New SDL
          <PlusIcon className="ml-2" />
        </Button>
        <Button
          onClick={() => handleCreateDeployment(sdlID)}
          className="w-full"
        >
          {isCreating ? "Processing.." : "Deploy"}
        </Button>
        {/* <Button onClick={createCert}>Create Cert</Button> */}
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
