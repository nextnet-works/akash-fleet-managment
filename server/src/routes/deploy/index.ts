import { Router } from "express";

import { BidID } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { handleSdlFlow } from "./utils";
import { closeDeployment } from "../../akash-js/closeDeployment";
import { ProviderSupply } from "../../akash-js/lib/types";
import { createClient } from "@supabase/supabase-js";

const router = Router();
const MAX_LEASES = 10;

router.post("/create", async (req, res) => {
  try {
    const deploymentID = req.body?.body?.deploymentID;

    if (!deploymentID) {
      return res.status(400).send("deployment is required");
    }

    // TODO: save prices of each provider
    const providerSupplies: ProviderSupply[] = [];

    let isBidsEmpty = false;
    let leasesResponses: { bidId: BidID }[] = [];
    let successfulLeaseCount = 0;
    while (!isBidsEmpty) {
      const { activeNodes } = await handleSdlFlow();
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
