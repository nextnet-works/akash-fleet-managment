import { DEPLOYMENT_RESOURCES } from "../../akash-js/lib/consts";
import { Router } from "express";

import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { handleSdlFlow } from "./utils";
import { closeDeployment } from "../../akash-js/closeDeployment";
import { DeploymentResources, ProviderSupply } from "../../akash-js/lib/types";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase.gen";

const router = Router();
const MAX_LEASES = 10;

router.post("/create", async (req, res) => {
  try {
    const deploymentID = req.body?.body?.deploymentID as DeploymentResources;

    if (!deploymentID) {
      return res.status(400).send("deployment is required");
    }
    const supabase = createClient<Database>(
      process.env.SUPABASE_PROJECT_URL!,
      process.env.SERVICE_ROLE_KEY!
    );

    const { data: sdl } = await supabase
      .from("sdl")
      .select("*")
      .eq("id", deploymentID)
      .single();

    if (!sdl) {
      return res.status(400).send("deployment not found");
    }

    const resourceUsed =
      DEPLOYMENT_RESOURCES[sdl.name as keyof typeof DEPLOYMENT_RESOURCES];

    // TODO: save prices of each provider
    const providerSupplies: ProviderSupply[] = [];

    let isBidsEmpty = false;
    let leasesResponses: { bidId: BidID }[] = [];
    let successfulLeaseCount = 0;
    while (!isBidsEmpty) {
      const { activeNodes } = await handleSdlFlow(sdl.id);
      console.log(`Leases fulfilled: ${activeNodes.length}`);
      if (activeNodes.length === 0) {
        isBidsEmpty = true;
        return;
      }

      for (const lease of activeNodes) {
        if (successfulLeaseCount >= MAX_LEASES) {
          isBidsEmpty = true;
          return;
        }

        const providerIndex = providerSupplies.findIndex(
          (provider) => provider.name === lease.bidId?.provider
        );

        if (providerIndex === -1) {
          providerSupplies.push({
            ...resourceUsed,
            name: lease?.bidId?.provider ?? "",
          });
        } else {
          providerSupplies[providerIndex].cpu += resourceUsed.cpu;
          providerSupplies[providerIndex].gpu += resourceUsed.gpu;
          providerSupplies[providerIndex].memory += resourceUsed.memory;
          providerSupplies[providerIndex].storage += resourceUsed.storage;
        }

        successfulLeaseCount++;
        leasesResponses.push(lease as { bidId: BidID });
      }
    }

    for (const lease of leasesResponses) {
      await closeDeployment(lease.bidId?.dseq.toString() ?? "");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    res.status(201).json(providerSupplies);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal server error");
  }
});

export default router;
