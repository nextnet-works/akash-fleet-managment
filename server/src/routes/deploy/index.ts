import { Deployment, DEPLOYMENT } from "./consts";
import { Router } from "express";

import { closeDeployment, handleSdlFlow } from "./utils";
import { ProviderSupply, SuccessfulLease } from "../../type";

const router = Router();
const MAX_LEASES = 10;

router.post("/create", async (req, res) => {
  const deployment = req.body.body.deployment as Deployment;

  if (!deployment) {
    return res.status(400).send("deployment is required");
  }

  const resourceUsed = DEPLOYMENT[deployment];

  // TODO: save prices of each provider
  const providerSupplies: ProviderSupply[] = [];

  let isBidsEmpty = false;
  let leasesResponses: SuccessfulLease[] = [];
  let successfulLeaseCount = 0;
  let ownerGen = "";
  while (!isBidsEmpty) {
    const { leasedAccepted, owner } = await handleSdlFlow();
    ownerGen = owner;
    if (leasedAccepted.length === 0) {
      isBidsEmpty = true;
      return;
    }

    for (const lease of leasedAccepted) {
      if (successfulLeaseCount >= MAX_LEASES) {
        isBidsEmpty = true;
        return;
      }

      const providerIndex = providerSupplies.findIndex(
        (provider) => provider.name === lease.provider
      );

      if (providerIndex === -1) {
        providerSupplies.push({ ...resourceUsed, name: lease.provider });
      } else {
        providerSupplies[providerIndex].cpu += resourceUsed.cpu;
        providerSupplies[providerIndex].gpu += resourceUsed.gpu;
        providerSupplies[providerIndex].memory += resourceUsed.memory;
        providerSupplies[providerIndex].storage += resourceUsed.storage;
      }

      successfulLeaseCount++;
      leasesResponses = leasesResponses.concat(lease);
    }
  }

  const closedDeploymentsPromises = leasesResponses
    .filter((lease) => lease.isSuccess)
    .map((lease) => closeDeployment(lease.dseq, ownerGen));

  await Promise.all(closedDeploymentsPromises);

  res.status(201).json(providerSupplies);
});

export default router;
